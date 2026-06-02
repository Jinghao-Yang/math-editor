import { SlackClient } from "./client";
import { getAllSlackIntegrations } from "@/lib/store/db";
import type { Document } from "@/lib/store/types";
import type { KnownBlock } from "@slack/web-api";

export async function sendDocumentUpdateNotification(
  doc: Document,
  action: "created" | "updated" | "deleted"
) {
  const integrations = getAllSlackIntegrations();

  for (const integration of integrations) {
    if (!integration.enabledFeatures.includes("notifications")) continue;
    if (!integration.defaultChannel) continue;

    const client = new SlackClient(integration.teamId, integration.botToken);

    const actionText = {
      created: "创建了新文档",
      updated: "更新了文档",
      deleted: "删除了文档",
    };

    const blocks: KnownBlock[] = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `📝 *${actionText[action]}:* <${getDocUrl(doc.id)}|${doc.title}>`,
        },
      },
    ];

    try {
      await client.sendMessage(integration.defaultChannel, "", blocks as any);
    } catch (error) {
      console.error("Failed to send Slack notification:", error);
    }
  }
}

function getDocUrl(docId: string): string {
  return `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/knowledge-base?doc=${docId}`;
}