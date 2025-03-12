<template>
  <div class="favorites-view">
    <div class="container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">收藏夹</h1>
        <p class="page-description">
          管理您收藏的所有提示词
        </p>
      </div>
      
      <!-- 提示词列表 -->
      <div class="prompts-section">
        <div class="section-header">
          <h2 class="section-title">全部收藏提示词</h2>
        </div>
        <PromptGrid :prompts="favoritePrompts" empty-message="暂无收藏的提示词" />
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 收藏夹视图
 * 展示所有收藏的提示词
 */
import { computed } from 'vue';
import { usePromptStore } from '../stores/promptStore';
import PromptGrid from '../components/prompt/PromptGrid.vue';

// 存储
const promptStore = usePromptStore();

// 获取所有收藏的提示词
const favoritePrompts = computed(() => promptStore.favoritePrompts);
</script>

<style lang="scss" scoped>
.favorites-view {
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

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
  
  .section-title {
    font-size: var(--font-size-xl);
    font-weight: 600;
  }
}

.prompts-section {
  margin-bottom: var(--space-12);
}
</style> 