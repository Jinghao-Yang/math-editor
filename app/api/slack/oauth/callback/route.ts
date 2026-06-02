import { NextRequest, NextResponse } from "next/server";
import { handleOAuthCallback } from "@/lib/slack";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return NextResponse.redirect(new URL("/knowledge-base?error=missing_params", request.url));
  }

  try {
    await handleOAuthCallback(code, state);
    return NextResponse.redirect(new URL("/knowledge-base?slack-connected=true", request.url));
  } catch (error) {
    console.error("Slack OAuth error:", error);
    return NextResponse.redirect(new URL("/knowledge-base?slack-error=true", request.url));
  }
}