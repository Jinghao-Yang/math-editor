# Inline Editor Integration - The Implementation Plan (Decomposed and Prioritized Task List)

## [ ] Task 1: 重构 Editor 组件，支持传入 documentId
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 修改 Editor 组件，使其接受 documentId 作为 props 而不是从 searchParams 获取
  - 保持现有的 localStorage 和数据库存储逻辑
  - 确保组件独立可复用
- **Acceptance Criteria Addressed**: [AC-1, AC-2]
- **Test Requirements**:
  - `programmatic` TR-1.1: Editor 组件接受 documentId 参数
  - `human-judgement` TR-1.2: 组件在被嵌入时正常工作
- **Notes**: 需要将 useSearchParams 的调用提取出来，让父组件传递 documentId

## [ ] Task 2: 创建双栏布局组件
- **Priority**: P0
- **Depends On**: [Task 1]
- **Description**: 
  - 创建一个包含文档列表和编辑器的双栏布局组件
  - 左侧显示文档列表，右侧显示编辑器
  - 响应式设计：在窄屏只显示编辑器
- **Acceptance Criteria Addressed**: [AC-1, AC-2, AC-5]
- **Test Requirements**:
  - `programmatic` TR-2.1: 双栏布局正确渲染
  - `human-judgement` TR-2.2: 响应式行为正确
  - `human-judgement` TR-2.3: 布局视觉美观

## [ ] Task 3: 实现文档选择和打开逻辑
- **Priority**: P0
- **Depends On**: [Task 1, Task 2]
- **Description**: 
  - 添加当前选中文档的状态管理
  - 修改文档卡片点击事件，不再跳转到 `/` 页面
  - 实现编辑器的打开/关闭逻辑
- **Acceptance Criteria Addressed**: [AC-1, AC-3]
- **Test Requirements**:
  - `human-judgement` TR-3.1: 点击文档卡片打开编辑器
  - `human-judgement` TR-3.2: 编辑器内容与文档匹配

## [ ] Task 4: 添加返回按钮和导航逻辑
- **Priority**: P0
- **Depends On**: [Task 1, Task 2, Task 3]
- **Description**: 
  - 在编辑器顶部添加返回按钮
  - 返回按钮关闭编辑器并显示文档列表
  - 保持侧边栏菜单可以导航
- **Acceptance Criteria Addressed**: [AC-3]
- **Test Requirements**:
  - `human-judgement` TR-4.1: 返回按钮正常工作
  - `human-judgement` TR-4.2: 导航菜单仍然可用

## [ ] Task 5: 修改文档创建逻辑
- **Priority**: P1
- **Depends On**: [Task 1, Task 2, Task 3]
- **Description**: 
  - 修改 "New Document" 按钮的点击逻辑
  - 创建新文档后直接打开编辑器
  - 不需要跳转到单独页面
- **Acceptance Criteria Addressed**: [AC-4]
- **Test Requirements**:
  - `human-judgement` TR-5.1: 新建文档直接进入编辑模式
  - `human-judgement` TR-5.2: 新文档正确保存

## [ ] Task 6: 集成到主 knowledge-base 页面
- **Priority**: P0
- **Depends On**: [Task 1, Task 2, Task 3, Task 4, Task 5]
- **Description**: 
  - 更新 knowledge-base 页面组件
  - 将所有视图组件（KanbanView, CalendarView）集成到新的布局中
  - 保持现有的视图切换功能
- **Acceptance Criteria Addressed**: [AC-1, AC-2, AC-3, AC-4, AC-5]
- **Test Requirements**:
  - `programmatic` TR-6.1: 页面成功编译和渲染
  - `human-judgement` TR-6.2: 所有视图模式正常工作
  - `human-judgement` TR-6.3: 所有功能完整且流畅

## [ ] Task 7: 优化动画和交互体验
- **Priority**: P2
- **Depends On**: [Task 1, Task 2, Task 3, Task 4, Task 5, Task 6]
- **Description**: 
  - 添加编辑器打开/关闭的流畅动画
  - 优化点击体验
  - 确保过渡自然
- **Acceptance Criteria Addressed**: [AC-1, AC-5]
- **Test Requirements**:
  - `human-judgement` TR-7.1: 动画流畅自然
  - `human-judgement` TR-7.2: 用户体验优秀
