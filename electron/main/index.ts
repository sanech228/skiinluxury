import { app, BrowserWindow, ipcMain, shell, dialog, protocol, net } from 'electron';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { useScraper } from '../preload/scraper';
import db from '@alinsme/electron-db';
import {rmSync} from "node:fs";
import Store from 'electron-store';
//@ts-ignore
// import appIcon from '../../dist/icons/win/icon.ico?asset'
// Electron Builder
import AnyStack from '@anystack/electron-license';
import { getAutoUpdater } from '../preload/autoupdater';
// End imports


const productId = import.meta.env.VITE_APP_ANYSTACK_PRODUCT_ID;
const key = import.meta.env.VITE_APP_ANYSTACK_API_KEY;
const url = import.meta.env.VITE_APP_ANYSTACK_URL;

const autoUpdater = getAutoUpdater();
const store = new Store();
// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

Object.defineProperty(app, 'isPackaged', {
  get() {
    return true;
  }
});
// const preload = path.join(__dirname, '../preload/index.mjs')
const icon = path.join(__dirname, '../../dist/icons/win/icon.ico');


autoUpdater.setFeedURL({
  url,
  //@ts-ignore
  serverType: 'json',
  provider: 'generic',
  useMultipleRangeRequest: false
})


const Anystack = new AnyStack(
    {
      api: {
        key,
        productId,
      },
      license: {
        encryptionKey: 'UNIQUE-KEY',
        trial: {
          "enabled": true,
          "value": 7,
          "unit": "days"
        }
      },
      "prompt":{
        "title":"HomeEx",
        "subtitle":"Activate your license to get started",
        "logo":"https://anystack.sh/img/emblem.svg",
        "email":"Email address",
        "licenseKey":"License key",
        "activateLicense":"Activate license",
        "trial":"Try HomeEx for 7 days",
        "trialExpired":"Thank you for trying HomeEx. Your trial has expired; to continue, please purchase a license.",
        "errors":{
          "NOT_FOUND":"Your license information did not match our records.",
          "SUSPENDED":"Your license has been suspended.",
          "EXPIRED":"Your license has been expired.",
          "FINGERPRINT_INVALID":"No license was found for this device.",
          "FINGERPRINT_ALREADY_EXISTS":"An active license already exists for this device.",
          "MAX_USAGE_REACHED":"Your license has reached its activation limit.",
          "RELEASE_CONSTRAINT":"Your license has no access to this version."
        }
      },
      "confirmation":{
        "title":"You are awesome!",
        "subtitle":"Thank you for activating your product license."
      }
    },
    autoUpdater
);




process.env.APP_ROOT = path.join(__dirname, '../..')

var totalLoops = 10;
var savedir = store.get('filepath') || null;

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

let win: BrowserWindow | null = null;

const preload = path.join(__dirname, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 950,
    title: 'Main window',
    show: false,
    icon,
    webPreferences: {
      preload,
      //Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      //nodeIntegration: true,

      //Consider using contextBridge.exposeInMainWorld
      //Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      //contextIsolation: false,
    },
  });


  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    // try {
    //   await autoUpdater.checkForUpdatesAndNotify();
    // } catch (error) {
    //   console.log('autoUpdater:', error.message);
    // }
    win.setMenu(null);
    win.loadFile(indexHtml);

    //Anystack.ifAuthorized(win);
  }

  win.on('ready-to-show', function() {
    Anystack.ifAuthorized(win);
  });

  //app.show();
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
      store.set('filepath', savedir);
      event.sender.send('status', `Saving photos to ${savedir}`);
      event.sender.send('dir-set', savedir);
    }
  });
});



ipcMain.on('check-db', (event, args) => {
  const version = app.getVersion();
  event.sender.send('set-version', `v${version}`);

  if(savedir !== null || savedir !== '' && savedir !== undefined) {
    event.sender.send('dir-set', savedir);
    //console.log(`Dir is set to ${savedir}`);
  }
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
