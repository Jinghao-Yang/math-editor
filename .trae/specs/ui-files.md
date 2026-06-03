# MathSpace UI 文件索引

## 设计参考
- [ui.txt](file:///d:/Desktop/math-editor/.trae/specs/ui.txt) — 纯 HTML 设计稿，所有视觉规范的来源

## 全局样式
- [globals.css](file:///d:/Desktop/math-editor/styles/globals.css) — `.object-card`、`.canvas-grid`、MathSpace CSS 变量
- [tailwind.config.ts](file:///d:/Desktop/math-editor/tailwind.config.ts) — `math-*` 颜色令牌

## 布局框架
- [PlaneLayout.tsx](file:///d:/Desktop/math-editor/components/plane/PlaneLayout.tsx) — 260px 侧边栏 + 毛玻璃顶栏 + 主内容区

## 页面
- [app/page.tsx](file:///d:/Desktop/math-editor/app/page.tsx) — 首页（canvas-grid 背景 + CTA 入口）
- [app/knowledge-base/page.tsx](file:///d:/Desktop/math-editor/app/knowledge-base/page.tsx) — 知识库主页（项目看板）
- [app/knowledge-base/documents/page.tsx](file:///d:/Desktop/math-editor/app/knowledge-base/documents/page.tsx) — 文档列表页

## 工作台
- [KnowledgeBaseLayout.tsx](file:///d:/Desktop/math-editor/components/plane/KnowledgeBaseLayout.tsx) — browse / edit 模式切换 + 编辑器容器

## 视图组件
- [KanbanView.tsx](file:///d:/Desktop/math-editor/components/plane/views/KanbanView.tsx) — 看板（Linear 极简风格 + object-card 卡片 + 列分组）
- [CalendarView.tsx](file:///d:/Desktop/math-editor/components/plane/views/CalendarView.tsx) — 日历时间线（object-card 卡片）

## 列表与文档树
- [document-list.tsx](file:///d:/Desktop/math-editor/components/knowledge-base/document-list.tsx) — 文档网格卡片（object-card 风格）
- [DocumentTree.tsx](file:///d:/Desktop/math-editor/components/plane/DocumentTree.tsx) — 文档树（Outline 风格缩进）

## 共享 UI
- [EmptyStateHero.tsx](file:///d:/Desktop/math-editor/components/tailwind/ui/EmptyStateHero.tsx) — 空状态引导组件
- 其余 shadcn 组件位于 [components/tailwind/ui/](file:///d:/Desktop/math-editor/components/tailwind/ui/)
