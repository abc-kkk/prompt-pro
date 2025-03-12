<template>
  <div class="home-view">
    <div class="container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">提示词库</h1>
        <p class="page-description">
          管理和组织您的AI提示词，提高创作效率
        </p>
      </div>
      
      <!-- 统计概览 -->
      <div class="stats-overview">
        <div class="stat-card">
          <h3 class="stat-value">{{ totalPrompts }}</h3>
          <p class="stat-label">提示词总数</p>
        </div>
        <div class="stat-card">
          <h3 class="stat-value">{{ totalCategories }}</h3>
          <p class="stat-label">分类数量</p>
        </div>
        <div class="stat-card">
          <h3 class="stat-value">{{ totalUsageCount }}</h3>
          <p class="stat-label">总使用次数</p>
        </div>
      </div>
      
      <!-- 搜索结果 -->
      <div v-if="isSearching" class="search-results-section">
        <div class="section-header">
          <h2 class="section-title">搜索结果: "{{ searchQuery }}"</h2>
          <button class="clear-button" @click="clearSearch">
            清除搜索
          </button>
        </div>
        <PromptGrid :prompts="searchResults" empty-message="没有找到匹配的提示词" />
      </div>
      
      <!-- 最近使用 -->
      <div v-else-if="recentPrompts.length > 0" class="recent-section">
        <div class="section-header">
          <h2 class="section-title">最近使用</h2>
          <router-link to="/recent" class="view-all-link">
            查看全部
          </router-link>
        </div>
        <div class="prompt-row">
          <PromptCard 
            v-for="prompt in recentPrompts.slice(0, 3)" 
            :key="prompt.id" 
            :prompt="prompt" 
          />
        </div>
      </div>
      
      <!-- 收藏夹 -->
      <div v-if="!isSearching && favoritePrompts.length > 0" class="favorites-section">
        <div class="section-header">
          <h2 class="section-title">收藏夹</h2>
          <router-link to="/favorites" class="view-all-link">
            查看全部
          </router-link>
        </div>
        <div class="prompt-row">
          <PromptCard 
            v-for="prompt in favoritePrompts.slice(0, 3)" 
            :key="prompt.id" 
            :prompt="prompt" 
          />
        </div>
      </div>
      
      <!-- 所有提示词 -->
      <div v-if="!isSearching" class="all-prompts-section">
        <div class="section-header">
          <h2 class="section-title">所有提示词</h2>
          <div class="filter-sort">
            <select v-model="sortOption" class="sort-select">
              <option value="updated">最近更新</option>
              <option value="created">创建时间</option>
              <option value="usage">使用次数</option>
              <option value="title">标题</option>
            </select>
          </div>
        </div>
        <PromptGrid :prompts="sortedPrompts" />
      </div>
    </div>
    
    <!-- 创建按钮 -->
    <button class="floating-action-button" @click="navigateToCreate">
      <span class="plus-icon">+</span>
    </button>
  </div>
</template>

<script setup>
/**
 * 首页视图
 * 展示概览、最近使用、收藏夹和所有提示词
 */
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePromptStore } from '../stores/promptStore'
import { useCategoryStore } from '../stores/categoryStore'
import PromptCard from '../components/prompt/PromptCard.vue'
import PromptGrid from '../components/prompt/PromptGrid.vue'

// 路由和存储
const route = useRoute()
const router = useRouter()
const promptStore = usePromptStore()
const categoryStore = useCategoryStore()

// 搜索状态
const searchQuery = ref('')
const isSearching = computed(() => !!searchQuery.value)
const searchResults = computed(() => 
  searchQuery.value ? promptStore.searchPrompts(searchQuery.value) : []
)

// 排序选项
const sortOption = ref('updated')

// 统计信息
const totalPrompts = computed(() => promptStore.prompts.length)
const totalCategories = computed(() => categoryStore.categories.length)
const totalUsageCount = computed(() => 
  promptStore.prompts.reduce((sum, prompt) => sum + prompt.usageCount, 0)
)

// 获取提示词数据
const recentPrompts = computed(() => promptStore.getRecentPrompts())
const favoritePrompts = computed(() => promptStore.favoritePrompts)
const allPrompts = computed(() => promptStore.prompts)

// 排序后的提示词
const sortedPrompts = computed(() => {
  const prompts = [...allPrompts.value]
  
  switch (sortOption.value) {
    case 'updated':
      return prompts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    case 'created':
      return prompts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    case 'usage':
      return prompts.sort((a, b) => b.usageCount - a.usageCount)
    case 'title':
      return prompts.sort((a, b) => a.title.localeCompare(b.title))
    default:
      return prompts
  }
})

// 清除搜索
const clearSearch = () => {
  searchQuery.value = ''
  router.push({ name: 'home' })
}

// 导航到创建页面
const navigateToCreate = () => {
  router.push({ name: 'create-prompt' })
}

// 处理搜索
const handleSearch = () => {
  if (searchQuery.value) {
    router.push({ name: 'home', query: { search: searchQuery.value } })
  }
}

// 监听URL查询参数变化
watch(() => route.query.search, (newSearch) => {
  if (newSearch) {
    searchQuery.value = newSearch
  } else {
    searchQuery.value = ''
  }
}, { immediate: true })
</script>

<style lang="scss" scoped>
.home-view {
  padding-bottom: var(--space-16);
}

.page-header {
  margin-bottom: var(--space-8);
  
  .page-title {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    margin-bottom: var(--space-3);
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .page-description {
    font-size: var(--font-size-lg);
    color: var(--color-text-secondary);
    max-width: 600px;
  }
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-10);
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  background-color: var(--color-background-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-6);
  text-align: center;
  transition: transform var(--transition-normal) ease;
  
  &:hover {
    transform: translateY(-4px);
  }
  
  .stat-value {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    margin-bottom: var(--space-2);
    color: var(--color-primary);
  }
  
  .stat-label {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    font-weight: 500;
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
  
  .section-title {
    font-size: var(--font-size-xl);
    font-weight: 600;
  }
  
  .view-all-link {
    font-size: var(--font-size-sm);
    color: var(--color-primary);
    font-weight: 500;
  }
  
  .clear-button {
    font-size: var(--font-size-sm);
    padding: var(--space-2) var(--space-4);
    background: none;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-text-secondary);
    cursor: pointer;
    
    &:hover {
      background-color: var(--color-background-secondary);
    }
  }
}

.search-results-section,
.recent-section,
.favorites-section,
.all-prompts-section {
  margin-bottom: var(--space-12);
}

.prompt-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.filter-sort {
  display: flex;
  align-items: center;
  
  .sort-select {
    font-size: var(--font-size-sm);
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
    background-color: var(--color-background);
    color: var(--color-text-secondary);
    cursor: pointer;
    
    &:focus {
      border-color: var(--color-primary);
      outline: none;
    }
  }
}

.floating-action-button {
  position: fixed;
  bottom: var(--space-6);
  right: var(--space-6);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: white;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
  border: none;
  cursor: pointer;
  transition: all var(--transition-normal) ease;
  z-index: 10;
  
  &:hover {
    background-color: var(--color-primary-dark);
    transform: scale(1.1);
  }
}
</style> 