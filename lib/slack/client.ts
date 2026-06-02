import { WebClient, type Block } from "@slack/web-api";
import { getSlackIntegration, saveSlackIntegration } from "@/lib/store/db";
import type { SlackIntegration } from "@/lib/store/types";
import { search } from "@/lib/search/indexer";

export class SlackClient {
  private webClient: WebClient;
  private teamId: string;

  constructor(teamId: string, token: string) {
    this.teamId = teamId;
    this.webClient = new WebClient(token);
  }

  static async forTeam(teamId: string): Promise<SlackClient | null> {
    const integration = getSlackIntegration(teamId);
    if (!integration) return null;

    if (integration.expiresAt && integration.expiresAt < Date.now() / 1000) {
      await this.refreshToken(integration);
    }

    return new SlackClient(teamId, integration.botToken || integration.accessToken);
  }

  async sendMessage(channel: string, text: string, blocks?: Block[]) {
    return this.webClient.chat.postMessage({
      channel,
      text,
      blocks,
    });
  }

  async searchDocuments(query: string): Promise<Array<{ title: string; snippet: string; url: string }>> {
    const results = search(query, 5);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    
    return results.map((r) => ({
      title: r.title,
      snippet: r.snippet,
      url: `${baseUrl}/knowledge-base?doc=${r.docId}`,
    }));
  }

  private static async refreshToken(integration: SlackIntegration) {
    if (!integration.refreshToken) return;

    try {
      const params = new URLSearchParams({
        grant_type: "refresh_token",
        client_id: process.env.SLACK_CLIENT_ID || "",
        client_secret: process.env.SLACK_CLIENT_SECRET || "",
        refresh_token: integration.refreshToken,
      });

      const response = await fetch("https://slack.com/api/oauth.v2.access", {
        method: "POST",
        body: params,
      });

      const data = await response.json();

      if (data.ok) {
        integration.accessToken = data.access_token;
        integration.botToken = data.bot_token || integration.botToken;
        integration.refreshToken = data.refresh_token;
        integration.expiresAt = data.expires_at;
        integration.updatedAt = new Date().toISOString();
        saveSlackIntegration(integration);
      }
    } catch (error) {
      console.error("Slack token refresh failed:", error);
    }
  }
}