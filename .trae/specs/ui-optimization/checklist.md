# MathSpace UI 优化方案 - 验证检查清单

## 字体配置验证
- [x] styles/fonts.ts: Newsreader、Space_Grotesk、JetBrains_Mono 字体正确导入
- [x] styles/fonts.ts: 字体变量（--font-reading、--font-sys、--font-mono）正确定义
- [x] styles/fonts.ts: titleFontMapper 和 defaultFontMapper 更新完成

## 根布局验证
- [x] app/layout.tsx: 字体变量正确导入
- [x] app/layout.tsx: <html> 标签注入字体 CSS 变量
- [x] app/layout.tsx: body 应用 font-sys、bg-[#FAF9F6]、text-[#111111]

## 全局 CSS 验证
- [x] styles/globals.css: 瑞士主义 CSS 变量定义正确（--bg-canvas、--text-main、--swiss-red、--grid-line）
- [x] styles/globals.css: 全局圆角强制设为 0
- [x] styles/globals.css: 红点指示器样式（indicator-dot）存在
- [x] styles/globals.css: 渐进式信息呈现样式（reveal-on-hover）存在
- [x] styles/globals.css: 极细分割线样式（axis-r、axis-l、axis-b、axis-t）存在

## Tailwind 配置验证
- [x] tailwind.config.ts: 颜色变量映射正确（canvas、surface、text-main、text-muted、swiss-red、grid-line）
- [x] tailwind.config.ts: 字体族映射正确（font-sys、font-reading、font-mono）

## 组件验证
- [x] PlaneLayout.tsx: 侧边栏数字目录结构正确
- [x] PlaneLayout.tsx: 红点指示器显示在激活导航项左侧
- [x] PlaneLayout.tsx: 无边框设计应用
- [x] KnowledgeBaseLayout.tsx: 编辑区域最大宽度为 850px
- [x] KanbanView.tsx: 学术序号显示正确（01、02...）
- [x] KanbanView.tsx: 文档标题使用 font-reading 字体
- [x] KanbanView.tsx: 悬浮时显示额外信息
- [x] BacklinksPanel.tsx: 三个模块存在（Topology Structure、Framework & Basis、Linked References）
- [x] BacklinksPanel.tsx: 红点标记当前节点

## 构建验证
- [x] 项目构建成功（npm run build 无错误）
- [x] TypeScript 类型检查通过（npm run typecheck 无错误）

## 深色模式验证
- [x] styles/globals.css: 深色模式变量定义正确（--bg-canvas: #1A1A1A, --text-main: #FAFAFA 等）
- [x] tailwind.config.ts: darkMode 设置为 ["class"] 支持类切换

## 移动端适配验证
- [x] PlaneLayout.tsx: Sheet 组件实现移动端菜单
- [x] PlaneLayout.tsx: 移动端菜单按钮在 md:hidden 时显示
- [x] KnowledgeBaseLayout.tsx: 内边距响应式调整（px-4 md:px-16）

## 视觉验证
- [x] 整体风格符合瑞士主义设计原则
- [x] 所有元素无圆角（红点指示器除外）
- [x] 颜色方案正确（珍珠白背景、墨黑文字、瑞士红点）
- [x] 字体应用正确（系统字体用于 UI、衬线字体用于阅读内容）