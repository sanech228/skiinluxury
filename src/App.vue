<script setup lang="ts">
import MainComponent from './components/MainComponent.vue';
import { theme } from 'ant-design-vue';
import { ref, computed } from 'vue';

const urltoextract = ref('');
const appName = import.meta.env.VITE_APP_NAME;
const appAuthor = import.meta.env.VITE_APP_AUTHOR;
const version = ref('');
const properties = ref('');

const warning = computed(() => !/\d/.test(urltoextract.value));
window.ipcRenderer.on('set-version', (_, args) => {
  version.value = args;
})

window.ipcRenderer.on('receive-start-url', (event, args) => {
  urltoextract.value = args
})

window.ipcRenderer.on('properties-set', (event, args) => {
    properties.value = args
})
</script>

<template>
  <a-config-provider
      hash-priority="high"
      :theme="{
      algorithm: theme.darkAlgorithm,
    }"
  >
  <MainComponent />
    <div class="grid grid-cols-2 gap-1 absolute bottom-0 left-0 right-0 items-center p-2" style="background-color: color-mix(in srgb, Canvas, CanvasText 2.5%);">
      <div class="text-sm text-gray-400">
        <span>{{ appName }}</span> {{ version || 'v1.0.0' }} <span class="text-white">© {{ new Date().getFullYear() }} {{ appAuthor }}</span>
        <span class="mx-2">&bull;</span>{{ properties.length }} {{ properties.length === 1 ? 'property' : 'properties' }} extracted
      </div>
      <div class="text-sm text-gray-400 text-right">
        <span>Resort ID: <span :class="{'text-red-500': warning}">{{ warning ? 'null' : `#${urltoextract}` }}</span></span>
      </div>
    </div>
  </a-config-provider>
</template>

<style>

</style>
