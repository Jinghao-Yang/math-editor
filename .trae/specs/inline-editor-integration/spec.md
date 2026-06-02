# Inline Editor Integration - Product Requirement Document

## Overview

* **Summary**: 将编辑器直接集成到 knowledge-base 页面中，点击文档卡片后直接在页面内展开编辑器，提供无缝的编辑体验

* **Purpose**: 提升用户体验，避免页面跳转，让文档管理和编辑在同一个界面中完成

* **Target Users**: Math Editor 知识管理系统的用户

## Goals

* 点击文档卡片直接在 knowledge-base 页面展开编辑器

* 提供类似 Notion 的内联编辑体验

* 支持文档列表和编辑器的快速切换

* 保持现有的所有功能（搜索、视图切换、文档管理等）

## Non-Goals (Out of Scope)

* 完全重写编辑器组件

* 移除跳转到单独编辑器页面的功能（保留作为备选）

* 重构数据库结构

## Background & Context

* 当前文档卡片链接跳转到 `/` 页面打开编辑器

* 用户希望更流畅的编辑体验，类似 Notion 或 Outline

* 编辑器组件已经存在且功能完善

* 页面布局使用 PlaneLayout

## Functional Requirements

* **FR-1**: 点击文档卡片后在同一页面展开编辑器面板

* **FR-2**: 编辑器面板与文档列表可以共存（双栏布局）

* **FR-3**: 支持返回按钮回到文档列表视图

* **FR-4**: 保持编辑器的所有功能（数学公式、Markdown、同步等）

* **FR-5**: 点击编辑器外部区域或文档外区域返回列表视图

## Non-Functional Requirements

* **NFR-1**: 编辑器打开/关闭动画流畅（<300ms）

* **NFR-2**: 编辑器状态保存正常

* **NFR-3**: 响应式设计，在移动设备也能正常工作

## Constraints

* **Technical**: Next.js 16, React 19, 现有 Tiptap 编辑器组件

* **Dependencies**: 依赖现有的编辑器组件和数据存储系统

## Assumptions

* 编辑器组件可以作为子组件独立嵌入

* 文档数据获取已经实现

* URL 参数传递文档 ID 的方式保持有效

## Acceptance Criteria

### AC-1: 点击文档卡片展开编辑器

* **Given**: 用户在 knowledge-base 页面查看文档列表

* **When**: 用户点击任意文档卡片

* **Then**: 编辑器面板在页面右侧或中心展开，显示该文档内容

* **Verification**: `human-judgment`

* **Notes**: 验证交互流畅度和视觉效果

### AC-2: 编辑功能完全可用

* **Given**: 编辑器已经展开

* **When**: 用户进行编辑操作（输入、插入公式等）

* **Then**: 所有编辑器功能正常，文档自动保存

* **Verification**: `human-judgment`

* **Notes**: 验证所有编辑器工具栏功能

### AC-3: 可以返回列表视图

* **Given**: 编辑器面板已打开

* **When**: 用户点击返回按钮或左上角文档树

* **Then**: 编辑器关闭，显示文档列表视图

* **Verification**: `human-judgment`

### AC-4: 创建新文档直接进入编辑

* **Given**: 用户点击 "New Document" 按钮

* **When**: 创建新文档成功

* **Then**: 直接打开编辑器编辑新文档

* **Verification**: `human-judgment`

### AC-5: 双栏布局响应式

* **Given**: 在不同屏幕尺寸设备上

* **When**: 打开编辑器

* **Then**: 在宽屏显示双栏（列表+编辑器），在窄屏全屏显示编辑器

* **Verification**: `human-judgment`

## Open Questions

* [ ] 是否完全移除单独编辑器页面还是保留作为备选？

  移除

* [ ] 在窄屏设备上是否需要特殊的处理逻辑？

  需要

