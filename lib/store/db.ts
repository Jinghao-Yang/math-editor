import * as Y from "yjs";
import type { DocumentInput, SyncStatus, TxReport, CycleInput, ModuleInput, SlackIntegration } from "./types";

let ydoc: Y.Doc | null = null;
let projectsMap: Y.Map<Y.Map<unknown>> | null = null;
let documentsMap: Y.Map<Y.Map<unknown>> | null = null;
let cyclesMap: Y.Map<Y.Map<unknown>> | null = null;
let modulesMap: Y.Map<Y.Map<unknown>> | null = null;
let linksMap: Y.Map<Y.Map<unknown>> | null = null;
let blockReferencesMap: Y.Map<Y.Map<unknown>> | null = null;
let pdfDocumentsMap: Y.Map<Y.Map<unknown>> | null = null;
let pdfAnnotationsMap: Y.Map<Y.Map<unknown>> | null = null;
let slackIntegrationsMap: Y.Map<Y.Map<unknown>> | null = null;

function ensureInitialized(): void {
  if (typeof window === "undefined") {
    throw new Error("Store operations are only available in client-side");
  }
  if (!ydoc) {
    ydoc = new Y.Doc();
    projectsMap = ydoc.getMap("projects");
    documentsMap = ydoc.getMap("documents");
    cyclesMap = ydoc.getMap("cycles");
    modulesMap = ydoc.getMap("modules");
    linksMap = ydoc.getMap("links");
    blockReferencesMap = ydoc.getMap("blockReferences");
    pdfDocumentsMap = ydoc.getMap("pdfDocuments");
    pdfAnnotationsMap = ydoc.getMap("pdfAnnotations");
    slackIntegrationsMap = ydoc.getMap("slackIntegrations");
  }
}

function getProjectsMap(): Y.Map<Y.Map<unknown>> {
  ensureInitialized();
  return projectsMap!;
}

function getDocumentsMap(): Y.Map<Y.Map<unknown>> {
  ensureInitialized();
  return documentsMap!;
}

function getCyclesMap(): Y.Map<Y.Map<unknown>> {
  ensureInitialized();
  return cyclesMap!;
}

function getModulesMap(): Y.Map<Y.Map<unknown>> {
  ensureInitialized();
  return modulesMap!;
}

function getLinksMap(): Y.Map<Y.Map<unknown>> {
  ensureInitialized();
  return linksMap!;
}

function getBlockReferencesMap(): Y.Map<Y.Map<unknown>> {
  ensureInitialized();
  return blockReferencesMap!;
}

function getPdfDocumentsMap(): Y.Map<Y.Map<unknown>> {
  ensureInitialized();
  return pdfDocumentsMap!;
}

function getPdfAnnotationsMap(): Y.Map<Y.Map<unknown>> {
  ensureInitialized();
  return pdfAnnotationsMap!;
}

function linkMapToObject(map: Y.Map<unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  result["link/id"] = map.get("id");
  result["link/sourceDocId"] = map.get("sourceDocId");
  result["link/targetDocId"] = map.get("targetDocId");
  result["link/targetTitle"] = map.get("targetTitle");
  result["link/createdAt"] = map.get("createdAt");
  result["link/updatedAt"] = map.get("updatedAt");
  return result;
}

function blockReferenceMapToObject(map: Y.Map<unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  result["blockReference/id"] = map.get("id");
  result["blockReference/blockId"] = map.get("blockId");
  result["blockReference/sourceDocId"] = map.get("sourceDocId");
  result["blockReference/sourceBlockContent"] = map.get("sourceBlockContent");
  result["blockReference/targetDocId"] = map.get("targetDocId");
  result["blockReference/createdAt"] = map.get("createdAt");
  result["blockReference/updatedAt"] = map.get("updatedAt");
  return result;
}

function pdfDocumentMapToObject(map: Y.Map<unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  result["pdfDocument/id"] = map.get("id");
  result["pdfDocument/fileName"] = map.get("fileName");
  result["pdfDocument/fileUrl"] = map.get("fileUrl");
  result["pdfDocument/fileSize"] = map.get("fileSize");
  result["pdfDocument/pageCount"] = map.get("pageCount");
  result["pdfDocument/createdAt"] = map.get("createdAt");
  result["pdfDocument/updatedAt"] = map.get("updatedAt");
  return result;
}

function pdfAnnotationMapToObject(map: Y.Map<unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  result["pdfAnnotation/id"] = map.get("id");
  result["pdfAnnotation/pdfId"] = map.get("pdfId");
  result["pdfAnnotation/pageIndex"] = map.get("pageIndex");
  result["pdfAnnotation/type"] = map.get("type");
  result["pdfAnnotation/content"] = map.get("content");
  result["pdfAnnotation/position"] = map.get("position");
  result["pdfAnnotation/color"] = map.get("color");
  result["pdfAnnotation/referencedDocId"] = map.get("referencedDocId");
  result["pdfAnnotation/createdAt"] = map.get("createdAt");
  result["pdfAnnotation/updatedAt"] = map.get("updatedAt");
  return result;
}

function makeTxReport(): TxReport {
  return {
    db_before: null,
    db_after: null,
    tx_data: [],
    tempids: {},
    tx_meta: null,
  };
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function projectMapToObject(map: Y.Map<unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  result["project/id"] = map.get("id");
  result["project/name"] = map.get("name");
  result["project/description"] = map.get("description");
  result["project/createdAt"] = map.get("createdAt");
  result["project/updatedAt"] = map.get("updatedAt");
  return result;
}

function documentMapToObject(map: Y.Map<unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  result["document/id"] = map.get("id");
  result["document/title"] = map.get("title");
  const outlineId = map.get("outlineId");
  if (outlineId) result["document/outlineId"] = outlineId;
  result["document/syncStatus"] = map.get("syncStatus");
  result["document/updatedAt"] = map.get("updatedAt");
  const parentId = map.get("parentId");
  if (parentId !== undefined) result["document/parentId"] = parentId;
  result["document/order"] = map.get("order") ?? 0;
  const content = map.get("content");
  if (content) result["document/content"] = content;
  const markdown = map.get("markdown");
  if (markdown) result["document/markdown"] = markdown;
  const html = map.get("html");
  if (html) result["document/html"] = html;
  const projectId = map.get("projectId");
  if (projectId) {
    const pmap = getProjectsMap();
    const project = pmap.get(projectId as string);
    if (project) {
      result["document/project"] = projectMapToObject(project);
    }
  }
  return result;
}

function cycleMapToObject(map: Y.Map<unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  result["cycle/id"] = map.get("id");
  result["cycle/name"] = map.get("name");
  result["cycle/startDate"] = map.get("startDate");
  result["cycle/endDate"] = map.get("endDate");
  result["cycle/description"] = map.get("description");
  result["cycle/createdAt"] = map.get("createdAt");
  result["cycle/updatedAt"] = map.get("updatedAt");
  return result;
}

function moduleMapToObject(map: Y.Map<unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  result["module/id"] = map.get("id");
  result["module/name"] = map.get("name");
  result["module/description"] = map.get("description");
  result["module/createdAt"] = map.get("createdAt");
  result["module/updatedAt"] = map.get("updatedAt");
  result["module/parentId"] = map.get("parentId");
  result["module/order"] = map.get("order");
  result["module/permissions"] = map.get("permissions");
  result["module/templateId"] = map.get("templateId");
  return result;
}

export function getConn(): { ydoc: Y.Doc } {
  ensureInitialized();
  return { ydoc: ydoc! };
}

export function ensureClientOnly(): void {
  ensureInitialized();
}

export function transactData<T extends unknown[]>(txData: T): TxReport {
  ensureInitialized();
  const pmap = getProjectsMap();
  const dmap = getDocumentsMap();
  const cmap = getCyclesMap();
  const mmap = getModulesMap();
  const lmap = getLinksMap();
  const bmap = getBlockReferencesMap();
  const pdfmap = getPdfDocumentsMap();
  const amap = getPdfAnnotationsMap();

  for (const item of txData) {
    const data = item as Record<string, unknown>;

    if (data["project/id"] !== undefined) {
      const id = data["project/id"] as string;
      let project = pmap.get(id);
      if (!project) {
        project = new Y.Map();
        pmap.set(id, project);
      }
      if (data["project/name"] !== undefined) project.set("name", data["project/name"]);
      if (data["project/description"] !== undefined) project.set("description", data["project/description"]);
      if (data["project/createdAt"] !== undefined) project.set("createdAt", data["project/createdAt"]);
      if (data["project/updatedAt"] !== undefined) project.set("updatedAt", data["project/updatedAt"]);
      project.set("id", id);
    }

    if (data["document/id"] !== undefined) {
      const id = data["document/id"] as string;
      let document = dmap.get(id);
      if (!document) {
        document = new Y.Map();
        dmap.set(id, document);
      }
      if (data["document/title"] !== undefined) document.set("title", data["document/title"]);
      if (data["document/outlineId"] !== undefined) document.set("outlineId", data["document/outlineId"]);
      if (data["document/syncStatus"] !== undefined) document.set("syncStatus", data["document/syncStatus"]);
      if (data["document/updatedAt"] !== undefined) document.set("updatedAt", data["document/updatedAt"]);
      if (data["document/parentId"] !== undefined) {
        if (data["document/parentId"] === null) {
          document.delete("parentId");
        } else {
          document.set("parentId", data["document/parentId"]);
        }
      }
      if (data["document/order"] !== undefined) document.set("order", data["document/order"]);
      if (data["document/content"] !== undefined) document.set("content", data["document/content"]);
      if (data["document/markdown"] !== undefined) document.set("markdown", data["document/markdown"]);
      if (data["document/html"] !== undefined) document.set("html", data["document/html"]);

      const projectRef = data["document/project"];
      if (projectRef !== undefined) {
        if (projectRef === null) {
          document.delete("projectId");
        } else if (Array.isArray(projectRef) && projectRef[0] === "project/id") {
          document.set("projectId", projectRef[1]);
        }
      }
      
      const cycleRef = data["document/cycle"];
      if (cycleRef !== undefined) {
        if (cycleRef === null) {
          document.delete("cycleId");
        } else if (Array.isArray(cycleRef) && cycleRef[0] === "cycle/id") {
          document.set("cycleId", cycleRef[1]);
        }
      }
      
      const moduleRef = data["document/module"];
      if (moduleRef !== undefined) {
        if (moduleRef === null) {
          document.delete("moduleId");
        } else if (Array.isArray(moduleRef) && moduleRef[0] === "module/id") {
          document.set("moduleId", moduleRef[1]);
        }
      }
      
      document.set("id", id);
    }

    if (data["cycle/id"] !== undefined) {
      const id = data["cycle/id"] as string;
      let cycle = cmap.get(id);
      if (!cycle) {
        cycle = new Y.Map();
        cmap.set(id, cycle);
      }
      if (data["cycle/name"] !== undefined) cycle.set("name", data["cycle/name"]);
      if (data["cycle/startDate"] !== undefined) cycle.set("startDate", data["cycle/startDate"]);
      if (data["cycle/endDate"] !== undefined) cycle.set("endDate", data["cycle/endDate"]);
      if (data["cycle/description"] !== undefined) cycle.set("description", data["cycle/description"]);
      if (data["cycle/createdAt"] !== undefined) cycle.set("createdAt", data["cycle/createdAt"]);
      if (data["cycle/updatedAt"] !== undefined) cycle.set("updatedAt", data["cycle/updatedAt"]);
      cycle.set("id", id);
    }

    if (data["module/id"] !== undefined) {
      const id = data["module/id"] as string;
      let module = mmap.get(id);
      if (!module) {
        module = new Y.Map();
        mmap.set(id, module);
      }
      if (data["module/name"] !== undefined) module.set("name", data["module/name"]);
      if (data["module/description"] !== undefined) module.set("description", data["module/description"]);
      if (data["module/createdAt"] !== undefined) module.set("createdAt", data["module/createdAt"]);
      if (data["module/updatedAt"] !== undefined) module.set("updatedAt", data["module/updatedAt"]);
      if (data["module/parentId"] !== undefined) module.set("parentId", data["module/parentId"]);
      if (data["module/order"] !== undefined) module.set("order", data["module/order"]);
      if (data["module/permissions"] !== undefined) module.set("permissions", data["module/permissions"]);
      if (data["module/templateId"] !== undefined) module.set("templateId", data["module/templateId"]);
      module.set("id", id);
    }

    if (data["link/id"] !== undefined) {
      const id = data["link/id"] as string;
      let link = lmap.get(id);
      if (!link) {
        link = new Y.Map();
        lmap.set(id, link);
      }
      if (data["link/sourceDocId"] !== undefined) link.set("sourceDocId", data["link/sourceDocId"]);
      if (data["link/targetDocId"] !== undefined) link.set("targetDocId", data["link/targetDocId"]);
      if (data["link/targetTitle"] !== undefined) link.set("targetTitle", data["link/targetTitle"]);
      if (data["link/createdAt"] !== undefined) link.set("createdAt", data["link/createdAt"]);
      if (data["link/updatedAt"] !== undefined) link.set("updatedAt", data["link/updatedAt"]);
      link.set("id", id);
    }

    if (data["blockReference/id"] !== undefined) {
      const id = data["blockReference/id"] as string;
      let blockRef = bmap.get(id);
      if (!blockRef) {
        blockRef = new Y.Map();
        bmap.set(id, blockRef);
      }
      if (data["blockReference/blockId"] !== undefined) blockRef.set("blockId", data["blockReference/blockId"]);
      if (data["blockReference/sourceDocId"] !== undefined) blockRef.set("sourceDocId", data["blockReference/sourceDocId"]);
      if (data["blockReference/sourceBlockContent"] !== undefined) blockRef.set("sourceBlockContent", data["blockReference/sourceBlockContent"]);
      if (data["blockReference/targetDocId"] !== undefined) blockRef.set("targetDocId", data["blockReference/targetDocId"]);
      if (data["blockReference/createdAt"] !== undefined) blockRef.set("createdAt", data["blockReference/createdAt"]);
      if (data["blockReference/updatedAt"] !== undefined) blockRef.set("updatedAt", data["blockReference/updatedAt"]);
      blockRef.set("id", id);
    }

    if (data["pdfDocument/id"] !== undefined) {
      const id = data["pdfDocument/id"] as string;
      let pdfDoc = pdfmap.get(id);
      if (!pdfDoc) {
        pdfDoc = new Y.Map();
        pdfmap.set(id, pdfDoc);
      }
      if (data["pdfDocument/fileName"] !== undefined) pdfDoc.set("fileName", data["pdfDocument/fileName"]);
      if (data["pdfDocument/fileUrl"] !== undefined) pdfDoc.set("fileUrl", data["pdfDocument/fileUrl"]);
      if (data["pdfDocument/fileSize"] !== undefined) pdfDoc.set("fileSize", data["pdfDocument/fileSize"]);
      if (data["pdfDocument/pageCount"] !== undefined) pdfDoc.set("pageCount", data["pdfDocument/pageCount"]);
      if (data["pdfDocument/createdAt"] !== undefined) pdfDoc.set("createdAt", data["pdfDocument/createdAt"]);
      if (data["pdfDocument/updatedAt"] !== undefined) pdfDoc.set("updatedAt", data["pdfDocument/updatedAt"]);
      pdfDoc.set("id", id);
    }

    if (data["pdfAnnotation/id"] !== undefined) {
      const id = data["pdfAnnotation/id"] as string;
      let annotation = amap.get(id);
      if (!annotation) {
        annotation = new Y.Map();
        amap.set(id, annotation);
      }
      if (data["pdfAnnotation/pdfId"] !== undefined) annotation.set("pdfId", data["pdfAnnotation/pdfId"]);
      if (data["pdfAnnotation/pageIndex"] !== undefined) annotation.set("pageIndex", data["pdfAnnotation/pageIndex"]);
      if (data["pdfAnnotation/type"] !== undefined) annotation.set("type", data["pdfAnnotation/type"]);
      if (data["pdfAnnotation/content"] !== undefined) annotation.set("content", data["pdfAnnotation/content"]);
      if (data["pdfAnnotation/position"] !== undefined) annotation.set("position", data["pdfAnnotation/position"]);
      if (data["pdfAnnotation/color"] !== undefined) annotation.set("color", data["pdfAnnotation/color"]);
      if (data["pdfAnnotation/referencedDocId"] !== undefined) annotation.set("referencedDocId", data["pdfAnnotation/referencedDocId"]);
      if (data["pdfAnnotation/createdAt"] !== undefined) annotation.set("createdAt", data["pdfAnnotation/createdAt"]);
      if (data["pdfAnnotation/updatedAt"] !== undefined) annotation.set("updatedAt", data["pdfAnnotation/updatedAt"]);
      annotation.set("id", id);
    }
  }

  return makeTxReport();
}

export function queryData<T = unknown>(
  query: unknown,
  ..._args: unknown[]
): T[] {
  ensureInitialized();
  const pmap = getProjectsMap();
  const dmap = getDocumentsMap();

  if (!Array.isArray(query) || query.length < 4) {
    return [];
  }

  const findClause = query[1];
  const whereClauses = query[3] as unknown[][];

  if (query[0] === "?find" || query[0] === ":find") {
    const findVars = Array.isArray(findClause) ? findClause : [findClause];

    if (findVars.length === 1 && findVars[0] === "?e") {
      if (whereClauses.length === 1 && whereClauses[0].length === 3) {
        const [entity, attr, value] = whereClauses[0];

        if (attr === "document/id" && (value === "?id" || value === "?_id")) {
          const results: unknown[][] = [];
          dmap.forEach((doc) => {
            results.push([documentMapToObject(doc)]);
          });
          return results as T[];
        }
      }

      if (whereClauses.length === 2 && whereClauses[0].length === 3 && whereClauses[1].length === 3) {
        const clause0 = whereClauses[0];
        const clause1 = whereClauses[1];

        if (clause0[1] === "project/id" && clause1[1] === "document/project") {
          const targetProjectId = clause0[2] as string;
          const results: unknown[][] = [];
          dmap.forEach((doc) => {
            if (doc.get("projectId") === targetProjectId) {
              results.push([documentMapToObject(doc)]);
            }
          });
          return results as T[];
        }
      }
    }

    if (findVars.length === 1 && findVars[0] === "?p") {
      if (whereClauses.length === 2) {
        const clause0 = whereClauses[0];
        const clause1 = whereClauses[1];

        if (clause0[1] === "document/id" && clause1[1] === "document/project") {
          const docId = clause0[2] as string;
          const doc = dmap.get(docId);
          if (doc) {
            const projectId = doc.get("projectId") as string | undefined;
            if (projectId) {
              const project = pmap.get(projectId);
              if (project) {
                return [[projectMapToObject(project)]] as T[];
              }
            }
          }
        }
      }
    }
  }

  return [];
}

export function getEntity(_eid: unknown): Record<string, unknown> | null {
  return null;
}

export function getAllProjects(): Array<Record<string, unknown>> {
  ensureInitialized();
  const pmap = getProjectsMap();
  const results: Array<Record<string, unknown>> = [];

  pmap.forEach((project) => {
    results.push(projectMapToObject(project));
  });

  return results;
}

export function getProjectDocuments(projectId: string): Array<Record<string, unknown>> {
  ensureInitialized();
  const dmap = getDocumentsMap();
  const results: Array<Record<string, unknown>> = [];

  dmap.forEach((doc) => {
    if (doc.get("projectId") === projectId) {
      results.push(documentMapToObject(doc));
    }
  });

  return results;
}

export function createProject(name: string, description?: string): TxReport {
  ensureInitialized();
  const now = new Date().toISOString();
  const id = generateId("project");

  return transactData([
    {
      "project/id": id,
      "project/name": name,
      "project/description": description || "",
      "project/createdAt": now,
      "project/updatedAt": now,
    },
  ]);
}

export function createDocument(docData: DocumentInput): TxReport {
  ensureInitialized();
  const now = new Date().toISOString();
  const txData: Record<string, unknown> = {
    "document/id": docData.id,
    "document/title": docData.title,
    "document/syncStatus": docData.syncStatus || "unsynced",
    "document/updatedAt": docData.updatedAt || now,
    "document/order": docData.order ?? 0,
  };

  if (docData.outlineId) {
    txData["document/outlineId"] = docData.outlineId;
  }

  if (docData.projectId) {
    txData["document/project"] = ["project/id", docData.projectId];
  }

  if (docData.parentId !== undefined) {
    txData["document/parentId"] = docData.parentId;
  }

  if (docData.content !== undefined) {
    txData["document/content"] = docData.content;
  }
  if (docData.markdown !== undefined) {
    txData["document/markdown"] = docData.markdown;
  }
  if (docData.html !== undefined) {
    txData["document/html"] = docData.html;
  }

  return transactData([txData]);
}

export function updateDocumentSyncStatus(docId: string, status: SyncStatus): TxReport {
  const now = new Date().toISOString();

  return transactData([
    {
      "document/id": docId,
      "document/syncStatus": status,
      "document/updatedAt": now,
    },
  ]);
}

export function resetDb(): void {
  ydoc = null;
  projectsMap = null;
  documentsMap = null;
  cyclesMap = null;
  modulesMap = null;
}

export function getCycles(): Array<Record<string, unknown>> {
  ensureInitialized();
  const cmap = getCyclesMap();
  const results: Array<Record<string, unknown>> = [];

  cmap.forEach((cycle) => {
    results.push(cycleMapToObject(cycle));
  });

  return results;
}

export function createCycle(name: string, startDate: string, endDate: string, description?: string): TxReport {
  ensureInitialized();
  const now = new Date().toISOString();
  const id = generateId("cycle");

  return transactData([
    {
      "cycle/id": id,
      "cycle/name": name,
      "cycle/startDate": startDate,
      "cycle/endDate": endDate,
      "cycle/description": description || "",
      "cycle/createdAt": now,
      "cycle/updatedAt": now,
    },
  ]);
}

export function updateCycle(cycleId: string, data: Partial<{ name: string; startDate: string; endDate: string; description?: string }>): TxReport {
  const now = new Date().toISOString();
  const txData: Record<string, unknown> = {
    "cycle/id": cycleId,
    "cycle/updatedAt": now,
  };

  if (data.name !== undefined) txData["cycle/name"] = data.name;
  if (data.startDate !== undefined) txData["cycle/startDate"] = data.startDate;
  if (data.endDate !== undefined) txData["cycle/endDate"] = data.endDate;
  if (data.description !== undefined) txData["cycle/description"] = data.description;

  return transactData([txData]);
}

export function deleteCycle(cycleId: string): TxReport {
  ensureInitialized();
  const cmap = getCyclesMap();
  cmap.delete(cycleId);
  
  const dmap = getDocumentsMap();
  dmap.forEach((doc, docId) => {
    if (doc.get("cycleId") === cycleId) {
      doc.delete("cycleId");
    }
  });
  
  return makeTxReport();
}

export function addDocumentToCycle(cycleId: string, documentId: string): TxReport {
  return transactData([
    {
      "document/id": documentId,
      "document/cycle": ["cycle/id", cycleId],
    },
  ]);
}

export function removeDocumentFromCycle(cycleId: string, documentId: string): TxReport {
  return transactData([
    {
      "document/id": documentId,
      "document/cycle": null,
    },
  ]);
}

export function getDocumentsByCycle(cycleId: string): Array<Record<string, unknown>> {
  ensureInitialized();
  const dmap = getDocumentsMap();
  const results: Array<Record<string, unknown>> = [];

  dmap.forEach((doc) => {
    if (doc.get("cycleId") === cycleId) {
      results.push(documentMapToObject(doc));
    }
  });

  return results;
}

export function getModules(): Array<Record<string, unknown>> {
  ensureInitialized();
  const mmap = getModulesMap();
  const results: Array<Record<string, unknown>> = [];

  mmap.forEach((module) => {
    results.push(moduleMapToObject(module));
  });

  return results;
}

export function createModule(name: string, description?: string, parentId?: string | null): TxReport {
  ensureInitialized();
  const now = new Date().toISOString();
  const id = generateId("module");

  const txData: Record<string, unknown> = {
    "module/id": id,
    "module/name": name,
    "module/description": description || "",
    "module/createdAt": now,
    "module/updatedAt": now,
    "module/order": 0,
  };

  if (parentId !== undefined) {
    txData["module/parentId"] = parentId;
  }

  return transactData([txData]);
}

export function updateModule(moduleId: string, data: Partial<{ name: string; description?: string; parentId?: string | null; order?: number; permissions?: unknown; templateId?: string }>): TxReport {
  const now = new Date().toISOString();
  const txData: Record<string, unknown> = {
    "module/id": moduleId,
    "module/updatedAt": now,
  };

  if (data.name !== undefined) txData["module/name"] = data.name;
  if (data.description !== undefined) txData["module/description"] = data.description;
  if (data.parentId !== undefined) txData["module/parentId"] = data.parentId;
  if (data.order !== undefined) txData["module/order"] = data.order;
  if (data.permissions !== undefined) txData["module/permissions"] = data.permissions;
  if (data.templateId !== undefined) txData["module/templateId"] = data.templateId;

  return transactData([txData]);
}

export function deleteModule(moduleId: string): TxReport {
  ensureInitialized();
  const mmap = getModulesMap();
  mmap.delete(moduleId);
  
  const dmap = getDocumentsMap();
  dmap.forEach((doc, docId) => {
    if (doc.get("moduleId") === moduleId) {
      doc.delete("moduleId");
    }
  });
  
  return makeTxReport();
}

export function addDocumentToModule(moduleId: string, documentId: string): TxReport {
  return transactData([
    {
      "document/id": documentId,
      "document/module": ["module/id", moduleId],
    },
  ]);
}

export function removeDocumentFromModule(moduleId: string, documentId: string): TxReport {
  return transactData([
    {
      "document/id": documentId,
      "document/module": null,
    },
  ]);
}

export function getDocumentsByModule(moduleId: string): Array<Record<string, unknown>> {
  ensureInitialized();
  const dmap = getDocumentsMap();
  const results: Array<Record<string, unknown>> = [];

  dmap.forEach((doc) => {
    if (doc.get("moduleId") === moduleId) {
      results.push(documentMapToObject(doc));
    }
  });

  return results;
}

export function createLink(sourceDocId: string, targetDocId: string, targetTitle: string): TxReport {
  ensureInitialized();
  const now = new Date().toISOString();
  const id = generateId("link");

  return transactData([
    {
      "link/id": id,
      "link/sourceDocId": sourceDocId,
      "link/targetDocId": targetDocId,
      "link/targetTitle": targetTitle,
      "link/createdAt": now,
      "link/updatedAt": now,
    },
  ]);
}

export function deleteLink(linkId: string): TxReport {
  ensureInitialized();
  const lmap = getLinksMap();
  lmap.delete(linkId);
  return makeTxReport();
}

export function getLinksBySourceDocId(sourceDocId: string): Array<Record<string, unknown>> {
  ensureInitialized();
  const lmap = getLinksMap();
  const results: Array<Record<string, unknown>> = [];

  lmap.forEach((link) => {
    if (link.get("sourceDocId") === sourceDocId) {
      results.push(linkMapToObject(link));
    }
  });

  return results;
}

export function getLinksByTargetDocId(targetDocId: string): Array<Record<string, unknown>> {
  ensureInitialized();
  const lmap = getLinksMap();
  const results: Array<Record<string, unknown>> = [];

  lmap.forEach((link) => {
    if (link.get("targetDocId") === targetDocId) {
      results.push(linkMapToObject(link));
    }
  });

  return results;
}

export function getAllLinks(): Array<Record<string, unknown>> {
  ensureInitialized();
  const lmap = getLinksMap();
  const results: Array<Record<string, unknown>> = [];

  lmap.forEach((link) => {
    results.push(linkMapToObject(link));
  });

  return results;
}

export function createBlockReference(blockId: string, sourceDocId: string, sourceBlockContent: string, targetDocId: string): TxReport {
  ensureInitialized();
  const now = new Date().toISOString();
  const id = generateId("blockRef");

  return transactData([
    {
      "blockReference/id": id,
      "blockReference/blockId": blockId,
      "blockReference/sourceDocId": sourceDocId,
      "blockReference/sourceBlockContent": sourceBlockContent,
      "blockReference/targetDocId": targetDocId,
      "blockReference/createdAt": now,
      "blockReference/updatedAt": now,
    },
  ]);
}

export function deleteBlockReference(blockRefId: string): TxReport {
  ensureInitialized();
  const bmap = getBlockReferencesMap();
  bmap.delete(blockRefId);
  return makeTxReport();
}

export function getBlockReferencesBySourceDocId(sourceDocId: string): Array<Record<string, unknown>> {
  ensureInitialized();
  const bmap = getBlockReferencesMap();
  const results: Array<Record<string, unknown>> = [];

  bmap.forEach((blockRef) => {
    if (blockRef.get("sourceDocId") === sourceDocId) {
      results.push(blockReferenceMapToObject(blockRef));
    }
  });

  return results;
}

export function getBlockReferencesByTargetDocId(targetDocId: string): Array<Record<string, unknown>> {
  ensureInitialized();
  const bmap = getBlockReferencesMap();
  const results: Array<Record<string, unknown>> = [];

  bmap.forEach((blockRef) => {
    if (blockRef.get("targetDocId") === targetDocId) {
      results.push(blockReferenceMapToObject(blockRef));
    }
  });

  return results;
}

export function getBlockReferencesByBlockId(blockId: string): Array<Record<string, unknown>> {
  ensureInitialized();
  const bmap = getBlockReferencesMap();
  const results: Array<Record<string, unknown>> = [];

  bmap.forEach((blockRef) => {
    if (blockRef.get("blockId") === blockId) {
      results.push(blockReferenceMapToObject(blockRef));
    }
  });

  return results;
}

export function createPdfDocument(fileName: string, fileUrl: string, fileSize: number, pageCount: number): TxReport {
  ensureInitialized();
  const now = new Date().toISOString();
  const id = generateId("pdf");

  return transactData([
    {
      "pdfDocument/id": id,
      "pdfDocument/fileName": fileName,
      "pdfDocument/fileUrl": fileUrl,
      "pdfDocument/fileSize": fileSize,
      "pdfDocument/pageCount": pageCount,
      "pdfDocument/createdAt": now,
      "pdfDocument/updatedAt": now,
    },
  ]);
}

export function deletePdfDocument(pdfId: string): TxReport {
  ensureInitialized();
  const pdfmap = getPdfDocumentsMap();
  pdfmap.delete(pdfId);

  const amap = getPdfAnnotationsMap();
  amap.forEach((annotation, annotationId) => {
    if (annotation.get("pdfId") === pdfId) {
      amap.delete(annotationId);
    }
  });

  return makeTxReport();
}

export function getPdfDocuments(): Array<Record<string, unknown>> {
  ensureInitialized();
  const pdfmap = getPdfDocumentsMap();
  const results: Array<Record<string, unknown>> = [];

  pdfmap.forEach((pdfDoc) => {
    results.push(pdfDocumentMapToObject(pdfDoc));
  });

  return results;
}

export function createPdfAnnotation(
  pdfId: string,
  pageIndex: number,
  type: "highlight" | "underline" | "strikethrough" | "text" | "rectangle" | "circle",
  position: { x: number; y: number; width: number; height: number },
  color: string,
  content?: string,
  referencedDocId?: string
): TxReport {
  ensureInitialized();
  const now = new Date().toISOString();
  const id = generateId("annotation");

  const txData: Record<string, unknown> = {
    "pdfAnnotation/id": id,
    "pdfAnnotation/pdfId": pdfId,
    "pdfAnnotation/pageIndex": pageIndex,
    "pdfAnnotation/type": type,
    "pdfAnnotation/position": position,
    "pdfAnnotation/color": color,
    "pdfAnnotation/createdAt": now,
    "pdfAnnotation/updatedAt": now,
  };

  if (content !== undefined) txData["pdfAnnotation/content"] = content;
  if (referencedDocId !== undefined) txData["pdfAnnotation/referencedDocId"] = referencedDocId;

  return transactData([txData]);
}

export function updatePdfAnnotation(
  annotationId: string,
  data: Partial<{
    content?: string;
    position?: { x: number; y: number; width: number; height: number };
    color?: string;
    referencedDocId?: string;
  }>
): TxReport {
  const now = new Date().toISOString();
  const txData: Record<string, unknown> = {
    "pdfAnnotation/id": annotationId,
    "pdfAnnotation/updatedAt": now,
  };

  if (data.content !== undefined) txData["pdfAnnotation/content"] = data.content;
  if (data.position !== undefined) txData["pdfAnnotation/position"] = data.position;
  if (data.color !== undefined) txData["pdfAnnotation/color"] = data.color;
  if (data.referencedDocId !== undefined) txData["pdfAnnotation/referencedDocId"] = data.referencedDocId;

  return transactData([txData]);
}

export function deletePdfAnnotation(annotationId: string): TxReport {
  ensureInitialized();
  const amap = getPdfAnnotationsMap();
  amap.delete(annotationId);
  return makeTxReport();
}

export function getPdfAnnotationsByPdfId(pdfId: string): Array<Record<string, unknown>> {
  ensureInitialized();
  const amap = getPdfAnnotationsMap();
  const results: Array<Record<string, unknown>> = [];

  amap.forEach((annotation) => {
    if (annotation.get("pdfId") === pdfId) {
      results.push(pdfAnnotationMapToObject(annotation));
    }
  });

  return results;
}

export function getPdfAnnotationsByReferencedDocId(docId: string): Array<Record<string, unknown>> {
  ensureInitialized();
  const amap = getPdfAnnotationsMap();
  const results: Array<Record<string, unknown>> = [];

  amap.forEach((annotation) => {
    if (annotation.get("referencedDocId") === docId) {
      results.push(pdfAnnotationMapToObject(annotation));
    }
  });

  return results;
}

export interface DocumentTreeNode {
  id: string;
  title: string;
  parentId: string | null;
  order: number;
  children: DocumentTreeNode[];
}

export function getAllDocuments(): Array<Record<string, unknown>> {
  ensureInitialized();
  const dmap = getDocumentsMap();
  const results: Array<Record<string, unknown>> = [];

  dmap.forEach((doc) => {
    results.push(documentMapToObject(doc));
  });

  return results;
}

export function getDocumentById(docId: string): Record<string, unknown> | null {
  ensureInitialized();
  const dmap = getDocumentsMap();
  const doc = dmap.get(docId);
  if (!doc) return null;
  return documentMapToObject(doc);
}

export function getChildDocuments(parentId: string | null): Array<Record<string, unknown>> {
  ensureInitialized();
  const dmap = getDocumentsMap();
  const results: Array<Record<string, unknown>> = [];

  dmap.forEach((doc) => {
    const docParentId = doc.get("parentId");
    if (parentId === null) {
      if (docParentId === undefined || docParentId === null) {
        results.push(documentMapToObject(doc));
      }
    } else {
      if (docParentId === parentId) {
        results.push(documentMapToObject(doc));
      }
    }
  });

  return results.sort((a, b) => {
    const orderA = (a["document/order"] as number) ?? 0;
    const orderB = (b["document/order"] as number) ?? 0;
    return orderA - orderB;
  });
}

export function getDocumentTree(): DocumentTreeNode[] {
  ensureInitialized();
  const allDocs = getAllDocuments();
  const docMap = new Map<string, DocumentTreeNode>();

  allDocs.forEach((doc) => {
    const id = doc["document/id"] as string;
    docMap.set(id, {
      id,
      title: (doc["document/title"] as string) || "Untitled",
      parentId: (doc["document/parentId"] as string | null) ?? null,
      order: (doc["document/order"] as number) ?? 0,
      children: [],
    });
  });

  const rootNodes: DocumentTreeNode[] = [];

  docMap.forEach((node) => {
    if (node.parentId && docMap.has(node.parentId)) {
      const parent = docMap.get(node.parentId)!;
      parent.children.push(node);
    } else {
      rootNodes.push(node);
    }
  });

  const sortChildren = (nodes: DocumentTreeNode[]) => {
    nodes.sort((a, b) => a.order - b.order);
    nodes.forEach((node) => sortChildren(node.children));
  };

  sortChildren(rootNodes);
  return rootNodes;
}

export function updateDocumentParent(docId: string, newParentId: string | null, newOrder: number): TxReport {
  const now = new Date().toISOString();
  return transactData([
    {
      "document/id": docId,
      "document/parentId": newParentId,
      "document/order": newOrder,
      "document/updatedAt": now,
    },
  ]);
}

export function updateDocumentOrder(docId: string, newOrder: number): TxReport {
  const now = new Date().toISOString();
  return transactData([
    {
      "document/id": docId,
      "document/order": newOrder,
      "document/updatedAt": now,
    },
  ]);
}

export function moveDocument(docId: string, newParentId: string | null, newOrder: number): TxReport {
  return updateDocumentParent(docId, newParentId, newOrder);
}

export function reorderSiblings(parentId: string | null, orderedIds: string[]): TxReport {
  ensureInitialized();
  const now = new Date().toISOString();
  const txDataArray: Record<string, unknown>[] = orderedIds.map((id, index) => ({
    "document/id": id,
    "document/parentId": parentId,
    "document/order": index,
    "document/updatedAt": now,
  }));

  return transactData(txDataArray);
}

export function deleteDocument(docId: string): TxReport {
  ensureInitialized();
  const dmap = getDocumentsMap();
  
  const deleteRecursive = (id: string) => {
    const children = getChildDocuments(id);
    children.forEach((child) => {
      const childId = child["document/id"] as string;
      if (childId) deleteRecursive(childId);
    });
    dmap.delete(id);
  };

  deleteRecursive(docId);
  return makeTxReport();
}

function getSlackIntegrationsMap(): Y.Map<Y.Map<unknown>> {
  ensureInitialized();
  return slackIntegrationsMap!;
}

export function saveSlackIntegration(data: SlackIntegration): TxReport {
  ensureInitialized();
  const now = new Date().toISOString();
  const txData: Record<string, unknown> = {
    "slackIntegration/id": data.id,
    "slackIntegration/teamId": data.teamId,
    "slackIntegration/teamName": data.teamName,
    "slackIntegration/accessToken": data.accessToken,
    "slackIntegration/botToken": data.botToken,
    "slackIntegration/installedAt": data.installedAt,
    "slackIntegration/updatedAt": now,
    "slackIntegration/enabledFeatures": data.enabledFeatures,
  };

  if (data.refreshToken !== undefined) txData["slackIntegration/refreshToken"] = data.refreshToken;
  if (data.expiresAt !== undefined) txData["slackIntegration/expiresAt"] = data.expiresAt;
  if (data.defaultChannel !== undefined) txData["slackIntegration/defaultChannel"] = data.defaultChannel;

  return transactData([txData]);
}

export function getSlackIntegration(teamId: string): SlackIntegration | null {
  ensureInitialized();
  const smap = getSlackIntegrationsMap();
  const map = smap.get(teamId);
  if (!map) return null;

  return {
    id: map.get("id") as string,
    teamId: map.get("teamId") as string,
    teamName: map.get("teamName") as string,
    accessToken: map.get("accessToken") as string,
    botToken: map.get("botToken") as string,
    refreshToken: map.get("refreshToken") as string | undefined,
    expiresAt: map.get("expiresAt") as number | undefined,
    installedAt: map.get("installedAt") as string,
    updatedAt: map.get("updatedAt") as string,
    defaultChannel: map.get("defaultChannel") as string | undefined,
    enabledFeatures: (map.get("enabledFeatures") as SlackIntegration["enabledFeatures"]) || [],
  };
}

export function getAllSlackIntegrations(): SlackIntegration[] {
  ensureInitialized();
  const smap = getSlackIntegrationsMap();
  const results: SlackIntegration[] = [];

  smap.forEach((map) => {
    results.push({
      id: map.get("id") as string,
      teamId: map.get("teamId") as string,
      teamName: map.get("teamName") as string,
      accessToken: map.get("accessToken") as string,
      botToken: map.get("botToken") as string,
      refreshToken: map.get("refreshToken") as string | undefined,
      expiresAt: map.get("expiresAt") as number | undefined,
      installedAt: map.get("installedAt") as string,
      updatedAt: map.get("updatedAt") as string,
      defaultChannel: map.get("defaultChannel") as string | undefined,
      enabledFeatures: (map.get("enabledFeatures") as SlackIntegration["enabledFeatures"]) || [],
    });
  });

  return results;
}

export function deleteSlackIntegration(teamId: string): TxReport {
  ensureInitialized();
  const smap = getSlackIntegrationsMap();
  smap.delete(teamId);
  return makeTxReport();
}

export function updateDocumentTitle(docId: string, title: string): TxReport {
  const now = new Date().toISOString();
  return transactData([
    {
      "document/id": docId,
      "document/title": title,
      "document/updatedAt": now,
    },
  ]);
}

export function updateDocumentContent(
  docId: string,
  content: string,
  markdown: string,
  html: string
): TxReport {
  const now = new Date().toISOString();
  return transactData([
    {
      "document/id": docId,
      "document/content": content,
      "document/markdown": markdown,
      "document/html": html,
      "document/updatedAt": now,
    },
  ]);
}
