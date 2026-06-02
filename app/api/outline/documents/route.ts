import { outlineClient } from "@/lib/outline/client";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url);
    const collectionId = searchParams.get("collectionId") || undefined;

    const documents = await outlineClient.listDocuments(collectionId);
    return NextResponse.json({ data: documents });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { title, text, collectionId } = await req.json();

    if (!title || !text) {
      return NextResponse.json(
        { error: "Missing required fields: title and text" },
        { status: 400 }
      );
    }

    const document = await outlineClient.createDocument(title, text, collectionId);
    return NextResponse.json({ data: document });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
