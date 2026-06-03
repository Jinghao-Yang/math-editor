﻿import type { Locale } from "./config";

type TranslationSchema = {
  common: {
    appName: string;
    appTagline: string;
    language: string;
    languages: {
      en: string;
      "zh-CN": string;
    };
    switchToLightMode: string;
    switchToDarkMode: string;
    untitledProject: string;
    untitledDocument: string;
    noProject: string;
    cancel: string;
  };
  home: {
    headerAction: string;
    badge: string;
    heroTitle: string;
    heroDescription: string;
    primaryAction: string;
    secondaryAction: string;
    flowPrimaryTitle: string;
    flowPrimaryDescription: string;
    flowSecondaryTitle: string;
    flowSecondaryDescription: string;
    flowNoiseTitle: string;
    flowNoiseDescription: string;
    overviewTitle: string;
    overviewDescription: string;
    overviewBadge: string;
    workbenchTitle: string;
    highlightProjects: string;
    highlightEditor: string;
    highlightSearch: string;
    nextStepsTitle: string;
    nextProjectsTitle: string;
    nextProjectsDescription: string;
    nextDocumentsTitle: string;
    nextDocumentsDescription: string;
    valueWorkspaceTitle: string;
    valueWorkspaceDescription: string;
    valueEntryTitle: string;
    valueEntryDescription: string;
    valueFeedbackTitle: string;
    valueFeedbackDescription: string;
  };
  knowledgeBase: {
    navHeading: string;
    navProjects: string;
    navDocuments: string;
    navCycles: string;
    navModules: string;
    viewList: string;
    viewBoard: string;
    viewCalendar: string;
    breadcrumbRoot: string;
    backToHome: string;
    backToList: string;
    closeMobileMenu: string;
    layoutBadge: string;
    currentPage: string;
    currentDocument: string;
    noDocumentSelected: string;
    browseTab: string;
    editTab: string;
    waitingForEdit: string;
    editorAreaLabel: string;
    editingDocument: string;
    emptyEditorTitle: string;
    emptyEditorDescription: string;
    selectDocument: string;
    editOnRight: string;
    projectsTitle: string;
    projectsDescription: string;
    newProject: string;
    documentsTitle: string;
    documentsDescription: string;
    newDocument: string;
    createDocumentTitle: string;
    createDocumentDescription: string;
    documentTitleLabel: string;
    documentTitlePlaceholder: string;
    projectOptionalLabel: string;
    createDocumentAction: string;
    documentListEmptyTitle: string;
    documentListEmptyDescription: string;
    syncStatusSynced: string;
    syncStatusPending: string;
    syncStatusFailed: string;
    syncStatusUnsynced: string;
    kanbanEmptyTitle: string;
    kanbanEmptyDescription: string;
    openInNewTab: string;
    itemCountOne: string;
    itemCountOther: string;
    noDocumentsInProject: string;
    uncategorized: string;
    calendarEmptyTitle: string;
    calendarEmptyDescription: string;
    today: string;
    yesterday: string;
    cyclesTitle: string;
    cyclesDescription: string;
    newCycle: string;
    createCycleTitle: string;
    createCycleDescription: string;
    cycleNameLabel: string;
    cycleNamePlaceholder: string;
    cycleDescriptionLabel: string;
    cycleDescriptionPlaceholder: string;
    startDateLabel: string;
    endDateLabel: string;
    createCycleAction: string;
    noCyclesTitle: string;
    noCyclesDescription: string;
    createFirstCycleAction: string;
    cycleStatusCompleted: string;
    cycleStatusPaused: string;
    cycleStatusUpcoming: string;
    cycleStatusOverdue: string;
    cycleStatusActive: string;
    cycleDueToday: string;
    cycleOneDayLeft: string;
    cycleDaysLeft: string;
    cycleDocumentsProgress: string;
    deleteCycle: string;
    deleteCycleConfirm: string;
    modulesTitle: string;
    modulesDescription: string;
    newModule: string;
    createModuleTitle: string;
    createModuleDescription: string;
    moduleNameLabel: string;
    moduleNamePlaceholder: string;
    moduleDescriptionLabel: string;
    moduleDescriptionPlaceholder: string;
    createModuleAction: string;
    noModulesTitle: string;
    noModulesDescription: string;
    createFirstModuleAction: string;
    moduleDocumentCountOne: string;
    moduleDocumentCountOther: string;
    moduleCreatedAt: string;
    deleteModule: string;
    deleteModuleConfirm: string;
  };
  editor: {
    untitledDocument: string;
    noResults: string;
    slashHint: string;
    documentLoading: {
      title: string;
      description: string;
    };
    saveStatus: {
      saved: string;
      unsaved: string;
    };
    syncStatus: {
      idleLabel: string;
      idleDescription: string;
      syncingLabel: string;
      syncingDescription: string;
      successLabel: string;
      successDescription: string;
      errorLabel: string;
      errorDescription: string;
    };
    contentSource: {
      database: string;
      local: string;
      default: string;
    };
    counts: {
      characters: string;
    };
    feedback: {
      syncIncompleteTitle: string;
      retrySync: string;
      restoreDraft: string;
      localDraftTitle: string;
      localDraftDescription: string;
      restoreFromLocal: string;
      blankDocumentTitle: string;
      blankDocumentDescription: string;
    };
    toolbar: {
      groups: {
        text: string;
        heading: string;
        list: string;
        block: string;
      };
      items: {
        bold: string;
        italic: string;
        underline: string;
        strike: string;
        inlineCode: string;
        heading1: string;
        heading2: string;
        heading3: string;
        bulletList: string;
        orderedList: string;
        blockquote: string;
        codeBlock: string;
      };
    };
    slashCommand: {
      feedbackTitle: string;
      feedbackDescription: string;
      textTitle: string;
      textDescription: string;
      todoListTitle: string;
      todoListDescription: string;
      heading1Title: string;
      heading1Description: string;
      heading2Title: string;
      heading2Description: string;
      heading3Title: string;
      heading3Description: string;
      bulletListTitle: string;
      bulletListDescription: string;
      numberedListTitle: string;
      numberedListDescription: string;
      quoteTitle: string;
      quoteDescription: string;
      codeTitle: string;
      codeDescription: string;
      imageTitle: string;
      imageDescription: string;
      youtubeTitle: string;
      youtubeDescription: string;
      prompts: {
        youtubeUrl: string;
        youtubeUrlInvalid: string;
      };
    };
  };
  search: {
    untitledDocument: string;
    trigger: string;
    inputPlaceholder: string;
    groupHeading: string;
    type: {
      document: string;
      block: string;
    };
    preparing: {
      title: string;
      description: string;
      errorFallback: string;
    };
    unavailable: {
      title: string;
      retry: string;
    };
    emptyQuery: {
      title: string;
      descriptionWithCount: string;
      descriptionWithoutCount: string;
    };
    loading: {
      title: string;
      description: string;
    };
    emptyResults: {
      title: string;
      description: string;
    };
    footer: {
      results: string;
      continueTyping: string;
      navigationHint: string;
    };
    errorFallback: string;
  };
  sync: {
    network: {
      online: string;
      offline: string;
    };
    counters: {
      pending: string;
      failed: string;
    };
    status: {
      syncingLabel: string;
      syncingDescription: string;
      syncingPendingDescription: string;
      errorLabel: string;
      errorDescription: string;
      errorWithCountDescription: string;
      queuedLabel: string;
      queuedDescription: string;
      syncedLabel: string;
      syncedDescription: string;
    };
    actions: {
      retry: string;
      clearQueue: string;
    };
  };
  project: {
    newProject: string;
    createProject: string;
    createProjectDescription: string;
    nameLabel: string;
    nameRequired: string;
    projectNamePlaceholder: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    creating: string;
    createAction: string;
    projects: string;
    associate: string;
    removeAssociation: string;
    noProjectsAvailable: string;
    noProjectsYet: string;
  };
  pdf: {
    uploadPdf: string;
    pleaseUploadPdf: string;
    select: string;
    highlight: string;
    text: string;
    rectangle: string;
  };
  ai: {
    editOrReview: string;
    improveWriting: string;
    fixGrammar: string;
    makeShorter: string;
    makeLonger: string;
    useAiMore: string;
    continueWriting: string;
    replaceSelection: string;
    insertBelow: string;
    discard: string;
    askAi: string;
    requestLimit: string;
    aiThinking: string;
    tellAiNext: string;
    askAiEdit: string;
  };
  selectors: {
    text: string;
    heading1: string;
    heading2: string;
    heading3: string;
    todoList: string;
    bulletList: string;
    numberedList: string;
    quote: string;
    code: string;
    multiple: string;
    color: string;
    background: string;
    default: string;
    purple: string;
    red: string;
    yellow: string;
    blue: string;
    green: string;
    orange: string;
    pink: string;
    gray: string;
    link: string;
    pasteLink: string;
  };
  plane: {
    documentTree: string;
    noDocuments: string;
    fabCreateNew: string;
    fabNewDocument: string;
    fabNewDocumentDesc: string;
    fabNewProject: string;
    fabNewProjectDesc: string;
    fabNewCycle: string;
    fabNewCycleDesc: string;
    fabNewModule: string;
    fabNewModuleDesc: string;
    fabCloseMenu: string;
    backlinks: string;
    backlinksCount: string;
    noBacklinks: string;
  };
  slack: {
    unknownCommand: string;
    installFirst: string;
    enterSearchKeyword: string;
    noDocumentsFound: string;
    documentsFound: string;
    notificationCreated: string;
    notificationUpdated: string;
    notificationDeleted: string;
  };
  metadata: {
    title: string;
    description: string;
  };
};

const en: TranslationSchema = {
  common: {
    appName: "Math Editor",
    appTagline: "Modern knowledge workspace",
    language: "Language",
    languages: {
      en: "English",
      "zh-CN": "Simplified Chinese",
    },
    switchToLightMode: "Switch to light mode",
    switchToDarkMode: "Switch to dark mode",
    untitledProject: "Untitled Project",
    untitledDocument: "Untitled Document",
    noProject: "No project",
    cancel: "Cancel",
  },
  home: {
    headerAction: "Open workspace",
    badge: "Workspace-first homepage",
    heroTitle: "Start in one modern workspace, then browse and edit without breaking context.",
    heroDescription:
      "The homepage now serves as a focused entry point. Primary actions route into the unified knowledge-base workspace, where navigation, document browsing, and editing stay connected in one flow.",
    primaryAction: "Enter workspace",
    secondaryAction: "Browse documents",
    flowPrimaryTitle: "Primary flow",
    flowPrimaryDescription: "Homepage points into the workspace instead of opening a standalone editor.",
    flowSecondaryTitle: "Secondary access",
    flowSecondaryDescription: "Documents remain one click away for users who want to jump directly into content.",
    flowNoiseTitle: "Reduced noise",
    flowNoiseDescription: "Theme toggle stays visible, while status affordances move out of the landing-page spotlight.",
    overviewTitle: "Workspace overview",
    overviewDescription: "Everything needed to continue work from one place.",
    overviewBadge: "Default path",
    workbenchTitle: "Unified workbench",
    highlightProjects: "Projects, documents, cycles, and modules stay in one navigation frame.",
    highlightEditor: "Document editing happens inside the knowledge-base workspace context.",
    highlightSearch: "Search and next actions remain discoverable without adding homepage noise.",
    nextStepsTitle: "Recommended next steps",
    nextProjectsTitle: "Open projects view",
    nextProjectsDescription: "Use the workspace as the default browsing and editing context.",
    nextDocumentsTitle: "Jump to documents",
    nextDocumentsDescription: "Go straight into the document list while staying inside the same workspace frame.",
    valueWorkspaceTitle: "Unified workspace",
    valueWorkspaceDescription:
      "Browse, open, and edit documents from one stable layout instead of switching between disconnected pages.",
    valueEntryTitle: "Fast entry points",
    valueEntryDescription:
      "Jump into projects, documents, and search from a single starting point with clear action hierarchy.",
    valueFeedbackTitle: "Low-noise feedback",
    valueFeedbackDescription:
      "Theme controls and status affordances stay available, but no longer compete with the main call to action.",
  },
  knowledgeBase: {
    navHeading: "Navigation",
    navProjects: "Projects",
    navDocuments: "Documents",
    navCycles: "Cycles",
    navModules: "Modules",
    viewList: "List",
    viewBoard: "Board",
    viewCalendar: "Calendar",
    breadcrumbRoot: "Knowledge Base",
    backToHome: "Back to Home",
    backToList: "← Back to list",
    closeMobileMenu: "Close mobile menu",
    layoutBadge: "Knowledge workspace",
    currentPage: "Current page: {title}",
    currentDocument: "Current document: {title}",
    noDocumentSelected: "Not selected",
    browseTab: "Browse",
    editTab: "Edit",
    waitingForEdit: "Waiting for edits",
    editorAreaLabel: "Document editor",
    editingDocument: "Editing document",
    emptyEditorTitle: "Open a document from this workspace",
    emptyEditorDescription:
      "After you select a document on the left, the editor opens here directly so you can keep awareness of the current page and knowledge-base structure.",
    selectDocument: "Select document",
    editOnRight: "Edit on the right",
    projectsTitle: "Projects",
    projectsDescription:
      "Browse projects and documents inside one unified workspace, then continue editing on the right without jumping to a standalone editor page.",
    newProject: "New Project",
    documentsTitle: "Documents",
    documentsDescription:
      "Keep document browsing and editing inside one workspace so list, board, and timeline views stay connected.",
    newDocument: "New Document",
    createDocumentTitle: "Create New Document",
    createDocumentDescription: "Create a new document and start writing.",
    documentTitleLabel: "Title",
    documentTitlePlaceholder: "Document title",
    projectOptionalLabel: "Project (optional)",
    createDocumentAction: "Create Document",
    documentListEmptyTitle: "No documents to show yet",
    documentListEmptyDescription:
      "Create a document first or change the project filter. The document list appears here in one shared workspace view.",
    syncStatusSynced: "Synced",
    syncStatusPending: "Pending",
    syncStatusFailed: "Failed",
    syncStatusUnsynced: "Unsynced",
    kanbanEmptyTitle: "No documents yet",
    kanbanEmptyDescription: "Create a project and add some documents to see them here.",
    openInNewTab: "Open in new tab",
    itemCountOne: "{count} item",
    itemCountOther: "{count} items",
    noDocumentsInProject: "No documents in this project",
    uncategorized: "Uncategorized",
    calendarEmptyTitle: "No documents yet",
    calendarEmptyDescription: "Create and edit documents to see them organized by date.",
    today: "Today",
    yesterday: "Yesterday",
    cyclesTitle: "Cycles",
    cyclesDescription: "Track your learning progress over time.",
    newCycle: "New Cycle",
    createCycleTitle: "Create New Cycle",
    createCycleDescription: "Create a learning cycle to track your progress.",
    cycleNameLabel: "Name",
    cycleNamePlaceholder: "e.g., Calculus Week 1",
    cycleDescriptionLabel: "Description",
    cycleDescriptionPlaceholder: "What will you learn in this cycle?",
    startDateLabel: "Start Date",
    endDateLabel: "End Date",
    createCycleAction: "Create Cycle",
    noCyclesTitle: "No cycles yet",
    noCyclesDescription: "Create your first learning cycle to track progress and stay organized.",
    createFirstCycleAction: "Create Your First Cycle",
    cycleStatusCompleted: "Completed",
    cycleStatusPaused: "Paused",
    cycleStatusUpcoming: "Upcoming",
    cycleStatusOverdue: "Overdue",
    cycleStatusActive: "Active",
    cycleDueToday: "Due today",
    cycleOneDayLeft: "1 day left",
    cycleDaysLeft: "{count} days left",
    cycleDocumentsProgress: "{completed} / {total} documents",
    deleteCycle: "Delete",
    deleteCycleConfirm: "Are you sure you want to delete this cycle?",
    modulesTitle: "Modules",
    modulesDescription: "Organize your knowledge into modules.",
    newModule: "New Module",
    createModuleTitle: "Create New Module",
    createModuleDescription: "Create a module to organize related documents.",
    moduleNameLabel: "Name",
    moduleNamePlaceholder: "e.g., Linear Algebra",
    moduleDescriptionLabel: "Description",
    moduleDescriptionPlaceholder: "What topics does this module cover?",
    createModuleAction: "Create Module",
    noModulesTitle: "No modules yet",
    noModulesDescription: "Create modules to organize your knowledge into logical groups.",
    createFirstModuleAction: "Create Your First Module",
    moduleDocumentCountOne: "{count} document",
    moduleDocumentCountOther: "{count} documents",
    moduleCreatedAt: "Created {date}",
    deleteModule: "Delete",
    deleteModuleConfirm: "Are you sure you want to delete this module?",
  },
  editor: {
    untitledDocument: "Untitled",
    noResults: "No results",
    slashHint: 'Type "/" to open the command menu and keep editing in the current workspace.',
    documentLoading: {
      title: "Loading document",
      description:
        "Preparing the editor and recent content while keeping you in the knowledge base workspace.",
    },
    saveStatus: {
      saved: "Saved",
      unsaved: "Unsaved changes",
    },
    syncStatus: {
      idleLabel: "Pending sync",
      idleDescription: "Changes are auto-saved and added to the sync queue after editing.",
      syncingLabel: "Syncing",
      syncingDescription: "Pushing the latest changes",
      successLabel: "Synced",
      successDescription: "The latest sync completed successfully",
      errorLabel: "Sync failed",
      errorDescription: "Retry sync or restore from the local draft",
    },
    contentSource: {
      database: "Loaded cloud content",
      local: "Showing local draft",
      default: "New blank document",
    },
    counts: {
      characters: "{count} chars",
    },
    feedback: {
      syncIncompleteTitle: "Sync incomplete",
      retrySync: "Retry sync",
      restoreDraft: "Restore draft",
      localDraftTitle: "Local draft detected",
      localDraftDescription:
        "Restore the latest browser-saved draft if you want to overwrite the current content.",
      restoreFromLocal: "Restore from local",
      blankDocumentTitle: "Blank document is ready",
      blankDocumentDescription:
        'Start typing to take notes, or type "/" to insert headings, lists, formulas, and media.',
    },
    toolbar: {
      groups: {
        text: "Text",
        heading: "Heading",
        list: "List",
        block: "Block",
      },
      items: {
        bold: "Bold",
        italic: "Italic",
        underline: "Underline",
        strike: "Strikethrough",
        inlineCode: "Inline code",
        heading1: "Heading 1",
        heading2: "Heading 2",
        heading3: "Heading 3",
        bulletList: "Bullet list",
        orderedList: "Ordered list",
        blockquote: "Quote",
        codeBlock: "Code block",
      },
    },
    slashCommand: {
      feedbackTitle: "Send Feedback",
      feedbackDescription: "Let us know how we can improve.",
      textTitle: "Text",
      textDescription: "Just start typing with plain text.",
      todoListTitle: "To-do List",
      todoListDescription: "Track tasks with a to-do list.",
      heading1Title: "Heading 1",
      heading1Description: "Big section heading.",
      heading2Title: "Heading 2",
      heading2Description: "Medium section heading.",
      heading3Title: "Heading 3",
      heading3Description: "Small section heading.",
      bulletListTitle: "Bullet List",
      bulletListDescription: "Create a simple bullet list.",
      numberedListTitle: "Numbered List",
      numberedListDescription: "Create a list with numbering.",
      quoteTitle: "Quote",
      quoteDescription: "Capture a quote.",
      codeTitle: "Code",
      codeDescription: "Capture a code snippet.",
      imageTitle: "Image",
      imageDescription: "Upload an image from your computer.",
      youtubeTitle: "YouTube",
      youtubeDescription: "Embed a YouTube video.",
      prompts: {
        youtubeUrl: "Please enter a YouTube video link",
        youtubeUrlInvalid: "Please enter a valid YouTube video link",
      },
    },
  },
  search: {
    untitledDocument: "Untitled document",
    trigger: "Search knowledge base",
    inputPlaceholder: "Search titles, content, or keywords",
    groupHeading: "Results ({count})",
    type: {
      document: "Document",
      block: "Block",
    },
    preparing: {
      title: "Preparing search",
      description:
        "Syncing the latest document content so you can search titles and body text right away.",
      errorFallback: "Failed to initialize the search index. Please try again later.",
    },
    unavailable: {
      title: "Search is temporarily unavailable",
      retry: "Try again",
    },
    emptyQuery: {
      title: "Start searching your knowledge base",
      descriptionWithCount:
        "{count} documents are indexed. Type keywords to see matching results instantly.",
      descriptionWithoutCount: "Type keywords to see matching results instantly.",
    },
    loading: {
      title: "Searching",
      description: "Matching document titles and content. Please wait a moment.",
    },
    emptyResults: {
      title: 'No results found for "{query}"',
      description:
        "Try a shorter keyword, a document title, or a phrase that is closer to the content.",
    },
    footer: {
      results: "{count} results found",
      continueTyping: "Keep typing to narrow the results",
      navigationHint: "Use ↑↓ to select and press Enter to open",
    },
    errorFallback: "Search failed. Please try again later.",
  },
  sync: {
    network: {
      online: "Online",
      offline: "Offline",
    },
    counters: {
      pending: "Pending {count}",
      failed: "Failed {count}",
    },
    status: {
      syncingLabel: "Syncing",
      syncingDescription: "Pushing the latest changes",
      syncingPendingDescription: "{count} items are still waiting to be processed",
      errorLabel: "Sync failed",
      errorDescription: "The latest sync was not successful",
      errorWithCountDescription: "{count} items failed to sync. Retry is recommended.",
      queuedLabel: "Queued",
      queuedDescription: "{count} changes are waiting in line",
      syncedLabel: "Synced",
      syncedDescription: "Local changes have been synced",
    },
    actions: {
      retry: "Retry sync",
      clearQueue: "Clear queue",
    },
  },
  project: {
    newProject: "New Project",
    createProject: "Create Project",
    createProjectDescription: "Create a new project to organize your documents.",
    nameLabel: "Name",
    nameRequired: "*",
    projectNamePlaceholder: "Project name",
    descriptionLabel: "Description",
    descriptionPlaceholder: "Optional description",
    creating: "Creating...",
    createAction: "Create Project",
    projects: "Projects",
    associate: "Associate",
    removeAssociation: "Remove association",
    noProjectsAvailable: "No projects available",
    noProjectsYet: "No projects yet",
  },
  pdf: {
    uploadPdf: "Upload PDF",
    pleaseUploadPdf: "Please upload a PDF file",
    select: "Select",
    highlight: "Highlight",
    text: "Text",
    rectangle: "Rectangle",
  },
  ai: {
    editOrReview: "Edit or review selection",
    improveWriting: "Improve writing",
    fixGrammar: "Fix grammar",
    makeShorter: "Make shorter",
    makeLonger: "Make longer",
    useAiMore: "Use AI to do more",
    continueWriting: "Continue writing",
    replaceSelection: "Replace selection",
    insertBelow: "Insert below",
    discard: "Discard",
    askAi: "Ask AI",
    requestLimit: "You have reached your request limit for the day.",
    aiThinking: "AI is thinking",
    tellAiNext: "Tell AI what to do next",
    askAiEdit: "Ask AI to edit or generate...",
  },
  selectors: {
    text: "Text",
    heading1: "Heading 1",
    heading2: "Heading 2",
    heading3: "Heading 3",
    todoList: "To-do List",
    bulletList: "Bullet List",
    numberedList: "Numbered List",
    quote: "Quote",
    code: "Code",
    multiple: "Multiple",
    color: "Color",
    background: "Background",
    default: "Default",
    purple: "Purple",
    red: "Red",
    yellow: "Yellow",
    blue: "Blue",
    green: "Green",
    orange: "Orange",
    pink: "Pink",
    gray: "Gray",
    link: "Link",
    pasteLink: "Paste a link",
  },
  plane: {
    documentTree: "Document Tree",
    noDocuments: "No documents",
    fabCreateNew: "Create new",
    fabNewDocument: "New Document",
    fabNewDocumentDesc: "Create a new document",
    fabNewProject: "New Project",
    fabNewProjectDesc: "Create a new project",
    fabNewCycle: "New Cycle",
    fabNewCycleDesc: "Create a new learning cycle",
    fabNewModule: "New Module",
    fabNewModuleDesc: "Create a new module",
    fabCloseMenu: "Close menu",
    backlinks: "Backlinks",
    backlinksCount: "Backlinks ({count})",
    noBacklinks: "No backlinks",
  },
  slack: {
    unknownCommand: "Unknown command",
    installFirst: "Please install the Slack integration first",
    enterSearchKeyword: "Please enter a search keyword",
    noDocumentsFound: 'No documents found containing "{text}"',
    documentsFound: "Found {count} related documents",
    notificationCreated: "Created a new document",
    notificationUpdated: "Updated a document",
    notificationDeleted: "Deleted a document",
  },
  metadata: {
    title: "Novel - Notion-style WYSIWYG editor with AI-powered autocompletions",
    description:
      "Novel is a Notion-style WYSIWYG editor with AI-powered autocompletions. Built with Tiptap, OpenAI, and Vercel AI SDK.",
  },
};

const zhCN: TranslationSchema = {
  common: {
    appName: "Math Editor",
    appTagline: "现代化知识工作台",
    language: "语言",
    languages: {
      en: "英文",
      "zh-CN": "简体中文",
    },
    switchToLightMode: "切换到浅色模式",
    switchToDarkMode: "切换到深色模式",
    untitledProject: "未命名项目",
    untitledDocument: "未命名文档",
    noProject: "无项目",
    cancel: "取消",
  },
  home: {
    headerAction: "打开工作台",
    badge: "工作台优先首页",
    heroTitle: "从一个现代化工作台开始，在不打断上下文的情况下浏览并编辑内容",
    heroDescription:
      "首页现在是一个聚焦的入口。主要操作会进入统一的知识库工作台，让导航、文档浏览和编辑始终保持在同一条工作流中",
    primaryAction: "进入工作台",
    secondaryAction: "浏览文档",
    flowPrimaryTitle: "主路径",
    flowPrimaryDescription: "首页直接引导进入工作台，而不是打开一个独立的编辑页面",
    flowSecondaryTitle: "次级入口",
    flowSecondaryDescription: "如果你想直接查看内容，文档列表仍然可以一键到达",
    flowNoiseTitle: "更少干扰",
    flowNoiseDescription: "主题切换仍然可见，但状态类信息不再抢占首页主入口的注意力",
    overviewTitle: "工作台概览",
    overviewDescription: "从一个位置继续当前工作的全部核心入口",
    overviewBadge: "默认路径",
    workbenchTitle: "统一工作台",
    highlightProjects: "项目、文档、周期和模块都保持在同一个导航框架中",
    highlightEditor: "文档编辑发生在知识库工作台上下文内，不再割裂",
    highlightSearch: "搜索和后续动作仍然易于发现，同时不会给首页增加噪音",
    nextStepsTitle: "推荐下一步",
    nextProjectsTitle: "打开项目视图",
    nextProjectsDescription: "将工作台作为默认的浏览与编辑上下文",
    nextDocumentsTitle: "直接查看文档",
    nextDocumentsDescription: "在同一个工作台框架内直接进入文档列表",
    valueWorkspaceTitle: "统一工作台",
    valueWorkspaceDescription: "在一个稳定布局中浏览、打开和编辑文档，而不是在割裂的页面之间切换",
    valueEntryTitle: "快速入口",
    valueEntryDescription: "从同一个起点进入项目、文档与搜索，操作层级更清晰",
    valueFeedbackTitle: "低噪音反馈",
    valueFeedbackDescription: "主题控制与状态提示仍然存在，但不会再与主操作入口争抢注意力",
  },
  knowledgeBase: {
    navHeading: "导航",
    navProjects: "项目",
    navDocuments: "文档",
    navCycles: "周期",
    navModules: "模块",
    viewList: "列表",
    viewBoard: "看板",
    viewCalendar: "日历",
    breadcrumbRoot: "知识库",
    backToHome: "返回首页",
    backToList: "← 返回列表",
    closeMobileMenu: "关闭移动端菜单",
    layoutBadge: "知识库工作台",
    currentPage: "当前页面: {title}",
    currentDocument: "当前文档: {title}",
    noDocumentSelected: "未选择",
    browseTab: "浏览",
    editTab: "编辑",
    waitingForEdit: "等待编辑",
    editorAreaLabel: "文档编辑区",
    editingDocument: "编辑文档",
    emptyEditorTitle: "从当前工作台继续打开文档",
    emptyEditorDescription:
      "在左侧选择文档后，编辑器会直接在这里展开，让你继续保持对当前页面与知识库结构的感知",
    selectDocument: "选择文档",
    editOnRight: "右侧编辑",
    projectsTitle: "项目",
    projectsDescription: "在统一工作台中浏览项目和文档，选中文档后可直接在右侧继续编辑，无需跳转到独立编辑页面",
    newProject: "新建项目",
    documentsTitle: "文档",
    documentsDescription: "将文档浏览与编辑保留在同一个工作台中，让列表、看板与时间视图保持连贯",
    newDocument: "新建文档",
    createDocumentTitle: "新建文档",
    createDocumentDescription: "创建一个新文档并立即开始写作",
    documentTitleLabel: "标题",
    documentTitlePlaceholder: "文档标题",
    projectOptionalLabel: "项目（可选）",
    createDocumentAction: "创建文档",
    documentListEmptyTitle: "还没有可显示的文档",
    documentListEmptyDescription: "先创建文档或切换项目筛选，文档列表会在这里以统一工作台视图呈现",
    syncStatusSynced: "已同步",
    syncStatusPending: "待同步",
    syncStatusFailed: "同步失败",
    syncStatusUnsynced: "未同步",
    kanbanEmptyTitle: "还没有文档",
    kanbanEmptyDescription: "先创建项目并添加一些文档，它们就会显示在这里",
    openInNewTab: "在新标签页打开",
    itemCountOne: "{count} 项",
    itemCountOther: "{count} 项",
    noDocumentsInProject: "这个项目中还没有文档",
    uncategorized: "未分类",
    calendarEmptyTitle: "还没有文档",
    calendarEmptyDescription: "创建并编辑文档后，它们会按日期整理显示在这里",
    today: "今天",
    yesterday: "昨天",
    cyclesTitle: "周期",
    cyclesDescription: "按时间追踪你的学习进度",
    newCycle: "新建周期",
    createCycleTitle: "新建周期",
    createCycleDescription: "创建一个学习周期来跟踪你的进度",
    cycleNameLabel: "名称",
    cycleNamePlaceholder: "例如：微积分第1周",
    cycleDescriptionLabel: "描述",
    cycleDescriptionPlaceholder: "这个周期里你计划学习什么？",
    startDateLabel: "开始日期",
    endDateLabel: "结束日期",
    createCycleAction: "创建周期",
    noCyclesTitle: "还没有周期",
    noCyclesDescription: "创建你的第一个学习周期，用来跟踪进度并保持有序",
    createFirstCycleAction: "创建第一个周期",
    cycleStatusCompleted: "已完成",
    cycleStatusPaused: "已暂停",
    cycleStatusUpcoming: "即将开始",
    cycleStatusOverdue: "已逾期",
    cycleStatusActive: "进行中",
    cycleDueToday: "今天到期",
    cycleOneDayLeft: "还剩 1 天",
    cycleDaysLeft: "还剩 {count} 天",
    cycleDocumentsProgress: "{completed} / {total} 篇文档",
    deleteCycle: "删除",
    deleteCycleConfirm: "确定要删除这个周期吗",
    modulesTitle: "模块",
    modulesDescription: "按模块组织你的知识内容",
    newModule: "新建模块",
    createModuleTitle: "新建模块",
    createModuleDescription: "创建一个模块来组织相关文档",
    moduleNameLabel: "名称",
    moduleNamePlaceholder: "例如：线性代数",
    moduleDescriptionLabel: "描述",
    moduleDescriptionPlaceholder: "这个模块涵盖哪些主题",
    createModuleAction: "创建模块",
    noModulesTitle: "还没有模块",
    noModulesDescription: "创建模块，将知识内容整理成清晰的分组",
    createFirstModuleAction: "创建第一个模块",
    moduleDocumentCountOne: "{count} 篇文档",
    moduleDocumentCountOther: "{count} 篇文档",
    moduleCreatedAt: "创建于 {date}",
    deleteModule: "删除",
    deleteModuleConfirm: "确定要删除这个模块吗",
  },
  editor: {
    untitledDocument: "未命名",
    noResults: "没有结果",
    slashHint: '输入 "/" 打开命令菜单，保持在当前工作台内完成编辑',
    documentLoading: {
      title: "正在加载文档",
      description: "正在准备编辑器和最近内容，当前仍处于知识库工作台上下文中",
    },
    saveStatus: {
      saved: "已保存",
      unsaved: "有未保存改动",
    },
    syncStatus: {
      idleLabel: "待同步",
      idleDescription: "编辑后会自动保存并加入同步队列",
      syncingLabel: "同步中",
      syncingDescription: "正在推送最新改动",
      successLabel: "已同步",
      successDescription: "最近一次同步已完成",
      errorLabel: "同步失败",
      errorDescription: "可重新同步或从本地草稿恢复",
    },
    contentSource: {
      database: "已加载云端内容",
      local: "当前展示本地草稿",
      default: "当前为新建空白文档",
    },
    counts: {
      characters: "{count} 字",
    },
    feedback: {
      syncIncompleteTitle: "同步未完成",
      retrySync: "重新同步",
      restoreDraft: "恢复草稿",
      localDraftTitle: "检测到本地草稿",
      localDraftDescription: "如需覆盖当前内容，可恢复最近一次浏览器本地保存的草稿",
      restoreFromLocal: "从本地恢复",
      blankDocumentTitle: "空白文档已就绪",
      blankDocumentDescription: '直接输入开始记录，或输入 "/" 插入标题、列表、公式和媒体内容',
    },
    toolbar: {
      groups: {
        text: "文本",
        heading: "标题",
        list: "列表",
        block: "区块",
      },
      items: {
        bold: "加粗",
        italic: "斜体",
        underline: "下划线",
        strike: "删除线",
        inlineCode: "行内代码",
        heading1: "一级标题",
        heading2: "二级标题",
        heading3: "三级标题",
        bulletList: "无序列表",
        orderedList: "有序列表",
        blockquote: "引用",
        codeBlock: "代码块",
      },
    },
    slashCommand: {
      feedbackTitle: "发送反馈",
      feedbackDescription: "告诉我们还可以如何改进",
      textTitle: "正文",
      textDescription: "直接开始输入普通文本",
      todoListTitle: "待办列表",
      todoListDescription: "用待办列表追踪任务",
      heading1Title: "一级标题",
      heading1Description: "用于重要章节标题",
      heading2Title: "二级标题",
      heading2Description: "用于中等层级的小节标题",
      heading3Title: "三级标题",
      heading3Description: "用于较小层级的标题",
      bulletListTitle: "无序列表",
      bulletListDescription: "创建简单的项目符号列表",
      numberedListTitle: "有序列表",
      numberedListDescription: "创建带编号的列表",
      quoteTitle: "引用",
      quoteDescription: "插入引用内容",
      codeTitle: "代码",
      codeDescription: "插入代码片段",
      imageTitle: "图片",
      imageDescription: "从电脑上传图片",
      youtubeTitle: "YouTube",
      youtubeDescription: "嵌入一个 YouTube 视频",
      prompts: {
        youtubeUrl: "请输入 YouTube 视频链接",
        youtubeUrlInvalid: "请输入正确的 YouTube 视频链接",
      },
    },
  },
  search: {
    untitledDocument: "未命名文档",
    trigger: "搜索知识库内容",
    inputPlaceholder: "搜索标题、正文或关键词",
    groupHeading: "搜索结果（{count}）",
    type: {
      document: "文档",
      block: "块",
    },
    preparing: {
      title: "正在准备搜索",
      description: "正在同步最新文档内容，准备好后可立即检索标题与正文",
      errorFallback: "搜索索引初始化失败，请稍后重试",
    },
    unavailable: {
      title: "搜索暂时不可用",
      retry: "重新尝试",
    },
    emptyQuery: {
      title: "开始搜索知识库内容",
      descriptionWithCount: "当前已加载 {count} 篇文档，输入关键词后会实时展示匹配结果",
      descriptionWithoutCount: "输入关键词后会实时展示匹配结果",
    },
    loading: {
      title: "正在搜索",
      description: "系统会匹配文档标题与正文内容，请稍候",
    },
    emptyResults: {
      title: '没有找到"{query}"相关内容',
      description: "试试更短的关键词、文档标题，或换一个更接近正文的描述",
    },
    footer: {
      results: "检索到 {count} 条结果",
      continueTyping: "继续输入以缩小检索范围",
      navigationHint: "使用 ↑↓ 选择，按 Enter 打开",
    },
    errorFallback: "搜索失败，请稍后重试",
  },
  sync: {
    network: {
      online: "网络已连接",
      offline: "网络已断开",
    },
    counters: {
      pending: "待同步 {count}",
      failed: "失败 {count}",
    },
    status: {
      syncingLabel: "正在同步",
      syncingDescription: "系统正在推送最新变动",
      syncingPendingDescription: "还有 {count} 项等待处理",
      errorLabel: "同步失败",
      errorDescription: "最近一次同步未成功",
      errorWithCountDescription: "{count} 项同步失败，建议立即重试",
      queuedLabel: "等待同步",
      queuedDescription: "还有 {count} 项改动排队中",
      syncedLabel: "已同步",
      syncedDescription: "本地改动已完成同步",
    },
    actions: {
      retry: "重新同步",
      clearQueue: "清空队列",
    },
  },
  project: {
    newProject: "新建项目",
    createProject: "创建项目",
    createProjectDescription: "创建一个新项目来整理你的文档",
    nameLabel: "名称",
    nameRequired: "*",
    projectNamePlaceholder: "项目名称",
    descriptionLabel: "描述",
    descriptionPlaceholder: "可选描述",
    creating: "创建中...",
    createAction: "创建项目",
    projects: "项目",
    associate: "关联",
    removeAssociation: "取消关联",
    noProjectsAvailable: "暂无可用项目",
    noProjectsYet: "暂无项目",
  },
  pdf: {
    uploadPdf: "上传PDF",
    pleaseUploadPdf: "请上传PDF文件",
    select: "选择",
    highlight: "高亮",
    text: "文字",
    rectangle: "矩形",
  },
  ai: {
    editOrReview: "编辑或审阅选中内容",
    improveWriting: "改进写作",
    fixGrammar: "修正语法",
    makeShorter: "缩短内容",
    makeLonger: "扩展内容",
    useAiMore: "使用 AI 做更多",
    continueWriting: "继续写作",
    replaceSelection: "替换选中内容",
    insertBelow: "在下方插入",
    discard: "丢弃",
    askAi: "询问 AI",
    requestLimit: "您已达到今日请求次数上限",
    aiThinking: "AI 正在思考",
    tellAiNext: "告诉 AI 下一步做什么",
    askAiEdit: "请求 AI 编辑或生成",
  },
  selectors: {
    text: "正文",
    heading1: "一级标题",
    heading2: "二级标题",
    heading3: "三级标题",
    todoList: "待办列表",
    bulletList: "无序列表",
    numberedList: "有序列表",
    quote: "引用",
    code: "代码",
    multiple: "多项",
    color: "颜色",
    background: "背景",
    default: "默认",
    purple: "紫色",
    red: "红色",
    yellow: "黄色",
    blue: "蓝色",
    green: "绿色",
    orange: "橙色",
    pink: "粉色",
    gray: "灰色",
    link: "链接",
    pasteLink: "粘贴链接",
  },
  plane: {
    documentTree: "文档树",
    noDocuments: "暂无文档",
    fabCreateNew: "新建",
    fabNewDocument: "新建文档",
    fabNewDocumentDesc: "创建一个新文档",
    fabNewProject: "新建项目",
    fabNewProjectDesc: "创建一个新项目",
    fabNewCycle: "新建周期",
    fabNewCycleDesc: "创建一个新的学习周期",
    fabNewModule: "新建模块",
    fabNewModuleDesc: "创建一个新模块",
    fabCloseMenu: "关闭菜单",
    backlinks: "反向链接",
    backlinksCount: "反向链接 ({count})",
    noBacklinks: "暂无反向链接",
  },
  slack: {
    unknownCommand: "未知命令",
    installFirst: "请先安装 Slack 集成",
    enterSearchKeyword: "请输入搜索关键词",
    noDocumentsFound: '未找到包含 "{text}" 的文档',
    documentsFound: "找到 {count} 个相关文档",
    notificationCreated: "创建了新文档",
    notificationUpdated: "更新了文档",
    notificationDeleted: "删除了文档",
  },
  metadata: {
    title: "Novel - Notion 风格所见即所得编辑器，搭配 AI 自动补全",
    description:
      "Novel 是一个 Notion 风格的所见即所得编辑器，搭配 AI 自动补全功能。基于 Tiptap、OpenAI 和 Vercel AI SDK 构建。",
  },
};

export const dictionaries = {
  en,
  "zh-CN": zhCN,
} as const satisfies Record<Locale, TranslationSchema>;

type Primitive = string;
type Join<K extends string, P extends string> = `${K}.${P}`;

export type TranslationKey<T extends Record<string, unknown> = TranslationSchema> = {
  [K in keyof T & string]: T[K] extends Primitive
    ? K
    : T[K] extends Record<string, unknown>
      ? Join<K, TranslationKey<T[K]>>
      : never;
}[keyof T & string];

export type TranslationDictionary = TranslationSchema;
export type I18nMessages = typeof dictionaries;

const getNestedTranslation = (dictionary: Record<string, unknown>, key: string) => {
  return key.split(".").reduce<unknown>((value, segment) => {
    if (value && typeof value === "object" && segment in value) {
      return (value as Record<string, unknown>)[segment];
    }

    return undefined;
  }, dictionary);
};

export const getMessage = (locale: Locale, key: TranslationKey) => {
  const message = getNestedTranslation(dictionaries[locale], key);

  if (typeof message === "string") {
    return message;
  }

  const fallbackMessage = getNestedTranslation(dictionaries.en, key);

  return typeof fallbackMessage === "string" ? fallbackMessage : key;
};

