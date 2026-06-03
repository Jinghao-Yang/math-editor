const fs = require("fs");
const path = "lib/i18n/dictionaries.ts";
let content = fs.readFileSync(path, "utf8");

const fixes = [
  // common section
  ['"\\\\u7b80\\\\u4f53\\\\u4e2d\\\\ufffd\\\\u003f,', '"简体中文",'],
  ['"\\\\u5207\\\\u6362\\\\u5230\\\\u6d45\\\\u8272\\\\u6a21\\\\ufffd\\\\u003f,', '"切换到浅色模式",'],
  ['"\\\\u5207\\\\u6362\\\\u5230\\\\u6df1\\\\u8272\\\\u6a21\\\\ufffd\\\\u003f,', '"切换到深色模式",'],
  ['"\\\\u672a\\\\u547d\\\\u540d\\\\u9879\\\\ufffd\\\\u003f,', '"未命名项目",'],
  ['"\\\\u672a\\\\u547d\\\\u540d\\\\u6587\\\\ufffd\\\\u003f,', '"未命名文档",'],
  ['"\\\\u65e0\\\\u9879\\\\ufffd\\\\u003f,', '"无项目",'],
  // home section
  ['"\\\\u6253\\\\u5f00\\\\u5de5\\\\u4f5c\\\\ufffd\\\\u003f,', '"打开工作台",'],
  ['"\\\\u5de5\\\\u4f5c\\\\u53f0\\\\u4f18\\\\u5148\\\\u9996\\\\ufffd\\\\u003f,', '"工作台优先首页",'],
  ['"\\\\u4ece\\\\u4e00\\\\u4e2a\\\\u73b0\\\\u4ee3\\\\u5316\\\\u5de5\\\\u4f5c\\\\u53f0\\\\u5f00\\\\u59cb\\\\uff0c\\\\u5728\\\\u4e0d\\\\u6253\\\\u65ad\\\\u4e0a\\\\u4e0b\\\\u6587\\\\u7684\\\\u60c5\\\\u51b5\\\\u4e0b\\\\u6d4f\\\\u89c8\\\\u5e76\\\\u7f16\\\\u8f91\\\\u5185\\\\u5bb9\\\\ufffd\\\\u003f,', '"从一个现代化工作台开始，在不打断上下文的情况下浏览并编辑内容。",'],
  ['"首页现在是一个聚焦的入口。主要操作会进入统一的知识库工作台，让导航、文档浏览和编辑始终保持在同一条工作流中\\\\ufffd\\\\u003f,', '"首页现在是一个聚焦的入口。主要操作会进入统一的知识库工作台，让导航、文档浏览和编辑始终保持在同一条工作流中。",'],
  ['"\\\\u8fdb\\\\u5165\\\\u5de5\\\\u4f5c\\\\ufffd\\\\u003f,', '"进入工作台",'],
  ['"\\\\u4e3b\\\\u8def\\\\ufffd\\\\u003f,', '"主路径",'],
  ['"首页直接引导进入工作台，而不是打开一个独立的编辑页\\\\ufffd\\\\u003f,', '"首页直接引导进入工作台，而不是打开一个独立的编辑页面。",'],
  ['"如果你想直接查看内容，文档列表仍然可以一键到达\\\\ufffd\\\\u003f,', '"如果你想直接查看内容，文档列表仍然可以一键到达。",'],
  ['"主题切换仍然可见，但状态类信息不再抢占首页主入口的注意力\\\\ufffd\\\\u003f,', '"主题切换仍然可见，但状态类信息不再抢占首页主入口的注意力。",'],
  ['"\\\\u5de5\\\\u4f5c\\\\u53f0\\\\u6982\\\\ufffd\\\\u003f,', '"工作台概览",'],
  ['"从一个位置继续当前工作的全部核心入口\\\\ufffd\\\\u003f,', '"从一个位置继续当前工作的全部核心入口。",'],
  ['"\\\\u7edf\\\\u4e00\\\\u5de5\\\\u4f5c\\\\ufffd\\\\u003f,', '"统一工作台",'],
  ['"项目、文档、周期和模块都保持在同一个导航框架中\\\\ufffd\\\\u003f,', '"项目、文档、周期和模块都保持在同一个导航框架中。",'],
  ['"文档编辑发生在知识库工作台上下文内，不再割裂\\\\ufffd\\\\u003f,', '"文档编辑发生在知识库工作台上下文内，不再割裂。",'],
  ['"搜索和后续动作仍然易于发现，同时不会给首页增加噪音\\\\ufffd\\\\u003f,', '"搜索和后续动作仍然易于发现，同时不会给首页增加噪音。",'],
  ['"\\\\u63a8\\\\u8350\\\\u4e0b\\\\u4e00\\\\ufffd\\\\u003f,', '"推荐下一步",'],
  ['"将工作台作为默认的浏览与编辑上下文\\\\ufffd\\\\u003f,', '"将工作台作为默认的浏览与编辑上下文。",'],
  ['"在同一个工作台框架内直接进入文档列表\\\\ufffd\\\\u003f,', '"在同一个工作台框架内直接进入文档列表。",'],
  ['"\\\\u5feb\\\\u901f\\\\u5165\\\\ufffd\\\\u003f,', '"快速入口",'],
  ['"从同一个起点进入项目、文档与搜索，操作层级更清晰\\\\ufffd\\\\u003f,', '"从同一个起点进入项目、文档与搜索，操作层级更清晰。",'],
  ['"\\\\u4f4e\\\\u566a\\\\u97f3\\\\u53cd\\\\ufffd\\\\u003f,', '"低噪音反馈",'],
  ['"主题控制与状态提示仍然存在，但不会再与主操作入口争抢注意力\\\\ufffd\\\\u003f,', '"主题控制与状态提示仍然存在，但不会再与主操作入口争抢注意力。",'],
  // knowledgeBase section
  ['"\\\\u77e5\\\\u8bc6\\\\ufffd\\\\u003f,', '"知识库",'],
  ['"\\\\u6587\\\\u6863\\\\u7f16\\\\u8f91\\\\ufffd\\\\u003f,', '"文档编辑区",'],
  ['"选中文档后，编辑器会在此处以全宽视图展开\\\\ufffd\\\\u003f,', '"选中文档后，编辑器会在此处以全宽视图展开。",'],
];

let fixedCount = 0;
for (const [corrupted, correct] of fixes) {
  const regex = new RegExp(corrupted, "g");
  if (regex.test(content)) {
    content = content.replace(regex, correct);
    fixedCount++;
  }
}
console.log("Fixed patterns: " + fixedCount);

// Also fix remaining unknown corrupt patterns systematically
// Pattern: any CJK character followed by \uFFFD? instead of the proper ending
// We know the common endings: 式", 目", 档", 台", 页", 中", 。" etc.
// For now, fix the ones we know about

// Fix "editingDocument" in zhCN - already knows the correct content
if (!content.includes('editingDocument: "编辑文档",')) {
  content = content.replace(
    'editorAreaLabel: "文档编辑区",\n    emptyEditorTitle:',
    'editorAreaLabel: "文档编辑区",\n    editingDocument: "编辑文档",\n    emptyEditorTitle:'
  );
}

fs.writeFileSync(path, content, "utf8");
console.log("Done - total fixes applied");
