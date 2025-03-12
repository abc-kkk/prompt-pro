<template>
  <div class="categories-view">
    <div class="page-header">
      <div class="header-content">
        <h1 class="title">分类管理</h1>
        <p class="description">管理提示词的分类，便于组织和查找</p>
      </div>
    </div>

    <div class="categories-container">
      <div class="categories-list">
        <h2>现有分类</h2>
        <div v-if="categories.length === 0" class="empty-state">
          <p>暂无分类，请添加新分类</p>
        </div>
        <ul v-else class="category-items">
          <li v-for="category in categories" :key="category.id" class="category-item">
            <div class="category-info">
              <div class="category-color" :style="{ backgroundColor: category.color }"></div>
              <span class="category-name">{{ category.name }}</span>
              <span class="prompt-count">{{ getPromptCountByCategory(category.id) }} 个提示词</span>
            </div>
            <div class="category-actions">
              <button class="btn-edit" @click="editCategory(category)">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button class="btn-delete" @click="confirmDeleteCategory(category)" :disabled="getPromptCountByCategory(category.id) > 0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </li>
        </ul>
      </div>

      <div class="category-form">
        <h2>{{ isEditing ? '编辑分类' : '添加新分类' }}</h2>
        <form @submit.prevent="saveCategory">
          <div class="form-group">
            <label for="categoryName">分类名称</label>
            <input 
              type="text" 
              id="categoryName" 
              v-model="formData.name" 
              required 
              placeholder="输入分类名称"
            />
          </div>
          
          <div class="form-group">
            <label for="categoryColor">分类颜色</label>
            <div class="color-picker-container">
              <input 
                type="color" 
                id="categoryColor" 
                v-model="formData.color" 
                class="color-picker"
              />
              <span class="color-value">{{ formData.color }}</span>
            </div>
          </div>

          <div class="form-actions">
            <button 
              type="button" 
              class="btn-cancel" 
              @click="resetForm"
            >
              {{ isEditing ? '取消' : '重置' }}
            </button>
            <button 
              type="submit" 
              class="btn-save"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <div v-if="showDeleteConfirm" class="delete-confirm-dialog">
      <div class="dialog-content">
        <h3>确认删除</h3>
        <p>确定要删除分类 "{{ categoryToDelete?.name }}" 吗？</p>
        <p v-if="getPromptCountByCategory(categoryToDelete?.id || 0) > 0" class="error-message">
          该分类下有 {{ getPromptCountByCategory(categoryToDelete?.id || 0) }} 个提示词，无法删除。
        </p>
        <div class="dialog-actions">
          <button class="btn-cancel" @click="showDeleteConfirm = false">取消</button>
          <button 
            class="btn-confirm" 
            @click="deleteCategory" 
            :disabled="getPromptCountByCategory(categoryToDelete?.id || 0) > 0"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useCategoryStore } from '@/stores/categoryStore';
import { usePromptStore } from '@/stores/promptStore';

// 获取分类和提示词存储
const categoryStore = useCategoryStore();
const promptStore = usePromptStore();

// 计算属性：获取所有分类
const categories = computed(() => categoryStore.categories);

// 表单数据
const formData = reactive({
  id: null,
  name: '',
  color: '#3498db'
});

// 编辑状态
const isEditing = computed(() => formData.id !== null);

// 删除确认对话框状态
const showDeleteConfirm = ref(false);
const categoryToDelete = ref(null);

/**
 * 获取指定分类下的提示词数量
 * @param {number} categoryId - 分类ID
 * @returns {number} 提示词数量
 */
function getPromptCountByCategory(categoryId) {
  return promptStore.prompts.filter(prompt => prompt.categoryId === categoryId).length;
}

/**
 * 编辑分类
 * @param {Object} category - 要编辑的分类对象
 */
function editCategory(category) {
  formData.id = category.id;
  formData.name = category.name;
  formData.color = category.color;
}

/**
 * 确认删除分类
 * @param {Object} category - 要删除的分类对象
 */
function confirmDeleteCategory(category) {
  categoryToDelete.value = category;
  showDeleteConfirm.value = true;
}

/**
 * 删除分类
 */
function deleteCategory() {
  if (categoryToDelete.value) {
    categoryStore.deleteCategory(categoryToDelete.value.id);
    showDeleteConfirm.value = false;
    categoryToDelete.value = null;
  }
}

/**
 * 保存分类（新增或更新）
 */
function saveCategory() {
  if (isEditing.value) {
    // 更新现有分类
    categoryStore.updateCategory({
      id: formData.id,
      name: formData.name,
      color: formData.color
    });
  } else {
    // 添加新分类
    categoryStore.addCategory({
      name: formData.name,
      color: formData.color
    });
  }
  
  // 重置表单
  resetForm();
}

/**
 * 重置表单
 */
function resetForm() {
  formData.id = null;
  formData.name = '';
  formData.color = '#3498db';
}
</script>

<style lang="scss" scoped>
.categories-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
  
  .title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  .description {
    color: var(--color-text-secondary);
    font-size: 1rem;
  }
}

.categories-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.categories-list, .category-form {
  background-color: var(--color-background-soft);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  h2 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    font-weight: 600;
  }
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-secondary);
  background-color: var(--color-background);
  border-radius: 8px;
}

.category-items {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  background-color: var(--color-background);
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--color-background-mute);
  }
}

.category-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.category-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.category-name {
  font-weight: 500;
}

.prompt-count {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.category-actions {
  display: flex;
  gap: 0.5rem;
  
  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-secondary);
    transition: all 0.2s;
    
    &:hover {
      background-color: var(--color-background-mute);
      color: var(--color-text);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  .btn-delete:hover:not(:disabled) {
    color: var(--color-danger);
  }
}

.form-group {
  margin-bottom: 1.25rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  input[type="text"] {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    background-color: var(--color-background);
    transition: border-color 0.2s;
    
    &:focus {
      border-color: var(--color-primary);
      outline: none;
    }
  }
}

.color-picker-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.color-picker {
  width: 50px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.color-value {
  font-family: monospace;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  
  button {
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .btn-cancel {
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    color: var(--color-text);
    
    &:hover {
      background-color: var(--color-background-mute);
    }
  }
  
  .btn-save {
    background-color: var(--color-primary);
    border: 1px solid var(--color-primary);
    color: white;
    
    &:hover {
      background-color: var(--color-primary-dark);
    }
  }
}

.delete-confirm-dialog {
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
  border-radius: 8px;
  padding: 1.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  
  h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
  
  .error-message {
    color: var(--color-danger);
    margin: 1rem 0;
  }
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  
  button {
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .btn-cancel {
    background-color: var(--color-background-mute);
    border: 1px solid var(--color-border);
    color: var(--color-text);
    
    &:hover {
      background-color: var(--color-background-soft);
    }
  }
  
  .btn-confirm {
    background-color: var(--color-danger);
    border: 1px solid var(--color-danger);
    color: white;
    
    &:hover:not(:disabled) {
      background-color: var(--color-danger-dark);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}
</style> 