# 提示词库 (Prompt-Pro)

提示词库是一个帮助用户管理和组织AI提示词的工具，提高创作效率。

## 特性

- 提示词管理：创建、编辑、删除和组织提示词
- 分类系统：通过自定义分类组织提示词
- 收藏功能：收藏常用提示词以便快速访问
- 使用统计：记录提示词使用次数和使用历史
- 主题切换：支持浅色和深色模式
- 本地存储：所有数据存储在浏览器本地，保护隐私

## 技术栈

- Vue 3：前端框架
- Vue Router：路由管理
- Pinia：状态管理
- SCSS：样式预处理器
- Vite：构建工具

## 如何使用

1. 访问 [https://abc-kkk.github.io/prompt-pro/](https://abc-kkk.github.io/prompt-pro/)
2. 创建和管理您的提示词
3. 使用分类和标签组织提示词
4. 收藏常用提示词

## 本地开发

```bash
# 克隆仓库
git clone https://github.com/abc-kkk/prompt-pro.git

# 安装依赖
cd prompt-pro
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 部署到GitHub Pages
npm run deploy
```

## 数据存储

提示词库使用浏览器的localStorage存储所有数据，这意味着：

- 数据存储在您的本地设备上，不会上传到任何服务器
- 清除浏览器数据会删除您的提示词库数据
- 不同设备之间的数据不会自动同步

您可以使用导出/导入功能来备份和迁移数据。

## 许可证

MIT