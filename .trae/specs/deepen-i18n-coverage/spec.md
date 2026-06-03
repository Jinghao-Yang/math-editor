# 深化国际化覆盖 Spec

## Why
上轮已建立语言切换基础设施并覆盖首页、知识库、编辑器、搜索和同步状态等核心路径。但调研发现仍有约 120+ 处硬编码中英文分布在 30 个文件中，涉及项目表单、PDF 工具栏、AI 命令菜单、节点/颜色选择器、浮动操作按钮、Slack 命令、文档列表状态标签等区域。需要系统性地收口这些遗漏点，让整条用户路径在任意语言下都不再出现无意的混用。

## What Changes
- 将项目相关表单、面板和联动组件中的硬编码英文文案迁移到统一字典
- 将 PDF 查看器、注释工具栏中的硬编码中文文案迁移到统一字典
- 将 AI 生成命令菜单和选择器中的硬编码英文文案迁移到统一字典
- 将编辑器节点/颜色/链接选择器中的硬编码标签迁移到统一字典
- 将 DocumentTree、BacklinksPanel、FloatingActionButton 中的硬编码文案迁移到统一字典
- 将 document-list 同步状态标签、Slack 命令/通知文案迁移到统一字典
- 补齐元数据（页面 title/description/openGraph）的本地化

## Impact
- Affected specs: 语言切换与统一文案（继承其基础设施）
- Affected code: `components/project/*`、`components/pdf/*`、`components/tailwind/generative/*`、`components/tailwind/selectors/*`、`components/plane/DocumentTree.tsx`、`components/plane/FloatingActionButton.tsx`、`components/plane/links/BacklinksPanel.tsx`、`components/knowledge-base/document-list.tsx`、`lib/slack/commands.ts`、`lib/slack/notifications.ts`、`app/layout.tsx`、`lib/i18n/dictionaries.ts`

## ADDED Requirements
### Requirement: 项目相关组件文案国际化
系统 SHALL 将项目面板、创建/编辑表单、项目列表、文档关联等组件中的硬编码文案迁移到统一字典。

#### Scenario: 项目创建表单随语言切换
- **WHEN** 用户打开新建项目或编辑项目对话框
- **THEN** 对话框标题、字段标签、placeholder、提交按钮和加载状态应使用当前语言

#### Scenario: 项目列表与关联组件统一
- **WHEN** 用户查看项目列表或关联文档到项目
- **THEN** 空态文案、按钮文案和状态标签应使用当前语言

### Requirement: PDF 查看器与注释工具栏文案国际化
系统 SHALL 将 PDF 上传入口和注释工具按钮中的硬编码文案迁移到统一字典。

#### Scenario: PDF 工具栏按钮随语言切换
- **WHEN** 用户打开 PDF 查看器或使用注释工具
- **THEN** 上传按钮、注释模式按钮（选择、高亮、文字、矩形）的 tooltip 应使用当前语言

### Requirement: AI 生成功能文案国际化
系统 SHALL 将 AI 命令菜单、生成提示和占位文案迁移到统一字典。

#### Scenario: AI 命令菜单随语言切换
- **WHEN** 用户展开 AI 操作菜单
- **THEN** "Improve writing"、"Fix grammar"、"Make shorter" 等预设命令、分组标题和输入占位符应使用当前语言

#### Scenario: AI 错误与状态反馈统一
- **WHEN** AI 请求失败或达到限制
- **THEN** 错误提示和加载文案应使用当前语言

### Requirement: 编辑器选择器文案国际化
系统 SHALL 将节点类型选择器、颜色选择器和链接选择器中的硬编码标签迁移到统一字典。

#### Scenario: 节点与颜色选择器随语言切换
- **WHEN** 用户展开节点类型或颜色选择器
- **THEN** "Text"、"Heading 1"、"Purple"、"Red" 等选项标签和分组标题应使用当前语言

### Requirement: Plane 布局组件文案收口
系统 SHALL 将 DocumentTree、BacklinksPanel、FloatingActionButton 中的硬编码文案迁移到统一字典。

#### Scenario: 浮动操作按钮文案统一
- **WHEN** 用户点击 FAB 创建新文档/项目/Cycle/Module
- **THEN** 菜单项标签和描述应使用当前语言

### Requirement: 反馈与工具文案收口
系统 SHALL 将 document-list 同步状态标签、Slack 命令/通知文案迁移到统一字典。

#### Scenario: 文档列表同步状态随语言切换
- **WHEN** 用户在文档列表中查看同步状态
- **THEN** "已同步"、"待同步"、"同步失败" 等标签应使用当前语言

#### Scenario: Slack 命令响应随语言切换
- **WHEN** 用户通过 Slack 执行搜索等命令
- **THEN** 响应文本应使用当前语言（因 Slack 通知属于异步服务端响应，应以服务端上下文中可用语言为准；本文案迁移确保字典中存在对应 key，便于未来读取）

### Requirement: 页面元数据本地化
系统 SHALL 在布局中根据当前语言正确设置页面 title、description、openGraph 和 Twitter 元信息，替代现有硬编码的英文 Novel 品牌信息。

## MODIFIED Requirements
### Requirement: 现有本地化字典结构
系统 SHALL 在现有 `dictionaries.ts` 中补齐 `project`、`pdf`、`ai`、`selectors`、`plane`、`slack` 和 `metadata` 命名空间，承载本次新迁移的所有文案。

## REMOVED Requirements
无需移除。
