import { app, BrowserWindow, ipcMain, shell, dialog, protocol, net  } from 'electron'
import { createRequire } from 'node:module'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { useScraper } from '../preload/scraper'
import db from '@alinsme/electron-db'
import {rmSync} from "node:fs";


const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '../..')

var totalLoops = 10;
var savedir = null;

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

protocol.registerSchemesAsPrivileged([
  {
    scheme: "media",
    privileges: {
      secure: true,
      supportFetchAPI: true,
      bypassCSP: true,
      stream: true
    }
  }
]);

let win: BrowserWindow | null = null
const preload = path.join(__dirname, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 900,
    title: 'Main window',
    show: false,
    icon: 'icons/win/icon.ico',
    webPreferences: {
      preload,
      //Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      //nodeIntegration: true,

      //Consider using contextBridge.exposeInMainWorld
      //Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      //contextIsolation: false,
    },
  });
  win.on('ready-to-show', win.show);
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    win.setMenu(null);
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344
}

app.whenReady().then(() => {
  protocol.handle('media', (req) => {
    const pathToMedia = new URL(req.url).pathname;
    return net.fetch(`file://${pathToMedia}`);
  });

  createWindow()
})

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})
ipcMain.on('delete-home', (event, args) => {
  const location = app.getPath("userData");
  const { path, title, id } = args;
  event.sender.send('loading', true);
  db.deleteRow('properties', location, {'id': id }, (succ, msg) => {
    if(path !== null) {
      rmSync(path, { recursive: true, force: true });
    }
    db.getAll('properties', location, (succ, data) => {
      if(succ) {
        event.sender.send('properties-set', data);
        event.sender.send('status',`Successfully deleted ${title}`);
      }
      event.sender.send('loading', false);
    });
  });
});

ipcMain.on('open-dir', (event, args) => {
  const { dir, url } = args;
  if(dir !== null) {
    shell.openPath(dir);
  } else if(url !== null) {
    shell.openExternal(url);
  }
});
ipcMain.on('set-loop', (event, args) => {
  const location = app.getPath("userData");
  useScraper(event.sender, db, location, savedir);

  totalLoops = parseInt(args);
  event.sender.send('loop-status',`Loops: ${totalLoops}`);
});

ipcMain.on('set-dir', (event, args) => {
  const location = app.getPath("userData");
  useScraper(event.sender, db, location, savedir);

  dialog.showOpenDialog(null, {
    title: "Select save directory",
    buttonLabel : "Save to",
    properties: ['createDirectory', 'promptToCreate', 'openDirectory']
  }).then(({ filePaths }) => {
    if(filePaths && filePaths.length === 1) {
      savedir = filePaths[0];
      event.sender.send('status', `Saving photos to ${savedir}`);
      event.sender.send('dir-set', savedir);
    } else {
      savedir = null;
      event.sender.send('status', 'Cancelled.');
      event.sender.send('dir-set', savedir);
    }
  });
});



ipcMain.on('check-db', (event, args) => {
  event.sender.send('status','Creating database');
  const location = app.getPath("userData");
  db.createTable('properties', location, (succ, msg) => {
    event.sender.send('status','DB: ' + msg);
  });
  db.getAll('properties', location, (succ, data) => {
    if(succ) {
      event.sender.send('properties-set', data);
      event.sender.send('status','Checking checked!');
    }
  });
});
ipcMain.on('command', (event, args) => {
  const location = app.getPath("userData");
  const { init, getAllLinks } = useScraper(event.sender, db, location, savedir);

  if(args === 'getAllLinks') {
    event.sender.send('status','Extracting...');
    db.clearTable('properties', location, (succ, msg) => {
      db.getAll('properties', location, (succ, data) => {
        event.sender.send('properties-set', data);
        getAllLinks(totalLoops);
      });
    })
  } else if(args === 'init') {
    event.sender.send('status','Initializing...');
    db.getRows('properties', location, {
      'status': null
    }, (succ, data) => {
      event.sender.send('properties-set', data);
      init(data, totalLoops);
    });
  } else if(args === 'loops') {
    event.sender.send('status','Total loops: ' + totalLoops);
  } else if(args === 'empty-db') {
    event.sender.send('loading', true);
    event.sender.send('status','Deleting database...');
    db.clearTable('properties', location, (succ, msg) => {
      if (succ) {
        db.getAll('properties', location, (succ, data) => {
          if (succ) {
            event.sender.send('properties-set', data);
            event.sender.send('status', 'Database cleared');
          }
        });
      }
      event.sender.send('loading', false);
    })
  }
});


// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})
