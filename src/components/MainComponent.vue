<script setup lang="ts">
import { CheckOutlined, DeleteOutlined, FolderOpenOutlined, MenuFoldOutlined, MinusOutlined, PlusOutlined, QuestionOutlined, SaveOutlined } from '@ant-design/icons-vue';
import { useTitle } from '@vueuse/core';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useHelpers } from '../helpers';

const { emptyHome, columns, countries } = useHelpers();
const properties = ref([]);
const status = ref('');
const savedir = ref(null);
const loopstatus = ref('');
const errors = ref('');
const loading = ref(false);
const drawer = ref(false);
const loop = ref(99);
const home = reactive({...emptyHome});
const country = ref('');
const title = computed(() => !status.value ? 'Ski In Luxury' : "Ski In Luxury - " + status.value);
const warning = computed(() => !/\d/.test(country.value));
const selected = computed(() => countries.find(c => c.value === country.value));
useTitle(title);



// ########### Functions ###########
const increment = () => {
  if(loop.value >= 50) return;

  loop.value = loop.value + 1;
};
const decrement = () => {
  if(loop.value <= 1) return;
  loop.value = loop.value - 1;
};
const openDir = (record: any, operation: string) => {
  let dir = null;
  let url = null;
  if(operation === 'link') {
    dir = null;
    url = record.url;
  } else if(operation === 'dir') {
    dir = record.images[0].path;
    url = null;
    
  }
  window.ipcRenderer.send('open-dir', {dir, url});
};
const viewHome = (myhome: any) => {
  Object.assign(home, myhome);
  drawer.value = true;
};
const viewHomeClose = () => {
  drawer.value = false;
  Object.assign(home, emptyHome);
};

const sendCommand = (command: string) => {
  window.ipcRenderer.send('command', command)
};
const deleteHome = ({ id, title, images }: any) => {
  const path = images[0].path;
  window.ipcRenderer.send('delete-home', { id, title, path });
};
const setSaveDir = () => {
  window.ipcRenderer.send('set-dir', 'set-dir')
};

// ########### On Mounted ###########
onMounted(() => {
  window.ipcRenderer.send('check-db', null);
  window.ipcRenderer.send('set-loop', loop.value);

  window.ipcRenderer.on('dir-set', (event, args) => {
    savedir.value = args
  })

  window.ipcRenderer.on('add-extracted', (event, args) => {
    console.log('add-extracted', args);
    window.ipcRenderer.send('add-extracted', args);
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

  window.ipcRenderer.on('receive-start-url', (event, args) => {
    country.value = args
    sendCommand('count');
  })
  window.ipcRenderer.on('set-found', (event, args) => {
    if(args < loop.value) {
      loop.value = args;
    }
  })

});

function onSelectChange(value: string) {
  loop.value = 99;
  window.ipcRenderer.send('set-start-url', value);
}

// ########### Watchers ###########
watch(loop, (newloop: number) => {
  console.log('set loop', newloop);
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
      <a-tree-select
        v-model:value="country"
        style="width: 300px"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        placeholder="Select location"
        tree-default-expand-all
        :tree-data="countries"
        tree-node-filter-prop="label"
        :status="warning ? 'error' : null"
        @change="onSelectChange"
      >
      </a-tree-select>
    </div>
    <div class="flex-2">
      <a-button type="primary" :loading="loading" @click="sendCommand('getAllLinks')" :disabled="savedir === null || warning">
        <span v-if="warning">Invalid location</span>
        <span v-else>Extract Resort #{{ country }}</span>
      </a-button>
    </div>
    
    <div class="flex-2">
      <a-input-group compact>
        <a-button type="primary" ghost :loading="loading" @click="decrement" :disabled="loop <= 2">
          <template #icon>
            <MinusOutlined />
          </template>
        </a-button>
        <a-input style="width: 60px; text-align: center" v-model:value="loop" placeholder="10" readonly :disabled="loading" />
        <a-button type="primary" ghost :loading="loading" @click="increment" :disabled="loop >= 50">
          <template #icon>
            <PlusOutlined />
          </template>
        </a-button>
      </a-input-group>

    </div>

    <div class="flex-2">
      <a-button type="primary" danger :loading="loading" @click="sendCommand('empty-db')" :disabled="!properties.length">DELETE ALL</a-button>
    </div>
  </div>
  <a-table class="w-full h-full" :row-key="(record: any) => record.id" :dataSource="properties" :columns="columns" :loading="loading" :pagination="{ pageSize: 12 }">
    <template #bodyCell="{ column, text, record }">
      <span v-if="column.dataIndex === 'url'">
        <a href="#" class="text-gray-400" @click.prevent="openDir(record, 'link')">
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
        <a v-if="record.status === 'finished'" @click.prevent="openDir(record, 'dir')" href="#">
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
      <span>{{ home.name }} in {{ home.location }}</span>
    </template>
    <div class="drawer-content">
      <a-carousel autoplay>
        <a-image v-for="(img, index) in home.images" :key="index"  :src="'media:\\' + `${img.path + img.filename}`" alt="Image" width="100%" height="250px" class="w-full h-[250px] object-cover" />
      </a-carousel>
      <h2 class="font-bold text-xl mb-2">Summary</h2>
      <div class="mb-4">
        <div v-for="(summary, index) in home.summary" :key="index" class="inline-block mb-2">
          <a-tag :bordered="false" class="">{{ summary }}</a-tag>
        </div>
      </div>
      <div class="mb-4">
        <a :href="`${home.latlng}`">{{ home.latlng }}</a>
        <br>
        {{ home.latlng }}
      </div>
      <h2 class="font-bold text-xl mb-5">Description</h2>
      <div v-html="home.description_html" class="mb-5"></div>
      <h2 class="font-bold text-xl mb-2">Amenities</h2>
      <div v-for="(amenity, index) in home.amenities" :key="index" class="inline-block mb-2">
        <a-tag> {{ amenity }} </a-tag>
      </div>
    </div>
  </a-drawer>
  
</template>
<style scoped>
div.drawer-content p {
  margin-bottom: 10px;
}
</style>
