<script setup lang="ts">
import { ref, onMounted, computed, watch, reactive } from 'vue';
import { DeleteOutlined, MenuFoldOutlined, PlusOutlined, MinusOutlined, CheckOutlined, QuestionOutlined, SaveOutlined, FolderOpenOutlined } from '@ant-design/icons-vue';
import { useTitle } from '@vueuse/core'

const emptyHome = {
  id: null,
  home: {
    path: '',
    url: '',
    title: '',
    rates: [] as any[],
    description: '',
    amenities: [] as any[],
    summary: [] as any[],
    photos: [] as any[],
  },
  name: '',
  status: '',
};
const properties = ref([])
const status = ref('')
const savedir = ref(null)
const loopstatus = ref('')
const errors = ref('')
const loading = ref(false);
const drawer = ref(false);
const drawerHome = reactive({...emptyHome});

const title = computed(() => !status.value ? 'Home Ex' : "Home Ex - " + status.value);

useTitle(title);

defineProps<{ msg: string }>()

function sendCommand(command: string) {
  window.ipcRenderer.send('command', command)
}

function deleteHome(home: any) {
  if(home.home === null) {
    const { id, name }: any = home;
    window.ipcRenderer.send('delete-home', { id, title: name, path: null });
  } else {
    const { id, home: { photos, title } } = home;
    window.ipcRenderer.send('delete-home', { id, title, path: photos[0].path });
  }

}

function setSaveDir() {
  window.ipcRenderer.send('set-dir', 'set-dir')
}

onMounted(() => {
  window.ipcRenderer.send('check-db', null);
  window.ipcRenderer.send('set-loop', loop.value);

  window.ipcRenderer.on('dir-set', (event, args) => {
    savedir.value = args
  })

  window.ipcRenderer.on('loading', (event, args) => {
    loading.value = args
  })
  window.ipcRenderer.on('status', (event, args) => {
    status.value = args
  })
  window.ipcRenderer.on('loop-status', (event, args) => {
    loopstatus.value = args
  })

  window.ipcRenderer.on('properties-set', (event, args) => {
    properties.value = args
  })
  window.ipcRenderer.on('errors', (event, args) => {
    errors.value = args
  })

})

const columns = [ { width: 120, title: '# ID', dataIndex: 'id', }, { width: 250, title: 'Name', resizable: true, dataIndex: 'name', }, { width: 'auto', title: 'URL', dataIndex: 'url', ellipsis: true,}, { width: 110, title: 'Status', dataIndex: 'status', resizable: true, }, { width: 200, title: 'Created', dataIndex: 'created', }, { width: '150px', title: 'Actions', dataIndex: 'actions', }];

const loop = ref(10);

const increment = () => {
  if(loop.value >= 200) return;

  loop.value = loop.value + 10;
};
const decrement = () => {
  if(loop.value <= 10) return;
  loop.value = loop.value - 10;
};
const openDir = ({dir, url}: any) => {
  window.ipcRenderer.send('open-dir', {dir, url});
};
const viewHome = (home: any) => {
  Object.assign(drawerHome, home);
  drawer.value = true;


};

const viewHomeClose = () => {
  Object.assign(drawerHome, emptyHome);
  drawer.value = false;
};

watch(loop, (newloop: number) => {
  window.ipcRenderer.send('set-loop', newloop);
  setTimeout(() => {
    sendCommand('loops');
  }, 100);
});
</script>

<template>
  <div class="flex mb-4 gap-3">
    <div class="flex-1">
      <div class="block">{{ status }} <span class="text-red-600">{{ errors }}</span></div>
      <div class="block text-xs text-pink-300">{{ loopstatus }}</div>
    </div>
    <div class="flex-2">
      <a-tooltip class="p-[.3rem]" :title="savedir ? `Save to ${savedir}` : 'Savedir is not set'" @click="setSaveDir">
        <save-outlined class="text-lg text-green-400" v-if="savedir !== null"/>
        <save-outlined class="text-lg text-red-600" v-else/>
      </a-tooltip>
    </div>
    <div class="flex-2">
      <a-button type="primary" :loading="loading" @click="sendCommand('getAllLinks')" :disabled="properties.length > 10 || savedir === null">Extract all Properties</a-button>
    </div>
    <div class="flex-2">
      <a-button type="primary" ghost :loading="loading" @click="sendCommand('init')" :disabled="properties.length < 10 || savedir === null">Save Homes</a-button>
    </div>
    <div class="flex-2">
      <a-input-group compact>
        <a-button type="primary" ghost :loading="loading" @click="decrement" :disabled="loop <= 10">
          <template #icon>
            <MinusOutlined />
          </template>

        </a-button>
        <a-input style="width: 60px; text-align: center" v-model:value="loop" placeholder="10" readonly />
        <a-button type="primary" ghost :loading="loading" @click="increment" :disabled="loop >= 200">
          <template #icon>
            <PlusOutlined />
          </template>
        </a-button>
      </a-input-group>

    </div>

    <div class="flex-2">
      <a-button type="primary" danger :loading="loading" @click="sendCommand('empty-db')" :disabled="!properties.length">Empty DB</a-button>
    </div>
  </div>
  <a-table class="w-full h-full" :row-key="(record: any) => record.id" :dataSource="properties" :columns="columns" :loading="loading" :pagination="{ pageSize: 12 }">
    <template #bodyCell="{ column, text, record }">
      <span v-if="column.dataIndex === 'url'">
        <a href="#" class="text-gray-400" @click.prevent="openDir({dir: null, url: record.url})">
          {{ text }}
        </a>
      </span>
      <span v-if="column.dataIndex === 'status'">
        <a href="#" class="text-teal-300" v-if="text === 'finished'" @click.prevent>
          <CheckOutlined /> {{ text }}
        </a>
        <span class="text-gray-400" v-else>
          <QuestionOutlined />
        </span>
      </span>
      <span v-if="column.dataIndex === 'actions'" class="flex gap-5">
        <a v-if="record.status === 'finished'" @click.prevent="viewHome(record)" href="#">
           <MenuFoldOutlined style="font-size: 20px;" />
        </a>
        <a v-else @click.prevent href="#" class="pointer-events-none" disabled>
           <MenuFoldOutlined style="font-size: 20px;"/>
        </a>
        <a v-if="record.status === 'finished'" @click.prevent="openDir({dir: record.home.photos[0].path, url: null})" href="#">
           <FolderOpenOutlined style="font-size: 20px;"/>
        </a>
        <a v-else @click.prevent href="#" class="pointer-events-none" disabled>
           <FolderOpenOutlined style="font-size: 20px;"/>
        </a>
        <a @click.prevent="deleteHome(record)" href="#">
           <DeleteOutlined style="font-size: 20px;"/>
        </a>
      </span>
    </template>
  </a-table>


  <a-drawer
      v-model:open="drawer"
      class="custom-class"
      size="large"
      root-class-name="root-class-name"
      @close="viewHomeClose"
      placement="right"
  >
    <template #title>
      <span>{{ drawerHome.name }}</span>
    </template>
    <div class="drawer-content">
      <h2 class="font-bold text-xl mb-5">{{ drawerHome.home.title }}</h2>
      <div  v-for="(summary, index) in drawerHome.home.summary" :key="index">
        <p v-html="summary" class="block"></p>
      </div>
      <div v-html="drawerHome.home.description" class="mb-5"></div>
      <div v-for="(rate, index) in drawerHome.home.rates" :key="index">
        <p v-html="rate" class="block mb-3"></p>
      </div>
      <div class="mb-3">
        <span v-for="(amenity, index) in drawerHome.home.amenities" :key="index">
          <span v-html="amenity" class="block "></span>
        </span>
      </div>
      <div class="mb-3 grid grid-cols-4 gap-3">
        <div v-for="(img, index) in drawerHome.home.photos" :key="index" class="col-span-1">
          <img :src="'media:\\' + `${img.path + img.filename}`" alt="Image" class="w-full h-auto">
        </div>
      </div>
    </div>
  </a-drawer>
</template>

<style scoped >
div.drawer-content p {
  margin-bottom: 10px;
}
.read-the-docs {
  color: #888;
}
</style>
