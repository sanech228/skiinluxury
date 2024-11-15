<script setup lang="ts">
import MainComponent from './components/MainComponent.vue';
import { theme } from 'ant-design-vue';
import { ref } from 'vue';

const appName = import.meta.env.VITE_APP_NAME;
const appAuthor = import.meta.env.VITE_APP_AUTHOR;
const version = ref('');
window.ipcRenderer.on('set-version', (_, args) => {
  version.value = args;
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
    <div class="flex-1 absolute bottom-0 left-0 right-0 flex items-center p-2" style="background-color: color-mix(in srgb, Canvas, CanvasText 2.5%);">
      <div class="text-sm text-gray-400">
        <span class="text-white">{{ appName }}</span> {{ version || 'v1.0.0' }} <span class="text-white">© {{ new Date().getFullYear() }} {{ appAuthor }}</span>
      </div>
    </div>
  </a-config-provider>
</template>

<style>

</style>
