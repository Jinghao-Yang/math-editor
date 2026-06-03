# Tasks

- [x] Task 1: 切换配色为 zinc 并添加 shadcn 官方组件
  - [x] 修改 `components.json` 将 `baseColor` 从 `slate` 改为 `zinc`
  - [x] 更新 `globals.css` 中的颜色 CSS 变量为 zinc 色系
  - [x] 更新 `tailwind.config.ts` 中颜色映射
  - [x] 写入 shadcn 官方组件：button、card、dialog、dropdown-menu、popover、tooltip、input、textarea、badge、command、separator、label、scroll-area
  - [x] 写入新组件：select、tabs、sheet、avatar、skeleton、table、toggle、switch

- [x] Task 2: 适配现有页面到 shadcn 组件
  - [x] 旧引用 `bg-panel` / `shadow-panel` → `bg-card` / shadcn 标准样式
  - [x] 将文档创建弹窗中的原生 `<select>` 替换为 shadcn `<Select>`
  - [x] 将 PlaneLayout 移动菜单替换为 shadcn `<Sheet>`

- [x] Task 3: 视觉一致性收尾
  - [x] 统一所有组件的圆角使用自定义 `--radius-panel/--radius-card/--radius-field`
  - [x] 确认深浅色主题下 zinc 色系层级分明
  - [x] 移除手写版本中与官方 shadcn 重复的代码

- [x] Task 4: 验证
  - [x] 运行 `pnpm typecheck` 通过
  - [x] 运行 `pnpm lint` 定向检查 19 个文件全部通过
  - [x] 确认所有 shadcn 组件交互正常、无样式断裂

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 2
- Task 4 depends on Task 3
