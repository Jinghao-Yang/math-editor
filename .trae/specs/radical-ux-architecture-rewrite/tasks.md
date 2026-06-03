# Tasks

- [x] Task 1: 重写视觉设计令牌
  - [x] 升级颜色系统：更鲜明的品牌主色、低饱和辅助色、语义色（success/warning/error）
  - [x] 统一圆角尺度：面板 16-20px、卡片 14-16px、按钮/输入框 12-14px
  - [x] 统一间距系统：基于 4px 网格（4/8/12/16/24/32/48/64）
  - [x] 细化阴影层级：sidebar 阴影、面板浮动阴影、卡片 hover 阴影，不滥用
  - [x] 建立排版层级：标题/副标题/正文/辅助文本的明确字号与字重阶梯
  - [x] 更新 `globals.css` 和 `tailwind.config.ts`

- [x] Task 2: 重构工作台核心架构（sidebar + topbar + 单面板主工作区）
  - [x] 完全重写 `KnowledgeBaseLayout.tsx`，改为 sidebar + topbar + 单面板主工作区模式
  - [x] 点击文档后，主工作区内容切换为编辑器（保留 sidebar 和 topbar）
  - [x] 编辑器顶部提供返回按钮和面包屑
  - [x] 移除三栏分屏逻辑和右侧编辑面板
  - [x] 移除"当前页面"/"当前文档"冗余状态标签，用面包屑替代

- [x] Task 3: 文档解耦——允许独立创建文档
  - [x] 修改 `documents/page.tsx`：新建文档时项目字段默认为空、标注可选
  - [x] 确保未关联项目的文档正常显示在文档列表中
  - [x] 移除任何"请先创建项目"的阻塞提示或引导

- [x] Task 4: 重做文档列表与看板视图（参考 Outline + Linear）
  - [x] 重写 `document-list.tsx`：紧凑卡片网格或表格式布局，充分利用水平空间
  - [x] 重写 `KanbanView.tsx`：参考 Linear 卡片风格，圆角面板、微妙阴影、hover 上浮
  - [x] 看板列标题清晰、含文档计数、空列有引导文案
  - [x] 卡片支持拖拽视觉反馈
  - [x] 重写 `DocumentTree.tsx`：参考 Outline 风格，嵌套缩进、温和 hover/选中态、类型图标

- [x] Task 5: 重做空状态与首页引导
  - [x] 新增现代空状态 Hero 组件，含醒目的主操作按钮和可选快速操作
  - [x] 文档列表空态、看板空态、编辑器空态统一接入新组件
  - [x] 优化 `app/page.tsx` 首页首屏，强化产品定位和主操作入口

- [x] Task 6: 简化导航层级
  - [x] Topbar 仅保留面包屑（知识库 / 当前页面名称）
  - [x] 移除 KnowledgeBaseLayout 中的"知识库工作台"、"当前页面"、"当前文档"标签
  - [x] 编辑器模式下，面包屑尾部显示当前文档标题

- [x] Task 7: 验证激进 UX 改版质量
  - [x] 检查浏览→编辑→返回列表的完整工作流，确认无分屏
  - [x] 检查文档独立创建流程，确认项目字段可选
  - [x] 检查导航层级简洁、空间利用率充分
  - [x] 检查看板/列表/文档树的视觉质量
  - [x] 运行 lint、typecheck 验证

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 1
- Task 4 depends on Task 1
- Task 5 depends on Task 1
- Task 6 depends on Task 2
- Task 7 depends on Task 2, Task 3, Task 4, Task 5, Task 6

# Parallel Work Notes
- Task 3、Task 4、Task 5 可在 Task 1 完成后与 Task 2 并行推进
- Task 6 依赖 Task 2 完成
