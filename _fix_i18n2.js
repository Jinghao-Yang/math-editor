const fs = require("fs");
const path = "lib/i18n/dictionaries.ts";
let content = fs.readFileSync(path, "utf8");

// Fix corrupted zhCN lines (replace "?" placeholders with correct characters)
content = content.replace(
  '    highlightEditor: "文档编辑发生在知识库工作台上下文内，不再割裂\uFFFD,',
  '    highlightEditor: "文档编辑发生在知识库工作台上下文内，不再割裂。",'
);

content = content.replace(
  '    editorAreaLabel: "文档编辑\uFFFD,',
  '    editorAreaLabel: "文档编辑区",'
);

content = content.replace(
  '      "在左侧选择文档后，编辑器会直接在这里展开，让你继续保持对当前页面与知识库结构的感知\uFFFD,',
  '      "在左侧选择文档后，编辑器会直接在这里展开，让你继续保持对当前页面与知识库结构的感知。",'
);

// Add editingDocument to zhCN
if (!content.includes('    editingDocument: "编辑文档",')) {
  content = content.replace(
    '    editorAreaLabel: "文档编辑区",\n    emptyEditorTitle:',
    '    editorAreaLabel: "文档编辑区",\n    editingDocument: "编辑文档",\n    emptyEditorTitle:'
  );
}

fs.writeFileSync(path, content, "utf8");
console.log("Fixed");
