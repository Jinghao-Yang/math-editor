# Tasks
- [x] Task 1: 补齐字典命名空间
  - [x] 在字典中新增 `project`、`pdf`、`ai`、`selectors`、`plane`、`slack`、`metadata` 命名空间
  - [x] 为每个命名空间提供中文和英文完整翻译

- [x] Task 2: 迁移项目相关组件文案
  - [x] 替换 project-panel、project-form、project-list、document-association 中的硬编码英文
  - [x] 确保创建/编辑/关联流程在中英文下保持一致语义

- [x] Task 3: 迁移 PDF 与 AI 功能文案
  - [x] 替换 PdfViewer、AnnotationToolbar 中的硬编码中文
  - [x] 替换 ai-selector、ai-selector-commands、ai-completion-command、generative-menu-switch 中的硬编码英文

- [x] Task 4: 迁移编辑器选择器文案
  - [x] 替换 node-selector、color-selector、link-selector 中的硬编码英文标签

- [x] Task 5: 迁移 Plane 布局与反馈组件文案
  - [x] 替换 DocumentTree、BacklinksPanel、FloatingActionButton 中的硬编码文案
  - [x] 替换 document-list 中 getSyncLabel 的硬编码中文
  - [x] 替换 lib/slack/commands.ts、lib/slack/notifications.ts 中的硬编码中文

- [x] Task 6: 补齐页面元数据本地化
  - [x] 修改 app/layout.tsx，使之根据语言输出对应的 title、description、openGraph 信息
  - [x] 替换硬编码的 Novel 品牌信息为项目自身品牌信息

- [x] Task 7: 验证深化国际化覆盖质量
  - [x] 检查中文与英文在所有迁移组件中的切换效果
  - [x] 确认不再有硬编码中英文散落于核心用户路径
  - [x] 运行必要的 lint、typecheck 或手动冒烟验证

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 1
- Task 4 depends on Task 1
- Task 5 depends on Task 1
- Task 6 depends on Task 1
- Task 7 depends on Task 2, Task 3, Task 4, Task 5, Task 6

# Parallel Work Notes
- Task 2、Task 3、Task 4、Task 5、Task 6 可在 Task 1 完成后并行推进
