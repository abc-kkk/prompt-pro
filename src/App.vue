<script setup>
/**
 * 应用根组件
 */
import AppLayout from './components/layout/AppLayout.vue'
import { useSettingsStore } from './stores/settingsStore'
import { onMounted } from 'vue'

// 确保应用启动时加载settingsStore
const settingsStore = useSettingsStore()

// settingsStore会在定义时自动初始化
</script>

<template>
  <AppLayout />
</template>

<style>
/* 全局样式在assets/styles/main.scss中定义 */
</style>
