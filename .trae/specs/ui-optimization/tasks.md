# MathSpace UI 优化方案 - 实施计划

## [x] Task 1: 更新字体配置 (styles/fonts.ts)
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 引入 Newsreader、Space_Grotesk、JetBrains_Mono 三种 Google Fonts
  - 定义 CSS 变量导出（--font-reading、--font-sys、--font-mono）
  - 更新 titleFontMapper 和 defaultFontMapper
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `human-judgement` TR-1.1: 检查 styles/fonts.ts 文件内容是否符合规范
  - `human-judgement` TR-1.2: 验证字体变量正确导出

## [x] Task 2: 更新根布局配置 (app/layout.tsx)
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 导入字体变量
  - 将字体 CSS 变量注入到 <html> 标签
  - 设置珍珠白背景 (#FAF9F6) 和墨黑文字 (#111111)
- **Acceptance Criteria Addressed**: AC-1, AC-2
- **Test Requirements**:
  - `human-judgement` TR-2.1: 检查 layout.tsx 中字体变量正确注入
  - `human-judgement` TR-2.2: 验证 body 样式符合瑞士主义设计

## [x] Task 3: 更新全局 CSS (styles/globals.css)
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 定义瑞士主义 CSS 变量（珍珠白背景、墨黑文字、瑞士红点、极细网格线）
  - 强制全局移除圆角（border-radius: 0）
  - 添加红点指示器、渐进式信息呈现等样式
- **Acceptance Criteria Addressed**: AC-2, AC-6
- **Test Requirements**:
  - `human-judgement` TR-3.1: 检查 CSS 变量定义正确
  - `human-judgement` TR-3.2: 验证全局圆角强制设为 0
  - `human-judgement` TR-3.3: 检查红点指示器样式存在

## [x] Task 4: 更新 Tailwind 配置 (tailwind.config.ts)
- **Priority**: P0
- **Depends On**: Task 3
- **Description**: 
  - 映射新颜色变量到 Tailwind theme（canvas、surface、text-main、text-muted、swiss-red、grid-line）
  - 映射字体族（font-sys、font-reading、font-mono）
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `human-judgement` TR-4.1: 检查颜色变量映射正确
  - `human-judgement` TR-4.2: 验证字体族配置正确

## [x] Task 5: 更新框架组件 (components/plane/PlaneLayout.tsx)
- **Priority**: P0
- **Depends On**: Task 3, Task 4
- **Description**: 
  - 重写侧边栏为严谨的数字目录结构
  - 添加瑞士红点指示器（indicator-dot）
  - 更新导航项样式，Hover 时显示红点平移效果
  - 简化顶部面包屑设计
- **Acceptance Criteria Addressed**: AC-3, AC-6
- **Test Requirements**:
  - `human-judgement` TR-5.1: 检查侧边栏显示数字序号（01、02、03）
  - `human-judgement` TR-5.2: 验证激活项显示红点指示器
  - `human-judgement` TR-5.3: 检查无边框设计应用

## [x] Task 6: 更新知识底座布局 (components/plane/KnowledgeBaseLayout.tsx)
- **Priority**: P1
- **Depends On**: Task 3, Task 4
- **Description**: 
  - 重组页面结构，保留极简路径树
  - 编辑区域宽度限制为 850px（黄金阅读比例）
  - 移除圆角边框设计
- **Acceptance Criteria Addressed**: AC-6
- **Test Requirements**:
  - `human-judgement` TR-6.1: 检查编辑区域最大宽度为 850px
  - `human-judgement` TR-6.2: 验证无边框设计

## [x] Task 7: 更新看板视图 (components/plane/views/KanbanView.tsx)
- **Priority**: P0
- **Depends On**: Task 3, Task 4
- **Description**: 
  - 重构为学术目录样式（横向轴账本）
  - 使用 Newsreader 字体渲染标题内容
  - 添加学术序号、悬浮渐进式信息
  - 移除卡片阴影效果，改用分割线
- **Acceptance Criteria Addressed**: AC-4, AC-6
- **Test Requirements**:
  - `human-judgement` TR-7.1: 检查文档以学术目录形式展示
  - `human-judgement` TR-7.2: 验证序号显示正确（01、02...）
  - `human-judgement` TR-7.3: 检查悬浮时显示额外信息

## [x] Task 8: 更新反向链接面板 (components/plane/links/BacklinksPanel.tsx)
- **Priority**: P1
- **Depends On**: Task 3, Task 4
- **Description**: 
  - 整合三个模块：拓扑空间结构、认知上下文双栏布局、反向关联
  - 添加瑞士红点指示器标记当前焦点
  - 使用新的颜色变量
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `human-judgement` TR-8.1: 检查三个模块（Topology Structure、Framework & Basis、Linked References）存在
  - `human-judgement` TR-8.2: 验证红点标记当前节点

## [x] Task 9: 构建验证
- **Priority**: P0
- **Depends On**: 所有前面任务
- **Description**: 
  - 运行构建命令验证代码正确性
  - 检查是否有 TypeScript 错误
- **Acceptance Criteria Addressed**: 所有 AC
- **Test Requirements**:
  - `programmatic` TR-9.1: 构建命令成功完成（exit code 0）
  - `programmatic` TR-9.2: 无 TypeScript 类型错误

## [x] Task 10: 深色模式支持
- **Priority**: P1
- **Depends On**: Task 3, Task 4
- **Description**: 
  - 在 CSS 变量中添加深色模式对应的变量（深色背景、白色文字等）
  - 通过 Tailwind 的 darkMode 类切换实现深色模式
- **Acceptance Criteria Addressed**: 深色模式支持需求
- **Test Requirements**:
  - `human-judgement` TR-10.1: 检查深色模式变量定义正确
  - `human-judgement` TR-10.2: 验证切换 .dark 类后样式正确切换

## [x] Task 11: 移动端适配
- **Priority**: P1
- **Depends On**: Task 5
- **Description**: 
  - 保留响应式设计，确保侧边栏在小屏幕上可折叠
  - 使用 Sheet 组件实现移动端菜单
  - 调整内边距等布局参数适配移动端
- **Acceptance Criteria Addressed**: 移动端适配需求
- **Test Requirements**:
  - `human-judgement` TR-11.1: 检查移动端菜单按钮存在
  - `human-judgement` TR-11.2: 验证小屏幕下侧边栏隐藏，Sheet 菜单正常工作