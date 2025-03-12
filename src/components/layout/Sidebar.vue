<template>
  <aside class="sidebar no-scrollbar" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <div class="sidebar-content">
      <!-- 分类导航 -->
      <nav class="sidebar-nav">
        <!-- 特殊视图 -->
        <div class="nav-section">
          <h3 class="section-title">浏览</h3>
          <ul class="nav-list">
            <router-link 
              v-for="item in specialItems" 
              :key="item.name"
              :to="item.path"
              v-slot="{ isActive }"
              custom
            >
              <li 
                class="nav-item" 
                :class="{ 'active': isActive }"
                @click="navigateTo(item.path)"
              >
                <span class="nav-icon" v-html="item.icon"></span>
                <span class="nav-label">{{ item.label }}</span>
              </li>
            </router-link>
          </ul>
        </div>
        
        <!-- 分类列表 -->
        <div class="nav-section">
          <div class="section-header">
            <h3 class="section-title">分类</h3>
            <button class="add-category-button" title="添加分类" @click="navigateToManageCategories">
              <span class="plus-icon">+</span>
            </button>
          </div>
          
          <ul class="nav-list">
            <router-link 
              v-for="category in categories" 
              :key="category.id"
              :to="{ name: 'category', params: { id: category.id } }"
              v-slot="{ isActive }"
              custom
            >
              <li 
                class="nav-item" 
                :class="{ 'active': isActive }"
                @click="navigateToCategory(category.id)"
              >
                <span 
                  class="category-color" 
                  :style="{ backgroundColor: category.color }"
                ></span>
                <span class="nav-label">{{ category.name }}</span>
                <span class="count-badge">{{ category.promptCount }}</span>
              </li>
            </router-link>
          </ul>
        </div>
      </nav>
      
      <!-- 折叠按钮 -->
      <button class="collapse-button" @click="toggleSidebar">
        <ChevronIcon :direction="isSidebarCollapsed ? 'right' : 'left'" />
      </button>
    </div>
  </aside>
</template>

<script setup>
/**
 * 侧边导航组件
 * 包含应用导航项和分类列表
 */
import { ref, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoryStore } from '../../stores/categoryStore'

// 图标组件
const ChevronIcon = ({ direction }) => {
  const directionMap = {
    left: 'M15 19l-7-7 7-7',
    right: 'M9 5l7 7-7 7'
  }
  
  return h('svg', { 
    xmlns: 'http://www.w3.org/2000/svg', 
    width: '20', 
    height: '20', 
    viewBox: '0 0 24 24', 
    fill: 'none', 
    stroke: 'currentColor', 
    'stroke-width': '2', 
    'stroke-linecap': 'round', 
    'stroke-linejoin': 'round' 
  }, [
    h('polyline', { points: directionMap[direction] || directionMap.left })
  ])
}

// 状态和存储
const router = useRouter()
const categoryStore = useCategoryStore()
const isSidebarCollapsed = ref(false)

// 特殊导航项
const specialItems = [
  {
    name: 'home',
    label: '所有提示词',
    path: '/',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>'
  },
  {
    name: 'favorites',
    label: '收藏夹',
    path: '/favorites',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>'
  },
  {
    name: 'recent',
    label: '最近使用',
    path: '/recent',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>'
  }
]

// 计算带有提示词计数的分类
const categories = computed(() => categoryStore.categoriesWithCount)

// 切换侧边栏折叠状态
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

// 导航到分类
const navigateToCategory = (categoryId) => {
  router.push({ name: 'category', params: { id: categoryId } })
}

// 导航到页面
const navigateTo = (path) => {
  router.push(path)
}

// 导航到管理分类页面
const navigateToManageCategories = () => {
  router.push({ name: 'manage-categories' })
}
</script>

<style lang="scss" scoped>
.sidebar {
  width: var(--sidebar-width);
  height: 100%;
  background-color: var(--color-background-secondary);
  border-right: 1px solid var(--color-border-light);
  overflow-y: auto;
  transition: width var(--transition-normal) ease;
  
  &.sidebar-collapsed {
    width: 60px;
    
    .nav-label, .count-badge, .section-title, .add-category-button {
      display: none;
    }
    
    .nav-item {
      justify-content: center;
      padding: var(--space-3);
    }
    
    .nav-icon {
      margin-right: 0;
    }
    
    .category-color {
      margin-right: 0;
    }
    
    .section-header {
      justify-content: center;
    }
  }
}

.sidebar-content {
  padding: var(--space-4) 0;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-nav {
  flex: 1;
}

.nav-section {
  margin-bottom: var(--space-6);
  
  &:last-child {
    margin-bottom: 0;
  }
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-4);
  margin-bottom: var(--space-2);
}

.section-title {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.add-category-button {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--color-background-tertiary);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast) ease;
  
  &:hover {
    background-color: var(--color-primary);
    color: white;
  }
  
  .plus-icon {
    font-size: 14px;
    line-height: 1;
  }
}

.nav-list {
  list-style: none;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  cursor: pointer;
  transition: background-color var(--transition-fast) ease;
  border-radius: 0;
  margin-bottom: 2px;
  
  &:hover {
    background-color: var(--color-background-tertiary);
  }
  
  &.active {
    background-color: var(--color-primary);
    color: white;
    
    .count-badge {
      background-color: rgba(255, 255, 255, 0.3);
      color: white;
    }
  }
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--space-3);
}

.category-color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: var(--space-3);
}

.nav-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.count-badge {
  background-color: var(--color-background-tertiary);
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
  padding: 2px 6px;
  font-size: var(--font-size-xs);
  font-weight: 500;
}

.collapse-button {
  position: absolute;
  bottom: var(--space-6);
  right: -10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--color-background);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-light);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color var(--transition-fast) ease;
  z-index: 10;
  
  &:hover {
    background-color: var(--color-background-secondary);
  }
}
</style> 