# MathSpace UI 优化方案 - 产品需求文档

## Overview

- **Summary**: 将现有 MathSpace 项目的 UI 从多巴胺色系圆角卡片风格改造为瑞士主义（Neo-Swiss）极简学术风格，强调清晰的网格线、红点指示器和学术式排版。
- **Purpose**: 通过采用瑞士主义设计原则，提升知识管理系统的专业性和可读性，减少视觉噪音，为用户创造更专注的学术写作和思考环境。
- **Target Users**: 学术研究者、知识工作者、数学爱好者等需要深度思考和写作的用户群体。

## Goals

- 实现瑞士主义设计系统，替换原有的多巴胺色系
- 引入三种专业字体（Newsreader、Space\_Grotesk、JetBrains\_Mono）
- 重构侧边栏为严谨的数字目录结构
- 将看板视图改为学术目录样式
- 整合反向链接面板为认知上下文面板

## Non-Goals (Out of Scope)

- 不修改核心业务逻辑和数据结构
- 不添加新的功能模块
- 不改变项目的架构设计
- 不涉及后端 API 变更

## Background & Context

- 当前项目采用的是 MathSpace 品牌色系（蓝紫色调），带有圆角卡片和阴影效果
- 用户反馈希望获得更专业、更简洁的学术风格界面
- 参考瑞士主义设计原则：极简、对齐、网格、留白

## Functional Requirements

- **FR-1**: 更新字体配置，引入三种 Google Fonts 字体（Newsreader、Space\_Grotesk、JetBrains\_Mono）
- **FR-2**: 配置根布局，注入字体 CSS 变量到 HTML 标签
- **FR-3**: 定义瑞士主义 CSS 变量（珍珠白背景、墨黑文字、瑞士红点、极细网格线）
- **FR-4**: 配置 Tailwind theme，映射新的颜色和字体变量
- **FR-5**: 重写 PlaneLayout 侧边栏为数字目录结构，添加瑞士红点指示器
- **FR-6**: 重组 KnowledgeBaseLayout，保留极简路径树
- **FR-7**: 重构 KanbanView 为学术目录样式（横向轴账本）
- **FR-8**: 更新 BacklinksPanel，整合拓扑结构和认知上下文模块

## Non-Functional Requirements

- **NFR-1**: 所有圆角强制设为 0，遵循 Neo-Swiss 构图原则
- **NFR-2**: 使用 CSS 变量定义所有设计 token，确保主题一致性
- **NFR-3**: 保留渐进式信息呈现（hover 时显示额外信息）
- **NFR-4**: 阅读区域宽度限制为 850px（黄金阅读比例）

## Constraints

- **Technical**: Next.js 框架、Tailwind CSS 3、React 18
- **Dependencies**: next/font/google 用于字体加载
- **Timeline**: 单次迭代完成所有 UI 改造

## Assumptions

- 项目已正确配置 next/font 支持
- Tailwind CSS 插件（@tailwindcss/typography）已安装
- 所有依赖包版本兼容

## Acceptance Criteria

### AC-1: 字体配置更新完成

- **Given**: 项目启动时
- **When**: 访问任意页面
- **Then**: 三种字体（Newsreader、Space\_Grotesk、JetBrains\_Mono）正确加载并应用
- **Verification**: `human-judgment`
- **Notes**: 通过浏览器开发者工具检查字体是否加载

### AC-2: 瑞士主义设计变量生效

- **Given**: 项目启动时
- **When**: 检查页面样式
- **Then**: 背景色为 #FAF9F6（珍珠白），文字为 #111111（墨黑），红点为 #E32636（瑞士红）
- **Verification**: `programmatic`
- **Notes**: 可通过 CSS 变量检测验证

### AC-3: 侧边栏数字目录结构

- **Given**: 用户打开知识底座页面
- **When**: 查看左侧导航栏
- **Then**: 导航项显示数字序号（01、02、03），当前激活项显示红点指示器
- **Verification**: `human-judgment`

### AC-4: 看板视图学术样式

- **Given**: 用户浏览项目看板
- **When**: 查看文档列表
- **Then**: 文档以学术目录形式展示，包含序号、标题、悬浮信息
- **Verification**: `human-judgment`

### AC-5: 反向链接面板认知上下文

- **Given**: 用户打开文档详情
- **When**: 查看右侧面板
- **Then**: 显示拓扑结构、框架基础、反向关联三个模块
- **Verification**: `human-judgment`

### AC-6: 全局无边框设计

- **Given**: 任意页面
- **When**: 检查所有组件
- **Then**: 所有元素边框为极细网格线（#EAEAEA），无圆角
- **Verification**: `human-judgment`

## Open Questions

- [x] 是否需要保留深色模式支持？**需要**
  - 解决方案：在 CSS 变量中添加深色模式对应的变量，通过 Tailwind 的 darkMode 类切换实现
- [x] 是否需要考虑移动端特殊适配？**需要**
  - 解决方案：保留现有的响应式设计，确保侧边栏在小屏幕上可折叠，使用 Sheet 组件实现移动端菜单

