/**
 * 分类状态管理
 * 负责分类的CRUD操作和状态管理
 */
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { usePromptStore } from './promptStore'
import { ref, computed } from 'vue'

export const useCategoryStore = defineStore('category', () => {
  // 分类列表
  const categories = ref([])
  
  // 下一个ID（用于新增分类）
  const nextId = ref(1)
  
  /**
   * 初始化存储
   */
  function initStore() {
    // 从本地存储加载数据
    const savedCategories = localStorage.getItem('categories')
    const savedNextId = localStorage.getItem('nextCategoryId')
    
    if (savedCategories) {
      categories.value = JSON.parse(savedCategories)
    } else {
      // 如果没有保存的分类，添加默认分类
      categories.value = [
        { id: 1, name: '通用', color: '#3498db' },
        { id: 2, name: '创意写作', color: '#2ecc71' },
        { id: 3, name: '编程', color: '#9b59b6' },
        { id: 4, name: '学术', color: '#f39c12' }
      ]
      nextId.value = 5
    }
    
    if (savedNextId) {
      nextId.value = parseInt(savedNextId)
    }
  }
  
  /**
   * 保存数据到本地存储
   */
  function saveToLocalStorage() {
    localStorage.setItem('categories', JSON.stringify(categories.value))
    localStorage.setItem('nextCategoryId', nextId.value.toString())
  }
  
  /**
   * 添加新分类
   * @param {Object} category - 分类对象
   * @returns {Object} 添加后的分类对象
   */
  function addCategory(category) {
    const newCategory = {
      id: nextId.value,
      name: category.name,
      color: category.color || '#3498db'
    }
    
    categories.value.push(newCategory)
    nextId.value++
    
    saveToLocalStorage()
    return newCategory
  }
  
  /**
   * 更新分类
   * @param {Object} category - 分类对象
   * @returns {Object|null} 更新后的分类对象，如果未找到则返回null
   */
  function updateCategory(category) {
    const index = categories.value.findIndex(c => c.id === category.id)
    
    if (index === -1) {
      return null
    }
    
    const updatedCategory = {
      ...categories.value[index],
      name: category.name,
      color: category.color
    }
    
    categories.value[index] = updatedCategory
    saveToLocalStorage()
    
    return updatedCategory
  }
  
  /**
   * 删除分类
   * @param {number} id - 分类ID
   * @returns {boolean} 是否删除成功
   */
  function deleteCategory(id) {
    const index = categories.value.findIndex(c => c.id === id)
    
    if (index === -1) {
      return false
    }
    
    categories.value.splice(index, 1)
    saveToLocalStorage()
    
    return true
  }
  
  /**
   * 根据ID获取分类
   * @param {number} id - 分类ID
   * @returns {Object|null} 分类对象，如果未找到则返回null
   */
  function getCategoryById(id) {
    return categories.value.find(c => c.id === parseInt(id)) || null
  }
  
  /**
   * 导入分类数据
   * @param {Array} importedCategories - 要导入的分类数组
   */
  function importCategories(importedCategories) {
    if (!Array.isArray(importedCategories)) {
      return
    }
    
    // 找出最大ID
    let maxId = 0
    
    if (importedCategories.length > 0) {
      // 合并分类数据，避免ID冲突
      const existingIds = new Set(categories.value.map(c => c.id))
      
      importedCategories.forEach(category => {
        if (!existingIds.has(category.id)) {
          categories.value.push(category)
          maxId = Math.max(maxId, category.id)
        }
      })
      
      // 更新nextId
      nextId.value = Math.max(nextId.value, maxId + 1)
      
      saveToLocalStorage()
    }
  }
  
  /**
   * 清除所有分类数据
   */
  function clearAllCategories() {
    categories.value = []
    nextId.value = 1
    saveToLocalStorage()
  }
  
  // 初始化存储
  initStore()
  
  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    importCategories,
    clearAllCategories
  }
}) 