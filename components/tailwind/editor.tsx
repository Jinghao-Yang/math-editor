"use client";
import { defaultEditorContent } from "@/lib/content";
import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  type EditorInstance,
  EditorRoot,
  ImageResizer,
  type JSONContent,
  handleCommandNavigation,
  handleImageDrop,
  handleImagePaste,
} from "@/lib/editor-core";
import { EditorContext } from "@tiptap/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { defaultExtensions } from "./extensions";
import { ColorSelector } from "./selectors/color-selector";
import { LinkSelector } from "./selectors/link-selector";
import { MathSelector } from "./selectors/math-selector";
import { NodeSelector } from "./selectors/node-selector";
import { Separator } from "./ui/separator";

import GenerativeMenuSwitch from "./generative/generative-menu-switch";
import { uploadFn } from "./image-upload";
import { TextButtons } from "./selectors/text-buttons";
import { Toolbar } from "./toolbar";
import { slashCommand, suggestionItems } from "./slash-command";

import { syncQueue } from "@/lib/sync/queue";
import { syncManager } from "@/lib/sync/manager";
import { 
  createDocument, 
  updateDocumentSyncStatus, 
  getDocumentById, 
  updateDocumentContent 
} from "@/lib/store/db";
import { DocumentAssociation } from "@/components/project";
import { Loader, Check, AlertCircle, CloudUpload } from "lucide-react";
import { cn } from "@/lib/utils";

const extensions = [...defaultExtensions, slashCommand];

type SyncStatusUI = "idle" | "syncing" | "success" | "error";

// 按文档 ID 获取/设置 localStorage 键名
function getDocStorageKey(docId: string, type: "content" | "html" | "markdown") {
  return `doc_${docId}_${type}`;
}

interface EditorProps {
  documentId?: string;
}

const Editor = ({ documentId: propDocId }: EditorProps) => {
  const [initialContent, setInitialContent] = useState<null | JSONContent>(null);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [charsCount, setCharsCount] = useState();
  const [editor, setEditor] = useState<EditorInstance | null>(null);
  const searchParams = typeof window !== "undefined" && "useSearchParams" in require("next/navigation") ? useSearchParams() : { get: () => null };

  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  const [syncStatus, setSyncStatus] = useState<SyncStatusUI>("idle");
  const [outlineDocId, setOutlineDocId] = useState<string | null>(null);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [documentId] = useState<string>(() => {
    if (propDocId) {
      return propDocId;
    }
    const docParam = typeof searchParams.get === "function" ? searchParams.get("doc") : null;
    return docParam || `doc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  });
  const [key, setKey] = useState(0); // 用于强制重新渲染编辑器

  useEffect(() => {
    const savedDocId = window.localStorage.getItem("outline-doc-id");
    if (savedDocId) {
      setOutlineDocId(savedDocId);
    }
    const savedProjectId = window.localStorage.getItem("current-project-id");
    if (savedProjectId) {
      setCurrentProjectId(savedProjectId);
    }
  }, []);

  // 当 propDocId 变化时，更新当前文档 ID
  useEffect(() => {
    if (propDocId) {
      setKey(k => k + 1); // 强制重新渲染
    }
  }, [propDocId]);

  // 当文档 ID 变更时，加载对应内容
  useEffect(() => {
    // 先尝试从数据库加载
    try {
      const docFromDB = getDocumentById(documentId);
      if (docFromDB && docFromDB["document/content"]) {
        const content = docFromDB["document/content"] as string;
        try {
          setInitialContent(JSON.parse(content));
          return;
        } catch {
          // JSON 解析失败，继续使用 localStorage
        }
      }
    } catch {
      // 数据库读取失败，使用 localStorage
    }

    // 从 localStorage 按文档 ID 加载
    const content = window.localStorage.getItem(getDocStorageKey(documentId, "content"));
    if (content) {
      try {
        setInitialContent(JSON.parse(content));
        return;
      } catch {
        // 解析失败
      }
    }

    setInitialContent(defaultEditorContent);
  }, [documentId]);

  const performSync = async (editorInstance: EditorInstance) => {
    const json = editorInstance.getJSON();
    const markdown = editorInstance.storage.markdown.getMarkdown();
    const title = (json.content?.[0] as { content?: { text?: string }[] })?.content?.[0]?.text || "Untitled";

    setSyncStatus("syncing");

    syncQueue.add({
      id: `sync_${documentId}_${Date.now()}`,
      type: outlineDocId ? "update" : "create",
      payload: {
        documentId,
        title,
        markdown,
        outlineDocId,
      },
    });

    try {
      await syncManager.sync();

      const pending = syncQueue.getPending();
      const failed = syncQueue.getFailed();
      const hasCurrentDocFailed = failed.some(
        (item) => item.payload.documentId === documentId
      );

      if (pending.length === 0 && !hasCurrentDocFailed) {
        setSyncStatus("success");
        setTimeout(() => {
          setSyncStatus("idle");
        }, 2000);
      } else if (hasCurrentDocFailed) {
        setSyncStatus("error");
        updateDocumentSyncStatus(documentId, "failed");
      }
    } catch {
      setSyncStatus("error");
      updateDocumentSyncStatus(documentId, "failed");
    }
  };

  const debouncedUpdates = useDebouncedCallback(async (editorInstance: EditorInstance) => {
    const json = editorInstance.getJSON();
    const html = editorInstance.getHTML();
    const markdown = editorInstance.storage.markdown.getMarkdown();
    const jsonStr = JSON.stringify(json);

    setCharsCount(editorInstance.storage.characterCount.words());
    
    // 按文档 ID 分别保存到 localStorage
    window.localStorage.setItem(getDocStorageKey(documentId, "html"), html);
    window.localStorage.setItem(getDocStorageKey(documentId, "content"), jsonStr);
    window.localStorage.setItem(getDocStorageKey(documentId, "markdown"), markdown);
    
    // 保存到数据库
    try {
      updateDocumentContent(documentId, jsonStr, markdown, html);
    } catch {
      // 数据库保存失败也没关系，localStorage 已保存
    }
    
    setSaveStatus("Saved");

    await performSync(editorInstance);
  }, 500);

  const handleRetrySync = () => {
    if (editor) {
      syncManager.sync();
      performSync(editor);
    }
  };

  if (!initialContent) return null;

  const renderSyncIcon = () => {
    switch (syncStatus) {
      case "syncing":
        return <Loader className="h-3.5 w-3.5 animate-spin text-muted-foreground" />;
      case "success":
        return <Check className="h-3.5 w-3.5 text-green-500" />;
      case "error":
        return (
          <button onClick={handleRetrySync} className="flex items-center gap-1 text-red-500 hover:text-red-600">
            <AlertCircle className="h-3.5 w-3.5" />
          </button>
        );
      case "idle":
      default:
        return <CloudUpload className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  return (
    <div className="relative w-full max-w-screen-lg">
      <div className="flex absolute right-5 top-5 z-10 mb-5 gap-2">
        <div className="rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground">{saveStatus}</div>
        <div className={cn("rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground flex items-center gap-1.5", syncStatus === "error" && "bg-red-50 dark:bg-red-950")}>
          {renderSyncIcon()}
          <span className="text-xs capitalize">{syncStatus}</span>
        </div>
        <div className={charsCount ? "rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground" : "hidden"}>
          {charsCount} Words
        </div>
      </div>
      <EditorRoot>
        <EditorContext.Provider value={{ editor }}>
          <div className="sticky top-0 z-40 mb-2 w-full">
            <Toolbar />
            <div className="mt-2 flex items-center gap-2">
              <DocumentAssociation
                documentId={documentId}
                onAssociationChange={() => {
                  const results = JSON.parse(window.localStorage.getItem(getDocStorageKey(documentId, "content")) || "{}");
                  const title = (results.content?.[0] as { content?: { text?: string }[] })?.content?.[0]?.text || "Untitled";
                  const html = window.localStorage.getItem(getDocStorageKey(documentId, "html")) || "";
                  const markdown = window.localStorage.getItem(getDocStorageKey(documentId, "markdown")) || "";
                  const content = window.localStorage.getItem(getDocStorageKey(documentId, "content")) || "";
                  
                  createDocument({
                    id: documentId,
                    title,
                    outlineId: outlineDocId || undefined,
                    syncStatus: outlineDocId ? "synced" : "unsynced",
                    content,
                    markdown,
                    html,
                  });
                }}
              />
            </div>
          </div>
          <EditorContent
            key={key}
            initialContent={initialContent}
            extensions={extensions}
            className="relative min-h-[500px] w-full max-w-screen-lg border-muted bg-background sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg"
            editorProps={{
              handleDOMEvents: {
                keydown: (_view, event) => handleCommandNavigation(event),
              },
              handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
              handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, uploadFn),
              attributes: {
                class:
                  "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full",
              },
            }}
            onCreate={({ editor }) => {
              setEditor(editor);
            }}
            onUpdate={({ editor }) => {
              debouncedUpdates(editor);
              setSaveStatus("Unsaved");
            }}
            slotAfter={<ImageResizer />}
          >
            <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
              <EditorCommandEmpty className="px-2 text-muted-foreground">No results</EditorCommandEmpty>
              <EditorCommandList>
                {suggestionItems.map((item) => (
                  <EditorCommandItem
                    value={item.title}
                    onCommand={(val) => item.command(val)}
                    className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                    key={item.title}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </EditorCommandItem>
                ))}
              </EditorCommandList>
            </EditorCommand>

            <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
              <Separator orientation="vertical" />
              <NodeSelector open={openNode} onOpenChange={setOpenNode} />
              <Separator orientation="vertical" />

              <LinkSelector open={openLink} onOpenChange={setOpenLink} />
              <Separator orientation="vertical" />
              <MathSelector />
              <Separator orientation="vertical" />
              <TextButtons />
              <Separator orientation="vertical" />
              <ColorSelector open={openColor} onOpenChange={setOpenColor} />
            </GenerativeMenuSwitch>
          </EditorContent>
        </EditorContext.Provider>
      </EditorRoot>
    </div>
  );
};

export default Editor;
