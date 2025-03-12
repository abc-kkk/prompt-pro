<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useSettingsStore } from '../stores/settingsStore';

const settingsStore = useSettingsStore();
const route = useRoute();

/**
 * 当前活跃的导航项
 * @type {import('vue').Ref<string>}
 */
const activeNav = ref('home');

/**
 * 标题计算属性，根据当前路由显示不同标题
 * @type {import('vue').ComputedRef<string>}
 */
const title = computed(() => {
  switch (route.name) {
    case 'home':
      return '提示词库';
    case 'recent':
      return '最近使用';
    case 'favorites':
      return '我的收藏';
    case 'settings':
      return '设置';
    default:
      return '提示词库';
  }
});

// 监听路由变化，更新活跃导航项
watch(() => route.name, (newName) => {
  if (newName) {
    activeNav.value = newName.toString();
  }
}, { immediate: true });
</script>

<template>
  <div class="app-container" :class="{ 'dark-theme': settingsStore.isDarkMode }">
    <header class="app-header">
      <h1>{{ title }}</h1>
    </header>
    
    <main class="app-content">
      <router-view />
    </main>
    
    <nav class="app-nav">
      <router-link to="/" class="nav-item" :class="{ active: activeNav === 'home' }">
        <span class="icon">🏠</span>
        <span class="label">首页</span>
      </router-link>
      
      <router-link to="/recent" class="nav-item" :class="{ active: activeNav === 'recent' }">
        <span class="icon">🕒</span>
        <span class="label">最近</span>
      </router-link>
      
      <router-link to="/favorites" class="nav-item" :class="{ active: activeNav === 'favorites' }">
        <span class="icon">⭐</span>
        <span class="label">收藏</span>
      </router-link>
      
      <router-link to="/settings" class="nav-item" :class="{ active: activeNav === 'settings' }">
        <span class="icon">⚙️</span>
        <span class="label">设置</span>
      </router-link>
    </nav>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 100%;
  margin: 0 auto;
  transition: background-color 0.3s, color 0.3s;
}

.app-header {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
}

.app-content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.app-nav {
  display: flex;
  justify-content: space-around;
  padding: 0.5rem;
  border-top: 1px solid #e0e0e0;
  background-color: #f9f9f9;
}

.dark-theme .app-nav {
  background-color: #1a1a1a;
  border-top: 1px solid #333;
}

.dark-theme .app-header {
  border-bottom: 1px solid #333;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #666;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s;
}

.nav-item.active {
  color: #646cff;
}

.nav-item:hover {
  background-color: rgba(100, 108, 255, 0.1);
}

.icon {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.label {
  font-size: 0.8rem;
}
</style>