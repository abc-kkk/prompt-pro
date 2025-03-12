<template>
  <div class="prompt-detail-view">
    <div class="container">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <div class="loading"></div>
        <p>加载中...</p>
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="error" class="error-container">
        <div class="error-icon">!</div>
        <h2>提示词未找到</h2>
        <p>{{ error }}</p>
        <button class="button" @click="navigateBack">返回</button>
      </div>
      
      <!-- 详情内容 -->
      <template v-else>
        <!-- 顶部导航栏 -->
        <div class="detail-header">
          <button class="back-button" @click="navigateBack">
            <ArrowLeftIcon />
            <span>返回</span>
          </button>
          
          <div class="header-actions">
            <button 
              class="action-button favorite-button"
              @click="toggleFavorite"
              :class="{ 'is-favorite': prompt.isFavorite }"
              title="收藏"
            >
              <HeartIcon :filled="prompt.isFavorite" />
            </button>
            
            <button 
              class="action-button"
              @click="copyPrompt"
              title="复制提示词"
            >
              <CopyIcon />
            </button>
            
            <button 
              class="action-button"
              @click="editPrompt"
              title="编辑提示词"
            >
              <EditIcon />
            </button>
            
            <button 
              class="action-button delete-button"
              @click="confirmDelete"
              title="删除提示词"
            >
              <TrashIcon />
            </button>
          </div>
        </div>
        
        <!-- 主要内容 -->
        <div class="detail-content">
          <!-- 标题和分类 -->
          <div class="prompt-header">
            <h1 class="prompt-title">{{ prompt.title }}</h1>
            <div 
              class="category-badge" 
              :style="{ backgroundColor: category.color }"
            >
              {{ category.name }}
            </div>
          </div>
          
          <!-- 提示词内容卡片 -->
          <div class="prompt-content-card">
            <div class="card-header">
              <h2 class="card-title">提示词内容</h2>
              <button class="copy-button" @click="copyPrompt">
                <CopyIcon />
                <span>复制</span>
              </button>
            </div>
            <div class="prompt-content">
              {{ prompt.content }}
            </div>
          </div>
          
          <!-- 示例预览 -->
          <div v-if="hasExamples" class="examples-section">
            <h2 class="section-title">生成示例</h2>
            <div class="examples-grid">
              <div 
                v-for="(example, index) in prompt.examples" 
                :key="index"
                class="example-card"
              >
                <div class="example-image-container">
                  <img 
                    :src="typeof example === 'string' ? example : example.imageUrl" 
                    :alt="typeof example === 'object' && example.description ? example.description : '提示词示例'"
                    class="example-image"
                    @click="openImageViewer(typeof example === 'string' ? example : example.imageUrl)"
                  >
                </div>
                <p v-if="typeof example === 'object' && example.description" class="example-description">
                  {{ example.description }}
                </p>
              </div>
            </div>
          </div>
          
          <!-- 标签 -->
          <div v-if="hasTags" class="tags-section">
            <h2 class="section-title">标签</h2>
            <div class="tags-container">
              <span 
                v-for="tag in prompt.tags" 
                :key="tag"
                class="tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          
          <!-- 使用统计 -->
          <div class="usage-section">
            <h2 class="section-title">使用情况</h2>
            <div class="usage-stats">
              <div class="stat-item">
                <span class="stat-label">创建时间</span>
                <span class="stat-value">{{ formatDate(prompt.createdAt) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">最后修改</span>
                <span class="stat-value">{{ formatDate(prompt.updatedAt) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">使用次数</span>
                <span class="stat-value">{{ prompt.usageCount }} 次</span>
              </div>
            </div>
          </div>
        </div>
      </template>
      
      <!-- 图片查看器 -->
      <div v-if="imageViewerOpen" class="image-viewer" @click="closeImageViewer">
        <div class="image-viewer-content">
          <img :src="currentImage" alt="大图预览" class="viewer-image">
          <button class="close-button" @click="closeImageViewer">
            <CloseIcon />
          </button>
        </div>
      </div>
      
      <!-- 删除确认对话框 -->
      <div v-if="deleteDialogOpen" class="dialog-overlay">
        <div class="dialog-content">
          <h3 class="dialog-title">确认删除</h3>
          <p class="dialog-message">
            您确定要删除这个提示词吗？此操作无法撤销。
          </p>
          <div class="dialog-actions">
            <button class="button secondary" @click="deleteDialogOpen = false">
              取消
            </button>
            <button class="button delete-button" @click="deletePrompt">
              删除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 提示词详情视图
 * 展示提示词的详细信息、示例和使用统计
 */
import { ref, computed, onMounted, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePromptStore } from '../stores/promptStore'
import { useCategoryStore } from '../stores/categoryStore'

// 图标组件
const ArrowLeftIcon = () => h('svg', { 
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
  h('line', { x1: '19', y1: '12', x2: '5', y2: '12' }),
  h('polyline', { points: '12 19 5 12 12 5' })
])

const HeartIcon = ({ filled }) => h('svg', { 
  xmlns: 'http://www.w3.org/2000/svg', 
  width: '20', 
  height: '20', 
  viewBox: '0 0 24 24', 
  fill: filled ? 'currentColor' : 'none', 
  stroke: 'currentColor', 
  'stroke-width': '2', 
  'stroke-linecap': 'round', 
  'stroke-linejoin': 'round' 
}, [
  h('path', { d: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' })
])

const CopyIcon = () => h('svg', { 
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
  h('rect', { x: '9', y: '9', width: '13', height: '13', rx: '2', ry: '2' }),
  h('path', { d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' })
])

const EditIcon = () => h('svg', { 
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
  h('path', { d: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' }),
  h('path', { d: 'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' })
])

const TrashIcon = () => h('svg', { 
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
  h('polyline', { points: '3 6 5 6 21 6' }),
  h('path', { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' }),
  h('line', { x1: '10', y1: '11', x2: '10', y2: '17' }),
  h('line', { x1: '14', y1: '11', x2: '14', y2: '17' })
])

const CloseIcon = () => h('svg', { 
  xmlns: 'http://www.w3.org/2000/svg', 
  width: '24', 
  height: '24', 
  viewBox: '0 0 24 24', 
  fill: 'none', 
  stroke: 'currentColor', 
  'stroke-width': '2', 
  'stroke-linecap': 'round', 
  'stroke-linejoin': 'round' 
}, [
  h('line', { x1: '18', y1: '6', x2: '6', y2: '18' }),
  h('line', { x1: '6', y1: '6', x2: '18', y2: '18' })
])

// 路由和存储
const route = useRoute()
const router = useRouter()
const promptStore = usePromptStore()
const categoryStore = useCategoryStore()

// 状态变量
const loading = ref(true)
const error = ref(null)
const prompt = ref(null)
const imageViewerOpen = ref(false)
const currentImage = ref('')
const deleteDialogOpen = ref(false)

// 获取提示词数据
onMounted(() => {
  const promptId = route.params.id
  
  if (!promptId) {
    error.value = '提示词ID不存在'
    loading.value = false
    return
  }
  
  const foundPrompt = promptStore.getPromptById(promptId)
  
  if (!foundPrompt) {
    error.value = '未找到该提示词'
    loading.value = false
    return
  }
  
  prompt.value = foundPrompt
  loading.value = false
})

// 计算属性
// 获取分类信息
const category = computed(() => {
  if (!prompt.value) return { name: '未分类', color: '#888888' }
  return categoryStore.getCategoryById(prompt.value.categoryId) || { name: '未分类', color: '#888888' }
})

// 是否有示例
const hasExamples = computed(() => 
  prompt.value?.examples && prompt.value.examples.length > 0
)

// 是否有标签
const hasTags = computed(() => 
  prompt.value?.tags && prompt.value.tags.length > 0
)

// 方法
// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知'
  
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 导航返回
const navigateBack = () => {
  router.back()
}

// 切换收藏状态
const toggleFavorite = () => {
  if (!prompt.value) return
  promptStore.toggleFavorite(prompt.value.id)
}

// 复制提示词
const copyPrompt = () => {
  if (!prompt.value) return
  navigator.clipboard.writeText(prompt.value.content)
  // 这里可以添加提示通知
  promptStore.incrementUsage(prompt.value.id)
}

// 编辑提示词
const editPrompt = () => {
  if (!prompt.value) return
  router.push({ name: 'edit-prompt', params: { id: prompt.value.id } })
}

// 打开图片查看器
const openImageViewer = (imageUrl) => {
  if (!imageUrl) return;
  currentImage.value = imageUrl;
  imageViewerOpen.value = true;
}

// 关闭图片查看器
const closeImageViewer = () => {
  imageViewerOpen.value = false
}

// 确认删除
const confirmDelete = () => {
  deleteDialogOpen.value = true
}

// 删除提示词
const deletePrompt = () => {
  if (!prompt.value) return
  
  const success = promptStore.deletePrompt(prompt.value.id)
  
  if (success) {
    router.push({ name: 'home' })
  }
}
</script>

<style lang="scss" scoped>
.prompt-detail-view {
  padding-bottom: var(--space-16);
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.error-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--color-error);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 700;
  margin-bottom: var(--space-4);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-8);
}

.back-button {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  cursor: pointer;
  padding: var(--space-2) var(--space-3);
  transition: color var(--transition-fast) ease;
  
  &:hover {
    color: var(--color-primary);
  }
}

.header-actions {
  display: flex;
  gap: var(--space-3);
}

.action-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-background-secondary);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast) ease;
  
  &:hover {
    background-color: var(--color-background-tertiary);
    color: var(--color-text-primary);
  }
  
  &.is-favorite {
    color: var(--color-error);
  }
  
  &.delete-button {
    &:hover {
      background-color: var(--color-error);
      color: white;
    }
  }
}

.detail-content {
  max-width: 800px;
  margin: 0 auto;
}

.prompt-header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
  flex-wrap: wrap;
}

.prompt-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.category-badge {
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: white;
}

.prompt-content-card {
  background-color: var(--color-background-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  margin-bottom: var(--space-8);
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-4);
  }
  
  .card-title {
    font-size: var(--font-size-lg);
    font-weight: 600;
    margin: 0;
  }
  
  .copy-button {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    background: none;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-2) var(--space-3);
    cursor: pointer;
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    transition: all var(--transition-fast) ease;
    
    &:hover {
      background-color: var(--color-primary);
      color: white;
      border-color: var(--color-primary);
    }
  }
  
  .prompt-content {
    font-size: var(--font-size-base);
    line-height: 1.6;
    color: var(--color-text-primary);
    white-space: pre-wrap;
  }
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--space-4);
}

.examples-section {
  margin-bottom: var(--space-8);
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-4);
}

.example-card {
  border-radius: var(--radius-lg);
  overflow: hidden;
  background-color: var(--color-background-secondary);
}

.example-image-container {
  height: 160px;
  overflow: hidden;
  cursor: pointer;
  
  .example-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-normal) ease;
    
    &:hover {
      transform: scale(1.05);
    }
  }
}

.example-description {
  padding: var(--space-3);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.tags-section {
  margin-bottom: var(--space-8);
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.tag {
  font-size: var(--font-size-sm);
  background-color: var(--color-background-tertiary);
  color: var(--color-text-secondary);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
}

.usage-section {
  margin-bottom: var(--space-8);
}

.usage-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.stat-item {
  background-color: var(--color-background-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  
  .stat-label {
    display: block;
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-2);
  }
  
  .stat-value {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--color-text-primary);
  }
}

// 图片查看器
.image-viewer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.image-viewer-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.viewer-image {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
}

.close-button {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 24px;
}

// 对话框
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-content {
  background-color: var(--color-background);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  width: 100%;
  max-width: 400px;
  box-shadow: var(--shadow-lg);
}

.dialog-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--space-4);
}

.dialog-message {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-6);
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}

.delete-button {
  background-color: var(--color-error);
  
  &:hover {
    background-color: darken(#ff3b30, 10%);
  }
}
</style> 