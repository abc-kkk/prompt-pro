<template>
  <header class="app-header glass">
    <div class="container">
      <div class="header-content">
        <!-- Logo区域 -->
        <div class="logo">
          <router-link to="/" class="logo-link">
            <div class="logo-icon">
              <span class="prompt-icon">P</span>
            </div>
            <h1 class="logo-text">PromptPro</h1>
          </router-link>
        </div>
        
        <!-- 搜索区域 -->
        <div class="search-container">
          <div class="search-bar">
            <input 
              type="text"
              v-model="searchQuery"
              placeholder="搜索提示词..."
              @keyup.enter="handleSearch"
              @focus="showSearchResults = true"
              @blur="handleBlur"
            >
            <button class="search-button" @click="handleSearch">
              <SearchIcon />
            </button>
          </div>
          
          <!-- 搜索结果下拉框 -->
          <div 
            v-if="showSearchResults && filteredPrompts.length > 0" 
            class="search-results"
          >
            <div 
              v-for="prompt in filteredPrompts" 
              :key="prompt.id"
              class="search-result-item"
              @mousedown="navigateToPrompt(prompt.id)"
            >
              <h4>{{ prompt.title }}</h4>
              <p>{{ truncateText(prompt.content, 60) }}</p>
            </div>
          </div>
        </div>
        
        <!-- 操作区域 -->
        <div class="actions">
          <button 
            class="create-button" 
            @click="navigateToCreate"
          >
            <PlusIcon class="icon" />
            <span class="button-text">创建提示词</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
/**
 * 应用头部组件
 * 包含应用标志、搜索框和操作按钮
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePromptStore } from '../../stores/promptStore'

// 图标组件
const SearchIcon = () => h('svg', { 
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
  h('circle', { cx: '11', cy: '11', r: '8' }),
  h('path', { d: 'M21 21l-4.35-4.35' })
])

const PlusIcon = () => h('svg', { 
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
  h('line', { x1: '12', y1: '5', x2: '12', y2: '19' }),
  h('line', { x1: '5', y1: '12', x2: '19', y2: '12' })
])

// 状态和存储
const router = useRouter()
const promptStore = usePromptStore()
const searchQuery = ref('')
const showSearchResults = ref(false)

// 过滤后的提示词
const filteredPrompts = computed(() => {
  if (!searchQuery.value) return []
  
  const query = searchQuery.value.toLowerCase()
  return promptStore.allPrompts.filter(prompt => 
    prompt.title.toLowerCase().includes(query) || 
    prompt.content.toLowerCase().includes(query)
  ).slice(0, 5) // 最多显示5个结果
})

// 处理搜索
const handleSearch = () => {
  if (searchQuery.value) {
    promptStore.setSearchQuery(searchQuery.value)
    router.push({ name: 'home', query: { search: searchQuery.value } })
    showSearchResults.value = false
  }
}

// 处理失焦事件
const handleBlur = () => {
  // 延迟关闭以允许点击搜索结果
  setTimeout(() => {
    showSearchResults.value = false
  }, 200)
}

// 导航到提示词详情
const navigateToPrompt = (id) => {
  router.push({ name: 'prompt-detail', params: { id } })
}

// 导航到创建页面
const navigateToCreate = () => {
  router.push({ name: 'create-prompt' })
}

// 文本截断函数
const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
</script>

<style lang="scss" scoped>
.app-header {
  height: var(--header-height);
  border-bottom: 1px solid var(--color-border-light);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.logo {
  flex-shrink: 0;
  
  .logo-link {
    display: flex;
    align-items: center;
    color: var(--color-text-primary);
    
    &:hover {
      color: var(--color-text-primary);
    }
  }
  
  .logo-icon {
    width: 32px;
    height: 32px;
    background: var(--color-primary);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: var(--space-3);
    
    .prompt-icon {
      color: white;
      font-weight: 700;
      font-size: 18px;
    }
  }
  
  .logo-text {
    font-size: var(--font-size-xl);
    font-weight: 700;
    
    @media (max-width: 768px) {
      display: none;
    }
  }
}

.search-container {
  flex: 1;
  max-width: 600px;
  margin: 0 var(--space-6);
  position: relative;
  
  @media (max-width: 768px) {
    margin: 0 var(--space-3);
  }
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: var(--color-background-secondary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  
  input {
    flex: 1;
    padding: var(--space-3) var(--space-4);
    border: none;
    background: transparent;
    font-size: var(--font-size-base);
    
    &:focus {
      outline: none;
      box-shadow: none;
    }
  }
  
  .search-button {
    padding: var(--space-3);
    background: transparent;
    color: var(--color-text-secondary);
    border: none;
    cursor: pointer;
    
    &:hover {
      color: var(--color-primary);
    }
  }
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: var(--space-2);
  background: var(--color-background);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  max-height: 300px;
  overflow-y: auto;
  z-index: 10;
}

.search-result-item {
  padding: var(--space-4);
  cursor: pointer;
  transition: background-color var(--transition-fast) ease;
  
  &:hover {
    background-color: var(--color-background-secondary);
  }
  
  h4 {
    margin: 0;
    font-size: var(--font-size-base);
    font-weight: 600;
  }
  
  p {
    margin: var(--space-1) 0 0;
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }
}

.actions {
  display: flex;
  align-items: center;
  
  .create-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    
    .icon {
      display: inline-block;
    }
    
    .button-text {
      @media (max-width: 768px) {
        display: none;
      }
    }
  }
}
</style> 