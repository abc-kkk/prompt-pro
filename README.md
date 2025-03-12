# 提示词库 (Prompt Pro)

一个用于管理和组织AI提示词的工具，帮助用户高效地创建、分类、搜索和使用提示词。

## 功能特点

- 创建和编辑提示词
- 分类管理
- 收藏常用提示词
- 搜索和筛选
- 使用统计
- 导入/导出数据
- 支持明/暗主题切换

## 技术栈

- Vue 3
- Vue Router
- Pinia
- Vite
- SCSS

## 开发指南

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 项目结构

```
src/
├── assets/         # 静态资源
│   └── styles/     # 样式文件
├── components/     # 组件
│   ├── layout/     # 布局组件
│   └── prompt/     # 提示词相关组件
├── router/         # 路由配置
├── stores/         # Pinia 存储
├── views/          # 页面视图
└── App.vue         # 根组件
```

## 数据存储

应用使用浏览器的 localStorage 进行数据持久化，支持导入/导出功能以便备份和迁移数据。

## 许可证

MIT
