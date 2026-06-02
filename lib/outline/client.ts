interface OutlineDocument {
  id: string;
  title: string;
  text: string;
  collectionId?: string;
  url?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface OutlineListResponse {
  data: OutlineDocument[];
  pagination?: {
    limit: number;
    offset: number;
    total: number;
  };
}

interface OutlineSingleResponse {
  data: OutlineDocument;
}

export class HttpError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public responseText: string
  ) {
    super(`HTTP Error: ${status} ${statusText}`);
    this.name = "HttpError";
  }
}

export class NetworkError extends Error {
  constructor(message: string, public cause: unknown) {
    super(message);
    this.name = "NetworkError";
    this.cause = cause;
  }
}

class OutlineClient {
  private async request<T>(
    method: string,
    endpoint: string,
    body?: Record<string, unknown>
  ): Promise<T> {
    try {
      const response = await fetch("/api/outline", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ endpoint, ...body }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new HttpError(response.status, response.statusText, errorText);
      }

      return response.json() as Promise<T>;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new NetworkError("Failed to connect to Outline API", error);
    }
  }

  async createDocument(
    title: string,
    text: string,
    collectionId?: string
  ): Promise<OutlineDocument> {
    const body: Record<string, unknown> = { title, text };
    if (collectionId) {
      body.collectionId = collectionId;
    }
    const response = await this.request<OutlineSingleResponse>("POST", "/documents.create", body);
    return response.data;
  }

  async getDocument(id: string): Promise<OutlineDocument> {
    const response = await this.request<OutlineSingleResponse>("POST", "/documents.info", { id });
    return response.data;
  }

  async updateDocument(
    id: string,
    title?: string,
    text?: string
  ): Promise<OutlineDocument> {
    const body: Record<string, unknown> = { id };
    if (title !== undefined) {
      body.title = title;
    }
    if (text !== undefined) {
      body.text = text;
    }
    const response = await this.request<OutlineSingleResponse>("POST", "/documents.update", body);
    return response.data;
  }

  async deleteDocument(id: string): Promise<void> {
    await this.request("POST", "/documents.delete", { id });
  }

  async listDocuments(collectionId?: string): Promise<OutlineDocument[]> {
    const body: Record<string, unknown> = {};
    if (collectionId) {
      body.collectionId = collectionId;
    }
    const response = await this.request<OutlineListResponse>("POST", "/documents.list", body);
    return response.data;
  }
}

export const outlineClient = new OutlineClient();
export type { OutlineDocument, OutlineListResponse, OutlineSingleResponse };
