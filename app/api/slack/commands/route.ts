import { NextRequest, NextResponse } from "next/server";
import { handleSlashCommand } from "@/lib/slack";
import type { SlackCommand } from "@/lib/slack/commands";

export async function POST(request: NextRequest) {
  const body = await request.formData();

  const signature = request.headers.get("x-slack-signature") || "";
  const timestamp = request.headers.get("x-slack-request-timestamp") || "";

  if (!verifySignature(signature, timestamp, await request.text())) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const command: SlackCommand = {
    team_id: body.get("team_id")?.toString() || "",
    channel_id: body.get("channel_id")?.toString() || "",
    command: body.get("command")?.toString() || "",
    text: body.get("text")?.toString() || "",
    user_id: body.get("user_id")?.toString() || "",
  };

  const response = await handleSlashCommand(command);
  return NextResponse.json(response);
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