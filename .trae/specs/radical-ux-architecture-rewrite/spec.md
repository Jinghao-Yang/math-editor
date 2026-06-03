# 激进 UI/UX 架构重写 Spec

## Why
上轮 UI 改版过于保守，仅做了表面视觉统一，未触及底层架构问题。当前产品在信息层级、空间利用率、导航结构、编辑器-知识库集成和空状态设计上存在系统性缺陷。用户反馈集中在十个具体痛点，需要一次彻底的架构重写，吸收人机交互与认知心理学原则，并参考 Outline、Logseq、Linear、Plane 等优秀开源项目的设计范式。

## What Changes

### 架构层变更
- **BREAKING**：移除 KnowledgeBaseLayout 的三栏（浏览+编辑）分屏模式，改为点击文档后主工作区域直接替换为全宽编辑器（sidebar 和 topbar 保留，中间内容区切换为编辑器全屏）。用户通过面包屑或在编辑器顶部返回按钮回到列表视图
- **BREAKING**：文档不再依赖项目。Documents 模块支持一键创建独立文档，Project 降级为可选标签/归类，不再阻塞文档创建流程

### 交互设计层变更
- 以认知负荷理论为指导，一次只让用户关注一个核心任务。导航页与编辑页之间通过上下文切换而非并列分屏来表达
- 面包屑导航替代冗余状态标签，减少页面顶部的视觉噪音
- 主要操作按钮（新建文档）放置在内容区顶部左侧或居中，建立与内容区的强视觉关联
- 空状态从模板化图标+文字升级为有吸引力的引导型首屏，包含快速创建入口和精选操作提示

### 视觉设计层变更
- 参考 Linear、Plane 的现代设计语言：使用更鲜明的品牌色彩、更大的圆角（面板/卡片）、微妙的阴影层次、更精细的间距系统
- 参考当代学院派平面设计：建立清晰的版式层级（标题→副标题→正文→辅助文本）、足够的负空间、网格对齐
- 看板卡片设计参考 Linear 的 issue 卡片风格：紧凑信息密度、清晰优先级可视、hover 微交互
- 参考 Outline 的文档树和侧边栏风格：嵌套缩进、温和 hover 态、文档图标按类型区分

### 知识库工作台重构
- 页面整体结构固定为：左侧窄 sidebar（导航项+可折叠） → 顶部简洁 topbar（面包屑+搜索+快捷操作） → 下方全高工作区（列表/看板/日历 或 编辑器）
- 文档列表页使用紧凑卡片或表格式布局，充分利用水平空间减少滚动
- 看板视图的列拖拽、卡片样式全面重做

## Impact
- Affected specs: 所有已完成的 UI/UX 和 i18n 规格均需在此架构上重新适配
- Affected code:
  - 核心重构：`KnowledgeBaseLayout.tsx`（完全重写为工作台模式）
  - 页面重构：`app/knowledge-base/page.tsx`、`app/knowledge-base/documents/page.tsx`
  - 组件重写：`KanbanView.tsx`、`CalendarView.tsx`、`document-list.tsx`、`DocumentTree.tsx`
  - 编辑器集成：`components/tailwind/editor.tsx`、`KnowledgeBaseLayout.tsx`
  - 空状态：新增 `EmptyStateHero.tsx` 组件
  - 样式：`globals.css`、`tailwind.config.ts`

## ADDED Requirements

### Requirement 1: 认知减负——单任务上下文架构
系统 SHALL 以认知负荷理论为指导，确保每个屏幕主要服务于一个核心任务，避免并列分屏带来的注意力分散。

#### Scenario: 浏览与编辑不并列
- **WHEN** 用户点击文档
- **THEN** 主工作区域应从列表/看板视图切换为全宽编辑器
- **AND** 不保留右侧缩小的列表面板
- **AND** 用户可通过编辑器顶部返回按钮或面包屑回到列表

#### Scenario: Sidebar 和 Topbar 保持恒定
- **WHEN** 用户在工作台内导航或进入编辑器
- **THEN** 左侧 sidebar 和顶部 topbar 保持可见
- **AND** 仅中间主工作区域的内容发生切换
- **AND** 布局变更不会让用户迷失当前位置

### Requirement 2: 文档解耦——文档不依赖项目
系统 SHALL 允许用户在 Documents 模块下直接创建独立文档，Project 仅作为可选标签。

#### Scenario: 一键创建独立文档
- **WHEN** 用户在 Documents 页面点击新建文档
- **THEN** 系统应打开创建对话框
- **AND** 项目选择字段标注为"可选"
- **AND** 不填项目时文档正常创建，后续可随时关联项目

#### Scenario: 项目不再是文档前置条件
- **WHEN** 新用户首次访问知识库
- **THEN** 不应用"请先创建项目"之类的阻塞提示
- **AND** 用户可通过 Documents 导航直接进入文档管理

### Requirement 3: 简化导航层级
系统 SHALL 使用统一的轻量面包屑导航替代当前冗余的顶部状态标签。

#### Scenario: 顶部信息精简
- **WHEN** 用户浏览知识库内任意页面
- **THEN** Topbar 仅显示面包屑路径（如 知识库 / Documents）
- **AND** "当前页面: xxx" 和 "当前文档: xxx" 标签应移除
- **AND** 当前文档标题仅在编辑器顶部或 topbar 中以面包屑尾部展示

### Requirement 4: 空间利用优化
系统 SHALL 重新设计内容区密度，让工作区域充分利用可用空间。

#### Scenario: 文档列表充分利用水平空间
- **WHEN** 用户查看文档列表
- **THEN** 列表项应呈紧凑卡片网格或表格式布局
- **AND** 不出现整屏仅有一个小图标和两行字的空态占据全部空间

#### Scenario: 看板视图满屏利用
- **WHEN** 用户切换到看板视图
- **THEN** 看板列应横向铺满内容区
- **AND** 列宽根据内容自适应，列数不宜过多导致横向滚动

### Requirement 5: 现代视觉设计系统
系统 SHALL 采用参考 Linear/Plane 以及当代平面设计的视觉语言。

#### Scenario: 看板卡片风格精致
- **WHEN** 用户查看看板卡片
- **THEN** 卡片采用圆角面板、微妙阴影、hover 时轻微上浮
- **AND** 卡片内信息层级清晰：标题优先、副标题次要、标签/状态为辅助
- **AND** 卡片拖拽时提供视觉反馈

#### Scenario: 色彩与间距现代感
- **WHEN** 用户浏览任意页面
- **THEN** 面板圆角 ≥ 16px，按钮和输入框圆角 ≥ 12px
- **AND** 间距节奏基于 4px 网格（4, 8, 12, 16, 24, 32, 48）
- **AND** 阴影仅用于关键面板（sidebar、topbar、浮动卡片），避免过度使用
- **AND** 主色使用饱和度适中的品牌色，辅助色低饱和

### Requirement 6: 空状态设计升级
系统 SHALL 提供有吸引力的空状态引导，而不仅是模板化图标和文字。

#### Scenario: 文档列表为空时引导用户
- **WHEN** 用户尚无文档且打开 Documents 页面
- **THEN** 展示现代化空状态，包含一个醒目的"创建第一个文档"按钮
- **AND** 提供可选的操作提示或快速模板入口
- **AND** 空状态在视觉上居中且不空旷

### Requirement 7: 文档树侧边栏参考 Outline
系统 SHALL 参考 Outline 的文档树设计，提供嵌套缩进、温和交互和类型图标区分。

#### Scenario: 文档树交互
- **WHEN** 用户展开文档树
- **THEN** 文件夹/文档使用不同图标区分
- **AND** hover 时行背景温和变化
- **AND** 选中项有明显但不过激的高亮
- **AND** 折叠/展开使用流畅动画

### Requirement 8: 看板设计参考 Linear
系统 SHALL 参考 Linear 和 Plane 的看板设计范式重新实现看板视图。

#### Scenario: 看板列与卡片
- **WHEN** 用户查看看板视图
- **THEN** 列有清晰标题和文档计数
- **AND** 卡片支持拖拽到其他列
- **AND** 卡片展示标题、项目标签（如有）、最后修改时间
- **AND** 空列有引导性文案

## MODIFIED Requirements

### Requirement: 现有 KnowledgeBaseLayout
系统 SHALL 完全重写 `KnowledgeBaseLayout`。新的工作台模式下：
- 页面整体为 sidebar + topbar + 单面板主工作区
- 选文档后主工作区内容替换为编辑器，而非增加右侧分栏
- 面包屑替代状态标签

### Requirement: 现有文档创建流程
系统 SHALL 移除文档创建与项目的强制绑定。`createDocument` 接受可选的 `projectId`，新建文档弹窗中项目字段默认为空。

## REMOVED Requirements

### Requirement: 三栏分屏知识库布局
**Reason**：并列的浏览+编辑分屏增加认知负荷，且右侧编辑区空间受限，无法充分利用屏幕。
**Migration**：改为单选上下文切换模式，主工作区全宽替换。

### Requirement: 顶部冗余状态标签
**Reason**："当前页面: xxx"、"当前文档: xxx" 标签造成导航层级冗长，用户在侧边栏已能看到当前所在页面。
**Migration**：移除标签，面包屑导航替代。当前文档标题仅在编辑器视图中显示。
