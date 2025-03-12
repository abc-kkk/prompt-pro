<template>
  <div class="prompt-card" :class="{ 'is-favorite': prompt.isFavorite }">
    <!-- 卡片头部 -->
    <div class="card-header">
      <div class="category-badge" :style="{ backgroundColor: categoryColor }">
        {{ categoryName }}
      </div>
      <button class="favorite-button" @click.stop="toggleFavorite">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="prompt.isFavorite ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>
    </div>
    
    <!-- 卡片内容 -->
    <div class="card-content" @click="navigateToDetail">
      <h3 class="prompt-title">{{ prompt.title }}</h3>
      <p class="prompt-preview">{{ truncatedContent }}</p>
      
      <!-- 示例图片 -->
      <div v-if="hasExamples" class="example-images">
        <div 
          v-for="(example, index) in displayExamples" 
          :key="index"
          class="example-image"
        >
          <img :src="example" alt="示例图片" />
        </div>
        <div v-if="moreExamplesCount > 0" class="more-examples">
          +{{ moreExamplesCount }}
        </div>
      </div>
      
      <!-- 标签 -->
      <div v-if="prompt.tags && prompt.tags.length > 0" class="tags">
        <span 
          v-for="tag in displayTags" 
          :key="tag" 
          class="tag"
        >
          {{ tag }}
        </span>
        <span v-if="moreTags" class="more-tags">+{{ prompt.tags.length - 3 }}</span>
      </div>
    </div>
    
    <!-- 卡片底部 -->
    <div class="card-footer">
      <div class="usage-count">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        <span>{{ prompt.usageCount }} 次使用</span>
      </div>
      
      <div class="quick-actions">
        <button class="action-button copy-button" @click.stop="copyPrompt" title="复制提示词">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
        <button class="action-button edit-button" @click.stop="editPrompt" title="编辑提示词">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 提示词卡片组件
 * 用于在列表或网格中展示提示词
 */
import { computed, h } from 'vue';
import { useRouter } from 'vue-router';
import { usePromptStore } from '../../stores/promptStore';
import { useCategoryStore } from '../../stores/categoryStore';

// 路由和存储
const router = useRouter();
const promptStore = usePromptStore();
const categoryStore = useCategoryStore();

// 定义组件属性
const props = defineProps({
  prompt: {
    type: Object,
    required: true
  }
});

// 计算属性
const truncatedContent = computed(() => {
  if (props.prompt.content.length <= 100) {
    return props.prompt.content;
  }
  return props.prompt.content.substring(0, 100) + '...';
});

const categoryName = computed(() => {
  const category = categoryStore.getCategoryById(props.prompt.categoryId);
  return category ? category.name : '未分类';
});

const categoryColor = computed(() => {
  const category = categoryStore.getCategoryById(props.prompt.categoryId);
  return category ? category.color : '#999';
});

const hasExamples = computed(() => 
  props.prompt.examples && props.prompt.examples.length > 0
);

const displayExamples = computed(() => 
  hasExamples.value ? props.prompt.examples.slice(0, 3) : []
);

const moreExamplesCount = computed(() => 
  hasExamples.value ? Math.max(0, props.prompt.examples.length - 3) : 0
);

const displayTags = computed(() => 
  props.prompt.tags && props.prompt.tags.length > 0 
    ? props.prompt.tags.slice(0, 3) 
    : []
);

const moreTags = computed(() => 
  props.prompt.tags && props.prompt.tags.length > 3
);

// 方法
const navigateToDetail = () => {
  router.push({ name: 'prompt-detail', params: { id: props.prompt.id } });
};

const toggleFavorite = () => {
  promptStore.toggleFavorite(props.prompt.id);
};

const copyPrompt = () => {
  navigator.clipboard.writeText(props.prompt.content);
  // 可以在这里添加一个成功提示
  // 同时增加使用次数
  promptStore.incrementUsageCount(props.prompt.id);
};

const editPrompt = () => {
  router.push({ name: 'edit-prompt', params: { id: props.prompt.id } });
};
</script>

<style lang="scss" scoped>
.prompt-card {
  position: relative;
  background-color: var(--color-background);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  overflow: hidden;
  transition: all var(--transition-normal) ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
    
    .quick-actions {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  &.is-favorite {
    .favorite-button {
      color: var(--color-favorite);
    }
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border-light);
}

.category-badge {
  padding: var(--space-1) var(--space-2);
  font-size: var(--font-size-xs);
  font-weight: 500;
  color: white;
  border-radius: var(--radius-sm);
}

.favorite-button {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--transition-fast) ease;
  
  &:hover {
    color: var(--color-favorite);
  }
}

.card-content {
  flex: 1;
  padding: var(--space-4);
  cursor: pointer;
}

.prompt-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--space-2);
  color: var(--color-text-primary);
}

.prompt-preview {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-3);
  line-height: 1.5;
}

.example-images {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}

.example-image {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-md);
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.more-examples {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-background-secondary);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.tag {
  padding: var(--space-1) var(--space-2);
  background-color: var(--color-background-tertiary);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.more-tags {
  padding: var(--space-1) var(--space-2);
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  border-top: 1px solid var(--color-border-light);
  background-color: var(--color-background-soft);
}

.usage-count {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.quick-actions {
  display: flex;
  gap: var(--space-2);
  opacity: 0;
  transform: translateY(4px);
  transition: all var(--transition-normal) ease;
}

.action-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition: color var(--transition-fast) ease;
  
  &:hover {
    color: var(--color-primary);
  }
}

.copy-button:hover {
  color: var(--color-success);
}

.edit-button:hover {
  color: var(--color-warning);
}
</style> 