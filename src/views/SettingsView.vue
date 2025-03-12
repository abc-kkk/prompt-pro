<template>
  <div class="settings-view">
    <div class="page-header">
      <div class="header-content">
        <h1 class="title">设置</h1>
        <p class="description">管理应用程序的全局设置和数据</p>
      </div>
    </div>

    <div class="settings-container">
      <!-- 外观设置 -->
      <div class="settings-section">
        <h2 class="section-title">外观</h2>
        
        <div class="setting-item">
          <div class="setting-info">
            <h3 class="setting-title">主题</h3>
            <p class="setting-description">选择应用程序的显示主题</p>
          </div>
          <div class="setting-control">
            <select v-model="theme" @change="changeTheme" class="theme-select">
              <option value="system">跟随系统</option>
              <option value="light">浅色</option>
              <option value="dark">深色</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 数据管理 -->
      <div class="settings-section">
        <h2 class="section-title">数据管理</h2>
        
        <div class="setting-item">
          <div class="setting-info">
            <h3 class="setting-title">导出数据</h3>
            <p class="setting-description">将所有提示词和分类导出为JSON文件</p>
          </div>
          <div class="setting-control">
            <button @click="exportData" class="btn-action">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              导出数据
            </button>
          </div>
        </div>
        
        <div class="setting-item">
          <div class="setting-info">
            <h3 class="setting-title">导入数据</h3>
            <p class="setting-description">从JSON文件导入提示词和分类</p>
          </div>
          <div class="setting-control">
            <label for="import-file" class="btn-action">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              导入数据
            </label>
            <input 
              type="file" 
              id="import-file" 
              accept=".json" 
              @change="importData" 
              class="file-input"
            />
          </div>
        </div>
        
        <div class="setting-item">
          <div class="setting-info">
            <h3 class="setting-title">清除所有数据</h3>
            <p class="setting-description">删除所有提示词和分类数据（此操作不可撤销）</p>
          </div>
          <div class="setting-control">
            <button @click="confirmClearData" class="btn-danger">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              清除数据
            </button>
          </div>
        </div>
      </div>

      <!-- 关于 -->
      <div class="settings-section">
        <h2 class="section-title">关于</h2>
        
        <div class="setting-item">
          <div class="setting-info">
            <h3 class="setting-title">版本</h3>
            <p class="setting-description">当前版本: {{ appVersion }}</p>
          </div>
        </div>
        
        <div class="setting-item">
          <div class="setting-info">
            <h3 class="setting-title">开源协议</h3>
            <p class="setting-description">本应用基于 MIT 协议开源</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 清除数据确认对话框 -->
    <div v-if="showClearConfirm" class="confirm-dialog">
      <div class="dialog-content">
        <h3>确认清除所有数据</h3>
        <p>此操作将删除所有提示词和分类数据，且不可恢复。</p>
        <p>建议在清除前先导出数据备份。</p>
        
        <div class="dialog-actions">
          <button @click="showClearConfirm = false" class="btn-cancel">取消</button>
          <button @click="clearAllData" class="btn-confirm">确认清除</button>
        </div>
      </div>
    </div>

    <!-- 导入成功提示 -->
    <div v-if="showImportSuccess" class="toast-message success">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>数据导入成功</span>
    </div>

    <!-- 导出成功提示 -->
    <div v-if="showExportSuccess" class="toast-message success">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>数据导出成功</span>
    </div>

    <!-- 错误提示 -->
    <div v-if="showError" class="toast-message error">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span>{{ errorMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { usePromptStore } from '@/stores/promptStore';
import { useCategoryStore } from '@/stores/categoryStore';

// 获取存储
const promptStore = usePromptStore();
const categoryStore = useCategoryStore();

// 应用版本
const appVersion = ref('1.0.0');

// 主题设置
const theme = ref('system');

// 对话框状态
const showClearConfirm = ref(false);

// 提示消息状态
const showImportSuccess = ref(false);
const showExportSuccess = ref(false);
const showError = ref(false);
const errorMessage = ref('');

/**
 * 组件挂载时初始化
 */
onMounted(() => {
  // 获取当前主题设置
  const savedTheme = localStorage.getItem('theme') || 'system';
  theme.value = savedTheme;
  applyTheme(savedTheme);
});

/**
 * 切换主题
 */
function changeTheme() {
  localStorage.setItem('theme', theme.value);
  applyTheme(theme.value);
}

/**
 * 应用主题到文档
 * @param {string} themeName - 主题名称
 */
function applyTheme(themeName) {
  if (themeName === 'system') {
    // 跟随系统
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    // 手动设置
    document.documentElement.setAttribute('data-theme', themeName);
  }
}

/**
 * 导出数据为JSON文件
 */
function exportData() {
  try {
    // 准备导出数据
    const exportData = {
      prompts: promptStore.prompts,
      categories: categoryStore.categories,
      version: appVersion.value,
      exportDate: new Date().toISOString()
    };
    
    // 转换为JSON字符串
    const jsonString = JSON.stringify(exportData, null, 2);
    
    // 创建Blob对象
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prompt-pro-export-${new Date().toISOString().slice(0, 10)}.json`;
    
    // 触发下载
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 释放URL对象
    URL.revokeObjectURL(url);
    
    // 显示成功提示
    showExportSuccess.value = true;
    setTimeout(() => {
      showExportSuccess.value = false;
    }, 3000);
  } catch (error) {
    console.error('导出数据失败:', error);
    errorMessage.value = '导出数据失败';
    showError.value = true;
    setTimeout(() => {
      showError.value = false;
    }, 3000);
  }
}

/**
 * 从JSON文件导入数据
 * @param {Event} event - 文件选择事件
 */
function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      
      // 验证数据格式
      if (!data.prompts || !data.categories) {
        throw new Error('无效的数据格式');
      }
      
      // 导入分类
      categoryStore.importCategories(data.categories);
      
      // 导入提示词
      promptStore.importPrompts(data.prompts);
      
      // 重置文件输入
      event.target.value = '';
      
      // 显示成功提示
      showImportSuccess.value = true;
      setTimeout(() => {
        showImportSuccess.value = false;
      }, 3000);
    } catch (error) {
      console.error('导入数据失败:', error);
      errorMessage.value = '导入数据失败: ' + error.message;
      showError.value = true;
      setTimeout(() => {
        showError.value = false;
      }, 3000);
    }
  };
  
  reader.onerror = () => {
    errorMessage.value = '读取文件失败';
    showError.value = true;
    setTimeout(() => {
      showError.value = false;
    }, 3000);
  };
  
  reader.readAsText(file);
}

/**
 * 确认清除所有数据
 */
function confirmClearData() {
  showClearConfirm.value = true;
}

/**
 * 清除所有数据
 */
function clearAllData() {
  try {
    // 清除提示词
    promptStore.clearAllPrompts();
    
    // 清除分类
    categoryStore.clearAllCategories();
    
    // 关闭确认对话框
    showClearConfirm.value = false;
    
    // 显示成功提示
    errorMessage.value = '所有数据已清除';
    showError.value = true;
    setTimeout(() => {
      showError.value = false;
    }, 3000);
  } catch (error) {
    console.error('清除数据失败:', error);
    errorMessage.value = '清除数据失败';
    showError.value = true;
    setTimeout(() => {
      showError.value = false;
    }, 3000);
  }
}
</script>

<style lang="scss" scoped>
.settings-view {
  padding: 2rem;
  max-width: 1000px;
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

.settings-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.settings-section {
  background-color: var(--color-background-soft);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid var(--color-border-soft);
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}

.setting-info {
  flex: 1;
}

.setting-title {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.setting-description {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.setting-control {
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    width: 100%;
  }
}

.theme-select {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  color: var(--color-text);
  font-size: 0.875rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
}

.btn-action, .btn-danger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  svg {
    flex-shrink: 0;
  }
}

.btn-action {
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  
  &:hover {
    background-color: var(--color-background-mute);
  }
}

.btn-danger {
  background-color: var(--color-background);
  border: 1px solid var(--color-danger);
  color: var(--color-danger);
  
  &:hover {
    background-color: var(--color-danger);
    color: white;
  }
}

.file-input {
  display: none;
}

.confirm-dialog {
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
  
  p {
    margin-bottom: 0.5rem;
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
    
    &:hover {
      background-color: var(--color-danger-dark);
    }
  }
}

.toast-message {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
  
  &.success {
    background-color: var(--color-success-bg);
    color: var(--color-success);
    border-left: 4px solid var(--color-success);
  }
  
  &.error {
    background-color: var(--color-danger-bg);
    color: var(--color-danger);
    border-left: 4px solid var(--color-danger);
  }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style> 