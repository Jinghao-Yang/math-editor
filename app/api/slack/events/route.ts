import { NextRequest, NextResponse } from "next/server";
import { handleSlackEvent } from "@/lib/slack";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("x-slack-signature") || "";
  const timestamp = request.headers.get("x-slack-request-timestamp") || "";
  const rawBody = await request.text();

  if (!verifySignature(signature, timestamp, rawBody)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const body = JSON.parse(rawBody);

  if (body.type === "url_verification") {
    return NextResponse.json({ challenge: body.challenge });
  }

  await handleSlackEvent(body.event);
  return NextResponse.json({ status: "ok" });
}

function verifySignature(signature: string, timestamp: string, body: string): boolean {
  if (!process.env.SLACK_SIGNING_SECRET) {
    return true;
  }

  const hmac = require("crypto").createHmac("sha256", process.env.SLACK_SIGNING_SECRET);
  const baseString = `v0:${timestamp}:${body}`;
  const expectedSignature = `v0=${hmac.update(baseString).digest("hex")}`;

  return signature === expectedSignature;
}