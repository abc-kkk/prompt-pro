/**
 * 路由配置文件
 * 定义应用的所有路由
 */
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: '提示词库 - 首页'
      }
    },
    {
      path: '/prompt/:id',
      name: 'prompt-detail',
      component: () => import('@/views/PromptDetailView.vue'),
      meta: {
        title: '提示词详情'
      }
    },
    {
      path: '/create',
      name: 'create-prompt',
      component: () => import('@/views/EditPromptView.vue'),
      meta: {
        title: '创建提示词'
      }
    },
    {
      path: '/edit/:id',
      name: 'edit-prompt',
      component: () => import('@/views/EditPromptView.vue'),
      meta: {
        title: '编辑提示词'
      }
    },
    {
      path: '/recent',
      name: 'recent-prompts',
      component: () => import('@/views/RecentView.vue'),
      meta: {
        title: '最近使用的提示词'
      }
    },
    {
      path: '/favorites',
      name: 'favorite-prompts',
      component: () => import('@/views/FavoritesView.vue'),
      meta: {
        title: '收藏的提示词'
      }
    },
    {
      path: '/categories',
      name: 'manage-categories',
      component: () => import('@/views/ManageCategoriesView.vue'),
      meta: {
        title: '分类管理'
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: {
        title: '设置'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: {
        title: '页面未找到'
      }
    }
  ]
})

// 全局前置守卫，设置页面标题
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || '提示词库'
  
  // 继续导航
  next()
})

export default router 