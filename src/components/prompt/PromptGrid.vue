<template>
  <div>
    <!-- 提示词网格 -->
    <div v-if="prompts.length > 0" class="prompt-grid grid">
      <PromptCard 
        v-for="prompt in prompts" 
        :key="prompt.id" 
        :prompt="prompt" 
      />
    </div>
    
    <!-- 空状态 -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <DocumentIcon />
      </div>
      <h3 class="empty-title">{{ emptyMessage }}</h3>
      <p class="empty-description">开始创建您的第一个提示词吧！</p>
      <button class="create-button" @click="navigateToCreate">
        创建提示词
      </button>
    </div>
  </div>
</template>

<script setup>
/**
 * 提示词网格组件
 * 用于以网格方式展示提示词列表
 */
import { h } from 'vue'
import { useRouter } from 'vue-router'
import PromptCard from './PromptCard.vue'

// 图标组件
const DocumentIcon = () => h('svg', { 
  xmlns: 'http://www.w3.org/2000/svg', 
  width: '48', 
  height: '48', 
  viewBox: '0 0 24 24', 
  fill: 'none', 
  stroke: 'currentColor', 
  'stroke-width': '1', 
  'stroke-linecap': 'round', 
  'stroke-linejoin': 'round',
  class: 'document-icon'
}, [
  h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
  h('polyline', { points: '14 2 14 8 20 8' }),
  h('line', { x1: '16', y1: '13', x2: '8', y2: '13' }),
  h('line', { x1: '16', y1: '17', x2: '8', y2: '17' }),
  h('polyline', { points: '10 9 9 9 8 9' })
])

// 接收的属性
const props = defineProps({
  prompts: {
    type: Array,
    default: () => []
  },
  emptyMessage: {
    type: String,
    default: '没有找到提示词'
  }
})

// 路由
const router = useRouter()

// 导航到创建页面
const navigateToCreate = () => {
  router.push({ name: 'create-prompt' })
}
</script>

<style lang="scss" scoped>
.prompt-grid {
  margin-bottom: var(--space-8);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-16) 0;
  text-align: center;
  
  .empty-icon {
    margin-bottom: var(--space-6);
    color: var(--color-text-tertiary);
  }
  
  .empty-title {
    font-size: var(--font-size-xl);
    font-weight: 600;
    margin-bottom: var(--space-4);
    color: var(--color-text-primary);
  }
  
  .empty-description {
    font-size: var(--font-size-base);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-6);
    max-width: 400px;
  }
  
  .create-button {
    padding: var(--space-3) var(--space-6);
  }
}

.document-icon {
  color: var(--color-text-tertiary);
  opacity: 0.5;
}
</style> 