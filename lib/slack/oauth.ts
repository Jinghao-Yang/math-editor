import { saveSlackIntegration } from "@/lib/store/db";
import type { SlackFeature } from "@/lib/store/types";

export async function handleOAuthCallback(code: string, state: string) {
  const params = new URLSearchParams({
    code,
    client_id: process.env.SLACK_CLIENT_ID || "",
    client_secret: process.env.SLACK_CLIENT_SECRET || "",
    redirect_uri: process.env.SLACK_REDIRECT_URI || "",
    state,
  });

  const response = await fetch("https://slack.com/api/oauth.v2.access", {
    method: "POST",
    body: params,
  });

  const data = await response.json();

  if (!data.ok) {
    throw new Error(data.error || "OAuth failed");
  }

  const team = data.team as { id: string; name: string };
  const accessToken = data.access_token as string;
  const botToken = (data.bot_token as string) || accessToken;
  const refreshToken = data.refresh_token as string | undefined;
  const expiresAt = data.expires_at as number | undefined;

  const enabledFeatures: SlackFeature[] = ["search", "link_preview", "notifications"];

  await saveSlackIntegration({
    id: `slack-${team.id}`,
    teamId: team.id,
    teamName: team.name,
    accessToken,
    botToken,
    refreshToken,
    expiresAt,
    installedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    enabledFeatures,
  });

  return { team, accessToken, botToken };
}

export function getOAuthUrl() {
  const scopes = [
    "channels:read",
    "chat:write",
    "commands",
    "links:read",
    "links:write",
  ];

  const params = new URLSearchParams({
    client_id: process.env.SLACK_CLIENT_ID || "",
    scope: scopes.join(","),
    redirect_uri: process.env.SLACK_REDIRECT_URI || "",
    state: generateState(),
  });

  return `https://slack.com/oauth/v2/authorize?${params.toString()}`;
}

function generateState(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}