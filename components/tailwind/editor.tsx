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
import { useI18n } from "@/lib/i18n";
import { EditorContext } from "@tiptap/react";
import { useEffect, useMemo, useState } from "react";
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
import { getLocalizedSuggestionItems, setSuggestionItems, slashCommand } from "./slash-command";

import { syncQueue } from "@/lib/sync/queue";
import { syncManager } from "@/lib/sync/manager";
import { 
  createDocument, 
  updateDocumentSyncStatus, 
  getDocumentById, 
  updateDocumentContent 
} from "@/lib/store/db";
import { DocumentAssociation } from "@/components/project";
import { Button } from "@/components/tailwind/ui/button";
import { FeedbackState } from "@/components/tailwind/ui/feedback-state";
import { AlertCircle, Check, CloudUpload, FileText, History, Loader, RotateCcw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const extensions = [...defaultExtensions, slashCommand];

type SyncStatusUI = "idle" | "syncing" | "success" | "error";
type SaveStatusUI = "saved" | "unsaved";
type ContentSource = "database" | "local" | "default";

// 按文档 ID 获取/设置 localStorage 键名
function getDocStorageKey(docId: string, type: "content" | "html" | "markdown") {
  return `doc_${docId}_${type}`;
}

interface EditorProps {
  documentId?: string;
}

const Editor = ({ documentId: propDocId }: EditorProps) => {
  const { t } = useI18n();
  const [initialContent, setInitialContent] = useState<null | JSONContent>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatusUI>("saved");
  const [charsCount, setCharsCount] = useState(0);
  const [editor, setEditor] = useState<EditorInstance | null>(null);
  const [contentSource, setContentSource] = useState<ContentSource>("default");
  const [hasLocalDraft, setHasLocalDraft] = useState(false);
  const searchParams = useSearchParams();

  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  const [syncStatus, setSyncStatus] = useState<SyncStatusUI>("idle");
  const [outlineDocId, setOutlineDocId] = useState<string | null>(null);
  const [generatedDocumentId] = useState<string>(
    () => `doc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  );
  const documentId = useMemo(() => {
    return propDocId || searchParams.get("doc") || generatedDocumentId;
  }, [generatedDocumentId, propDocId, searchParams]);
  const suggestionItems = useMemo(() => getLocalizedSuggestionItems(t), [t]);
  const slashHint = t("editor.slashHint");
  const [slashHintPrefix, ...slashHintSuffixParts] = slashHint.split("/");
  const slashHintSuffix = slashHintSuffixParts.join("/");

  useEffect(() => {
    setSuggestionItems(suggestionItems);
  }, [suggestionItems]);

  useEffect(() => {
    const savedDocId = window.localStorage.getItem("outline-doc-id");
    if (savedDocId) {
      setOutlineDocId(savedDocId);
    }
  }, []);

  // 当文档 ID 变更时，加载对应内容
  useEffect(() => {
    setInitialContent(null);
    setCharsCount(0);
    setSaveStatus("saved");
    setContentSource("default");

    const localContent = window.localStorage.getItem(getDocStorageKey(documentId, "content"));
    setHasLocalDraft(Boolean(localContent));

    // 先尝试从数据库加载
    try {
      const docFromDB = getDocumentById(documentId);
      if (docFromDB?.["document/content"]) {
        const content = docFromDB["document/content"] as string;
        try {
          setInitialContent(JSON.parse(content));
          setContentSource("database");
          return;
        } catch {
          // JSON 解析失败，继续使用 localStorage
        }
      }
    } catch {
      // 数据库读取失败，使用 localStorage
    }

    // 从 localStorage 按文档 ID 加载
    if (localContent) {
      try {
        setInitialContent(JSON.parse(localContent));
        setContentSource("local");
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
    const title =
      (json.content?.[0] as { content?: { text?: string }[] })?.content?.[0]?.text ||
      t("editor.untitledDocument");

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

    setCharsCount(editorInstance.storage.characterCount.characters());
    
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
    
    setSaveStatus("saved");

    await performSync(editorInstance);
  }, 500);

  const handleRetrySync = () => {
    if (editor) {
      syncManager.sync();
      performSync(editor);
    }
  };

  const handleRestoreLocalDraft = () => {
    if (!editor) {
      return;
    }

    const content = window.localStorage.getItem(getDocStorageKey(documentId, "content"));
    if (!content) {
      return;
    }

    try {
      editor.commands.setContent(JSON.parse(content));
      editor.commands.focus("end");
      setContentSource("local");
      setCharsCount(editor.storage.characterCount.characters());
      setSaveStatus("saved");
    } catch {
      // 本地草稿损坏时保持当前内容不变
    }
  };

  if (!initialContent) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-[24px] border border-dashed border-border/60 bg-muted/20 p-6">
        <FeedbackState
          icon={<Loader className="h-5 w-5 animate-spin" />}
          title={t("editor.documentLoading.title")}
          description={t("editor.documentLoading.description")}
          tone="info"
        />
      </div>
    );
  }

  const isBlankDocument = charsCount === 0;

  const syncSummary = (() => {
    switch (syncStatus) {
      case "syncing":
        return {
          label: t("editor.syncStatus.syncingLabel"),
          description: t("editor.syncStatus.syncingDescription"),
          icon: <Loader className="h-3.5 w-3.5 animate-spin" />,
          className: "border-primary/20 bg-primary/5 text-primary",
        };
      case "success":
        return {
          label: t("editor.syncStatus.successLabel"),
          description: t("editor.syncStatus.successDescription"),
          icon: <Check className="h-3.5 w-3.5" />,
          className: "border-[hsl(var(--success)/0.24)] bg-[hsl(var(--success)/0.10)] text-[hsl(var(--success))]",
        };
      case "error":
        return {
          label: t("editor.syncStatus.errorLabel"),
          description: t("editor.syncStatus.errorDescription"),
          icon: <AlertCircle className="h-3.5 w-3.5" />,
          className: "border-[hsl(var(--destructive)/0.24)] bg-[hsl(var(--destructive)/0.10)] text-[hsl(var(--destructive))]",
        };
      default:
        return {
          label: t("editor.syncStatus.idleLabel"),
          description: t("editor.syncStatus.idleDescription"),
          icon: <CloudUpload className="h-3.5 w-3.5" />,
          className: "border-border/70 bg-muted/40 text-muted-foreground",
        };
    }
  })();

  const sourceSummary = {
    database: t("editor.contentSource.database"),
    local: t("editor.contentSource.local"),
    default: t("editor.contentSource.default"),
  } satisfies Record<ContentSource, string>;

  return (
    <div className="relative w-full max-w-screen-lg">
      <EditorRoot>
        <EditorContext.Provider value={{ editor }}>
          <div className="sticky top-0 z-40 mb-4 w-full space-y-3 bg-background/95 pb-2 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="rounded-[24px] border border-border/60 bg-card/95 p-3 shadow-subtle">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="overflow-x-auto scrollbar-thin">
                    <div className="min-w-max">
                      <Toolbar />
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 xl:max-w-[420px] xl:justify-end">
                  <div
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium",
                      saveStatus === "saved"
                        ? "border-border/70 bg-muted/35 text-muted-foreground"
                        : "border-[hsl(var(--warning)/0.32)] bg-[hsl(var(--warning)/0.12)] text-[hsl(var(--warning-foreground))]"
                    )}
                  >
                    <span>
                      {saveStatus === "saved"
                        ? t("editor.saveStatus.saved")
                        : t("editor.saveStatus.unsaved")}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium",
                      syncSummary.className
                    )}
                  >
                    {syncSummary.icon}
                    <span>{syncSummary.label}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/35 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                    <FileText className="h-3.5 w-3.5" />
                    <span>{t("editor.counts.characters", { count: charsCount })}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
                    <History className="h-3.5 w-3.5" />
                    <span>{sourceSummary[contentSource]}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <DocumentAssociation
                  documentId={documentId}
                  onAssociationChange={() => {
                    const results = JSON.parse(window.localStorage.getItem(getDocStorageKey(documentId, "content")) || "{}");
                    const title =
                      (results.content?.[0] as { content?: { text?: string }[] })?.content?.[0]?.text ||
                      t("editor.untitledDocument");
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
                <span className="text-xs text-muted-foreground">
                  {slashHintSuffixParts.length > 0 ? (
                    <>
                      {slashHintPrefix}
                      <span className="font-medium">/</span>
                      {slashHintSuffix}
                    </>
                  ) : (
                    slashHint
                  )}
                </span>
              </div>

              <div className="mt-3 space-y-2">
                {syncStatus === "error" ? (
                  <FeedbackState
                    compact
                    icon={<AlertCircle className="h-4 w-4" />}
                    title={t("editor.feedback.syncIncompleteTitle")}
                    description={syncSummary.description}
                    tone="error"
                    action={
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1.5 rounded-lg px-3 text-xs"
                          onClick={handleRetrySync}
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          {t("editor.feedback.retrySync")}
                        </Button>
                        {hasLocalDraft ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1.5 rounded-lg px-3 text-xs"
                            onClick={handleRestoreLocalDraft}
                          >
                            <History className="h-3.5 w-3.5" />
                            {t("editor.feedback.restoreDraft")}
                          </Button>
                        ) : null}
                      </>
                    }
                  />
                ) : null}

                {hasLocalDraft && contentSource !== "local" ? (
                  <FeedbackState
                    compact
                    icon={<History className="h-4 w-4" />}
                    title={t("editor.feedback.localDraftTitle")}
                    description={t("editor.feedback.localDraftDescription")}
                    tone="warning"
                    action={
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 rounded-lg px-3 text-xs"
                        onClick={handleRestoreLocalDraft}
                      >
                        <History className="h-3.5 w-3.5" />
                        {t("editor.feedback.restoreFromLocal")}
                      </Button>
                    }
                  />
                ) : null}

                {isBlankDocument ? (
                  <FeedbackState
                    compact
                    icon={<Sparkles className="h-4 w-4" />}
                    title={t("editor.feedback.blankDocumentTitle")}
                    description={t("editor.feedback.blankDocumentDescription")}
                    tone="neutral"
                  />
                ) : null}
              </div>
            </div>
          </div>
          <EditorContent
            key={documentId}
            initialContent={initialContent}
            extensions={extensions}
            className="relative min-h-[600px] w-full border-muted bg-background p-4 transition-all duration-300 sm:mb-[calc(20vh)] sm:rounded-[24px] sm:border sm:p-8 sm:shadow-xl"
            editorProps={{
              handleDOMEvents: {
                keydown: (_view, event) => handleCommandNavigation(event),
              },
              handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
              handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, uploadFn),
              attributes: {
                class:
                  "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200",
              },
            }}
            onCreate={({ editor }) => {
              setEditor(editor);
              setCharsCount(editor.storage.characterCount.characters());
            }}
            onUpdate={({ editor }) => {
              debouncedUpdates(editor);
              setSaveStatus("unsaved");
            }}
            slotAfter={<ImageResizer />}
          >
            <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
              <EditorCommandEmpty className="px-2 text-muted-foreground">
                {t("editor.noResults")}
              </EditorCommandEmpty>
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
