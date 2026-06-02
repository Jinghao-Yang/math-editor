import { NextResponse } from "next/server";

const OUTLINE_API_URL = process.env.OUTLINE_API_URL;
const OUTLINE_API_TOKEN = process.env.OUTLINE_API_TOKEN;

const ALLOWED_ENDPOINTS = [
  "/documents.create",
  "/documents.info",
  "/documents.update",
  "/documents.delete",
  "/documents.list",
];

function validateEnv(): void {
  if (!OUTLINE_API_URL) {
    throw new Error("Missing OUTLINE_API_URL environment variable");
  }
  if (!OUTLINE_API_TOKEN) {
    throw new Error("Missing OUTLINE_API_TOKEN environment variable");
  }
}

function validateEndpoint(endpoint: string): void {
  if (!ALLOWED_ENDPOINTS.includes(endpoint)) {
    throw new Error(`Unauthorized endpoint: ${endpoint}`);
  }
}

async function proxyToOutline(
  method: string,
  endpoint: string,
  body?: Record<string, unknown>
) {
  validateEnv();

  const url = `${OUTLINE_API_URL.replace(/\/$/, "")}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${OUTLINE_API_TOKEN}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Outline API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json();
}

async function handleRequest(
  req: Request,
  method: string
): Promise<Response> {
  try {
    let endpoint: string;
    let body: Record<string, unknown> | undefined;

    if (method === "GET" || method === "DELETE") {
      const { searchParams } = new URL(req.url);
      endpoint = searchParams.get("endpoint") || "";
    } else {
      const data = await req.json();
      endpoint = data.endpoint || "";
      body = { ...data };
      delete body.endpoint;
    }

    if (!endpoint) {
      return NextResponse.json({ error: "Missing endpoint parameter" }, { status: 400 });
    }

    validateEndpoint(endpoint);

    const data = await proxyToOutline(method, endpoint, body);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request): Promise<Response> {
  return handleRequest(req, "POST");
}

export async function GET(req: Request): Promise<Response> {
  return handleRequest(req, "GET");
}

export async function PUT(req: Request): Promise<Response> {
  return handleRequest(req, "PUT");
}

export async function DELETE(req: Request): Promise<Response> {
  return handleRequest(req, "DELETE");
}