/**
 * 提示词状态管理
 * 负责提示词的CRUD操作和状态管理
 */
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { ref, computed } from 'vue'

export const usePromptStore = defineStore('prompt', () => {
  // 提示词列表
  const prompts = ref([]);
  
  // 下一个ID（用于新增提示词）
  const nextId = ref(1);
  
  /**
   * 初始化存储
   */
  function initStore() {
    // 从本地存储加载数据
    const savedPrompts = localStorage.getItem('prompts');
    const savedNextId = localStorage.getItem('nextPromptId');
    
    if (savedPrompts) {
      prompts.value = JSON.parse(savedPrompts);
    }
    
    if (savedNextId) {
      nextId.value = parseInt(savedNextId);
    }
  }
  
  /**
   * 保存数据到本地存储
   */
  function saveToLocalStorage() {
    localStorage.setItem('prompts', JSON.stringify(prompts.value));
    localStorage.setItem('nextPromptId', nextId.value.toString());
  }
  
  /**
   * 添加新提示词
   * @param {Object} prompt - 提示词对象
   * @returns {Object} 添加后的提示词对象
   */
  function addPrompt(prompt) {
    const newPrompt = {
      id: nextId.value,
      title: prompt.title,
      content: prompt.content,
      categoryId: prompt.categoryId,
      tags: prompt.tags || [],
      examples: prompt.examples || [],
      isFavorite: false,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    prompts.value.push(newPrompt);
    nextId.value++;
    
    saveToLocalStorage();
    return newPrompt;
  }
  
  /**
   * 更新提示词
   * @param {Object} prompt - 提示词对象
   * @returns {Object|null} 更新后的提示词对象，如果未找到则返回null
   */
  function updatePrompt(prompt) {
    const index = prompts.value.findIndex(p => p.id === prompt.id);
    
    if (index === -1) {
      return null;
    }
    
    const updatedPrompt = {
      ...prompts.value[index],
      title: prompt.title,
      content: prompt.content,
      categoryId: prompt.categoryId,
      tags: prompt.tags || [],
      examples: prompt.examples || [],
      updatedAt: new Date().toISOString()
    };
    
    prompts.value[index] = updatedPrompt;
    saveToLocalStorage();
    
    return updatedPrompt;
  }
  
  /**
   * 删除提示词
   * @param {number} id - 提示词ID
   * @returns {boolean} 是否删除成功
   */
  function deletePrompt(id) {
    const index = prompts.value.findIndex(p => p.id === id);
    
    if (index === -1) {
      return false;
    }
    
    prompts.value.splice(index, 1);
    saveToLocalStorage();
    
    return true;
  }
  
  /**
   * 切换提示词收藏状态
   * @param {number} id - 提示词ID
   * @returns {boolean} 切换后的收藏状态
   */
  function toggleFavorite(id) {
    const prompt = prompts.value.find(p => p.id === id);
    
    if (!prompt) {
      return false;
    }
    
    prompt.isFavorite = !prompt.isFavorite;
    saveToLocalStorage();
    
    return prompt.isFavorite;
  }
  
  /**
   * 增加提示词使用次数
   * @param {number} id - 提示词ID
   * @returns {number} 增加后的使用次数
   */
  function incrementUsageCount(id) {
    const prompt = prompts.value.find(p => p.id === id);
    
    if (!prompt) {
      return 0;
    }
    
    prompt.usageCount++;
    saveToLocalStorage();
    
    return prompt.usageCount;
  }
  
  /**
   * 根据ID获取提示词
   * @param {number} id - 提示词ID
   * @returns {Object|null} 提示词对象，如果未找到则返回null
   */
  function getPromptById(id) {
    return prompts.value.find(p => p.id === parseInt(id)) || null;
  }
  
  /**
   * 根据分类ID获取提示词列表
   * @param {number} categoryId - 分类ID
   * @returns {Array} 提示词列表
   */
  function getPromptsByCategory(categoryId) {
    return prompts.value.filter(p => p.categoryId === categoryId);
  }
  
  /**
   * 获取收藏的提示词列表
   * @returns {Array} 收藏的提示词列表
   */
  const favoritePrompts = computed(() => {
    return prompts.value.filter(p => p.isFavorite);
  });
  
  /**
   * 获取最近创建的提示词列表
   * @param {number} limit - 限制数量
   * @returns {Array} 最近创建的提示词列表
   */
  function getRecentPrompts(limit = 5) {
    return [...prompts.value]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  }
  
  /**
   * 搜索提示词
   * @param {string} query - 搜索关键词
   * @returns {Array} 匹配的提示词列表
   */
  function searchPrompts(query) {
    if (!query) {
      return prompts.value;
    }
    
    const lowerQuery = query.toLowerCase();
    
    return prompts.value.filter(prompt => 
      prompt.title.toLowerCase().includes(lowerQuery) ||
      prompt.content.toLowerCase().includes(lowerQuery) ||
      prompt.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
  
  /**
   * 导入提示词数据
   * @param {Array} importedPrompts - 要导入的提示词数组
   */
  function importPrompts(importedPrompts) {
    if (!Array.isArray(importedPrompts)) {
      return;
    }
    
    // 找出最大ID
    let maxId = 0;
    
    if (importedPrompts.length > 0) {
      // 合并提示词数据，避免ID冲突
      const existingIds = new Set(prompts.value.map(p => p.id));
      
      importedPrompts.forEach(prompt => {
        if (!existingIds.has(prompt.id)) {
          prompts.value.push(prompt);
          maxId = Math.max(maxId, prompt.id);
        }
      });
      
      // 更新nextId
      nextId.value = Math.max(nextId.value, maxId + 1);
      
      saveToLocalStorage();
    }
  }
  
  /**
   * 清除所有提示词数据
   */
  function clearAllPrompts() {
    prompts.value = [];
    nextId.value = 1;
    saveToLocalStorage();
  }
  
  // 初始化存储
  initStore();
  
  return {
    prompts,
    favoritePrompts,
    addPrompt,
    updatePrompt,
    deletePrompt,
    toggleFavorite,
    incrementUsageCount,
    getPromptById,
    getPromptsByCategory,
    getRecentPrompts,
    searchPrompts,
    importPrompts,
    clearAllPrompts
  };
}) 