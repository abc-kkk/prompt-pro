/**
 * 设置状态管理
 * 负责应用全局设置的管理
 */
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // 主题设置
  const theme = ref('system');
  
  // 深色模式状态
  const isDarkMode = ref(false);
  
  /**
   * 初始化存储
   */
  function initStore() {
    // 从本地存储加载主题设置
    const savedTheme = localStorage.getItem('theme') || 'system';
    theme.value = savedTheme;
    
    // 应用主题
    applyTheme(savedTheme);
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
      isDarkMode.value = prefersDark;
    } else {
      // 手动设置
      document.documentElement.setAttribute('data-theme', themeName);
      isDarkMode.value = themeName === 'dark';
    }
  }
  
  /**
   * 设置主题
   * @param {string} newTheme - 新主题
   */
  function setTheme(newTheme) {
    theme.value = newTheme;
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  }
  
  /**
   * 监听系统主题变化
   */
  function setupSystemThemeListener() {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // 当系统主题变化时更新
    darkModeMediaQuery.addEventListener('change', (e) => {
      if (theme.value === 'system') {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        isDarkMode.value = e.matches;
      }
    });
  }
  
  // 初始化
  initStore();
  setupSystemThemeListener();
  
  return {
    theme,
    isDarkMode,
    setTheme
  }
}) 