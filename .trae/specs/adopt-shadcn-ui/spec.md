# 引入 Shadcn UI Spec

## Why
项目已有 `components.json` 配置 shadcn/ui，但现有 UI 组件是手工搭建的简陋版本——配色用的是默认 `slate`（灰白单调），按钮、卡片、对话框等组件缺乏精心打磨的细节。shadcn/ui 提供了经过数百个项目验证的精美组件，直接引入可大幅提升视觉品质且降低维护成本。

## What Changes
- 用官方 shadcn/ui 组件替换手写的简陋版本（button、card、dialog、dropdown-menu、popover、tooltip、input、textarea、badge、command）
- 配色从保守的 slate 升级为 zinc（更现代、对比更舒适）
- 新增关键 shadcn 组件：`select`（替代原生 `<select>`）、`tabs`、`sheet`（替代简陋侧边抽屉）、`avatar`、`skeleton`（加载骨架屏）、`table`、`toggle`、`switch`
- 重新设计 Button variants 使用 shadcn 默认风格（default/destructive/outline/secondary/ghost/link）
- 所有现有页面对齐到 shadcn 组件 API

## Impact
- Affected specs: 激进 UI/UX 架构重写（基于其架构，升级视觉层）
- Affected code: `components/tailwind/ui/*`（替换或升级）、`tailwind.config.ts`、`styles/globals.css`、`components.json`、所有使用 UI 组件的页面

## ADDED Requirements
### Requirement: 官方 shadcn 组件替换手写版本
系统 SHALL 用 `npx shadcn@latest add` 添加官方组件，替换现有的手写版本。

#### Scenario: 组件来源一致性
- **WHEN** 开发者需要 Button、Card、Dialog 等组件
- **THEN** 应使用 shadcn 官方生成的组件文件
- **AND** 不再维护手工搭建的版本

### Requirement: 配色升级为 zinc
系统 SHALL 将 shadcn 的 `baseColor` 从 `slate` 切换为 `zinc`。

#### Scenario: zinc 配色生效
- **WHEN** 页面渲染
- **THEN** 背景、边框、文本应采用 zinc 色系而非 slate
- **AND** 深浅色主题下 zinc 色系对比更柔和舒适

### Requirement: 新增关键组件
系统 SHALL 通过 shadcn CLI 添加以下新组件：`select`、`tabs`、`sheet`、`avatar`、`skeleton`、`table`、`toggle`、`switch`。

#### Scenario: 原生 select 替换
- **WHEN** 页面中有下拉选择（如创建文档的项目选择）
- **THEN** 应使用 shadcn `<Select>` 组件替代原生 `<select>`

#### Scenario: 侧边面板使用 Sheet
- **WHEN** 移动端打开菜单或面板
- **THEN** 应使用 shadcn `<Sheet>` 组件获得流畅的抽屉动画

#### Scenario: 加载态使用 Skeleton
- **WHEN** 页面内容在加载中
- **THEN** 应使用 shadcn `<Skeleton>` 替代简单的 `<Loader>` spinner

## MODIFIED Requirements
### Requirement: 现有 Button/Card/Dialog 等组件
系统 SHALL 将现有的手写组件文件替换为 `npx shadcn@latest add` 生成的官方文件，同时保持所有现有的 `useI18n().t()` 调用不变。

### Requirement: 现有 tailwind.config.ts 和 globals.css
系统 SHALL 在切换为 zinc 配色后，保留项目中自定义的 `--radius-panel`、`--shadow-*`、间距系统等个性化设计令牌，仅替换颜色相关的 CSS 变量和 Tailwind 颜色映射。

## REMOVED Requirements
无需移除。
