# 采用 MathSpace 设计 Spec

## Why
`ui.txt` 中定义了一套完整的 MathSpace 设计语言：浅灰底色 `#F8F9FB`、纯白卡片 + `#E5E7EB` 边框、`#5E6AD2` 品牌色、分类色（橙/绿/蓝）、16px 圆角、Inter 字体。这套设计比当前界面视觉层级更清晰、质感更精致。放弃所有原 UI，全面替换。

## What Changes
- 全局配色完全重写：背景 `#F8F9FB`、卡片 `#FFFFFF`、边框 `#E5E7EB`、品牌色 `#5E6AD2`
- 字体切换为 Inter + JetBrains Mono
- Sidebar 采用 ui.txt 的干净白底 + 分组导航
- 文档卡片采用 object-card 风格（`border-radius:16px`、白色、细边框、hover 上浮）
- 看板采用 Linear 极简风格（白色面板、状态圆点指示、进度条）
- 编辑器区域采用 canvas-grid 网格背景
- Topbar 采用白色半透明毛玻璃
- 空状态、按钮、标签全部对齐新设计

## Impact
- Affected code: `styles/globals.css`（完全重写）、`tailwind.config.ts`、`styles/fonts.ts`、所有页面和组件
