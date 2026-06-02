export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  title: string;
  outlineId?: string;
  project?: Project;
  syncStatus: SyncStatus;
  updatedAt: string;
  parentId?: string | null;
  order: number;
  content?: string;       // JSON 编辑器内容
  markdown?: string;      // Markdown 内容
  html?: string;         // HTML 内容
}

export interface Cycle {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  description?: string;
  status: "active" | "completed" | "paused";
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  parentId?: string | null;
  order: number;
  permissions?: ModulePermissions;
  templateId?: string;
}

export interface ModulePermissions {
  read: boolean;
  write: boolean;
  manage: boolean;
}

export interface Template {
  id: string;
  name: string;
  content: string;
  moduleId?: string;
  createdAt: string;
  updatedAt: string;
}

export type SyncStatus = "pending" | "synced" | "failed" | "unsynced";

export interface ProjectInput {
  name: string;
  description?: string;
}

export interface DocumentInput {
  id: string;
  title: string;
  outlineId?: string;
  projectId?: string;
  syncStatus?: SyncStatus;
  updatedAt?: string;
  parentId?: string | null;
  order?: number;
  content?: string;
  markdown?: string;
  html?: string;
}

export interface CycleInput {
  name: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface ModuleInput {
  id: string;
  name: string;
  description?: string;
  parentId?: string | null;
  order?: number;
  permissions?: ModulePermissions;
  templateId?: string;
}

export interface TxReport {
  db_before: unknown;
  db_after: unknown;
  tx_data: unknown[];
  tempids: Record<string, number>;
  tx_meta: unknown;
}

export interface Link {
  id: string;
  sourceDocId: string;
  targetDocId: string;
  targetTitle: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlockReference {
  id: string;
  blockId: string;
  sourceDocId: string;
  sourceBlockContent: string;
  targetDocId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PdfDocument {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  pageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PdfAnnotation {
  id: string;
  pdfId: string;
  pageIndex: number;
  type: "highlight" | "underline" | "strikethrough" | "text" | "rectangle" | "circle";
  content?: string;
  position: { x: number; y: number; width: number; height: number };
  color: string;
  referencedDocId?: string;
  createdAt: string;
  updatedAt: string;
}

export type SlackFeature = "search" | "link_preview" | "notifications";

export interface SlackIntegration {
  id: string;
  teamId: string;
  teamName: string;
  accessToken: string;
  botToken: string;
  refreshToken?: string;
  expiresAt?: number;
  installedAt: string;
  updatedAt: string;
  defaultChannel?: string;
  enabledFeatures: SlackFeature[];
}
