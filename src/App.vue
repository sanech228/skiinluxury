<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue';
import { theme } from 'ant-design-vue';
</script>

<template>
  <a-config-provider
      hash-priority="high"
      :theme="{
      algorithm: theme.darkAlgorithm,
    }"
  >
  <HelloWorld msg="Electron + Vite + Vue" />
  </a-config-provider>
</template>

<style>

</style>
