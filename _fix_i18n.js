const fs = require("fs");
const path = "lib/i18n/dictionaries.ts";
let content = fs.readFileSync(path, "utf8");
let changed = false;

function addAfter(line, newLine) {
  if (content.includes(newLine)) return;
  const pattern = line.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(pattern, 'g');
  if (re.test(content)) {
    content = content.replace(re, line + "\n" + newLine);
    changed = true;
    console.log("Added: " + newLine);
  } else {
    console.log("NOT FOUND: " + line);
  }
}

// Type schema
addAfter("    backToHome: string;", "    backToList: string;");
addAfter("    editorAreaLabel: string;", "    editingDocument: string;");

// en translations (use narrow match)
addAfter('    backToHome: "Back to Home",', '    backToList: "\u2190 Back to list",');
addAfter('    editorAreaLabel: "Document editor",', '    editingDocument: "Editing document",');

// zhCN translations
addAfter('    backToHome: "\u8FD4\u56DE\u9996\u9875",', '    backToList: "\u2190 \u8FD4\u56DE\u5217\u8868",');
addAfter('    editorAreaLabel: "\u6587\u6863\u7F16\u8F91\u533A",', '    editingDocument: "\u7F16\u8F91\u6587\u6863",');

if (changed) {
  fs.writeFileSync(path, content);
  console.log("File updated successfully");
} else {
  console.log("No changes needed");
}
