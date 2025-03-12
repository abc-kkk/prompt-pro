<template>
  <div class="app-layout" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span v-if="!isSidebarCollapsed" class="logo-text">提示词库</span>
        </div>
        <button class="toggle-sidebar" @click="toggleSidebar">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline v-if="isSidebarCollapsed" points="13 17 18 12 13 7"></polyline>
            <polyline v-else points="11 17 6 12 11 7"></polyline>
          </svg>
        </button>
      </div>
      
      <nav class="sidebar-nav">
        <router-link to="/" class="nav-item" active-class="active" exact>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span v-if="!isSidebarCollapsed">首页</span>
        </router-link>
        
        <router-link to="/categories" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
          <span v-if="!isSidebarCollapsed">分类管理</span>
        </router-link>
        
        <router-link to="/settings" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          <span v-if="!isSidebarCollapsed">设置</span>
        </router-link>
      </nav>
      
      <div class="sidebar-footer">
        <button class="create-button" @click="navigateToCreate">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span v-if="!isSidebarCollapsed">创建提示词</span>
        </button>
      </div>
    </aside>
    
    <!-- 主内容区域 -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isSidebarCollapsed = ref(false);

/**
 * 组件挂载时初始化
 */
onMounted(() => {
  // 从本地存储中获取侧边栏状态
  const savedState = localStorage.getItem('sidebarCollapsed');
  if (savedState !== null) {
    isSidebarCollapsed.value = savedState === 'true';
  }
  
  // 在小屏幕上默认折叠侧边栏
  if (window.innerWidth < 768 && savedState === null) {
    isSidebarCollapsed.value = true;
  }
});

/**
 * 切换侧边栏折叠状态
 */
function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
  localStorage.setItem('sidebarCollapsed', isSidebarCollapsed.value);
}

/**
 * 导航到创建提示词页面
 */
function navigateToCreate() {
  router.push({ name: 'create-prompt' });
}
</script>

<style lang="scss" scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  background-color: var(--color-background-soft);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  overflow: hidden;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  
  .sidebar-collapsed & {
    width: 60px;
  }
}

.sidebar-header {
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-border);
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-primary);
  
  svg {
    flex-shrink: 0;
  }
  
  .logo-text {
    font-weight: 600;
    font-size: 1.125rem;
    white-space: nowrap;
  }
}

.toggle-sidebar {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
  
  &:hover {
    background-color: var(--color-background-mute);
    color: var(--color-text);
  }
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--color-text);
  text-decoration: none;
  transition: all 0.2s;
  border-left: 3px solid transparent;
  
  svg {
    flex-shrink: 0;
  }
  
  &:hover {
    background-color: var(--color-background-mute);
  }
  
  &.active {
    color: var(--color-primary);
    background-color: var(--color-background-mute);
    border-left-color: var(--color-primary);
  }
  
  .sidebar-collapsed & {
    justify-content: center;
    padding: 0.75rem 0;
  }
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--color-border);
}

.create-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--color-primary-dark);
  }
  
  svg {
    flex-shrink: 0;
  }
}

.main-content {
  flex: 1;
  margin-left: 240px;
  transition: margin-left 0.3s ease;
  
  .sidebar-collapsed & {
    margin-left: 60px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .sidebar {
    width: 240px;
    transform: translateX(0);
    
    .sidebar-collapsed & {
      transform: translateX(-100%);
      width: 240px;
    }
  }
  
  .main-content {
    margin-left: 0;
    
    .sidebar-collapsed & {
      margin-left: 0;
    }
  }
  
  .toggle-sidebar {
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 101;
    background-color: var(--color-background-soft);
    border: 1px solid var(--color-border);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    .sidebar-collapsed & {
      left: 1rem;
    }
  }
}
</style> 