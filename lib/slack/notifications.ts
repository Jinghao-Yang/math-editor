import { SlackClient } from "./client";
import { getAllSlackIntegrations } from "@/lib/store/db";
import type { Document } from "@/lib/store/types";
import type { KnownBlock } from "@slack/web-api";
import { dictionaries, type Locale } from "@/lib/i18n";

function t(locale: Locale, key: string, values?: Record<string, string | number>): string {
  const parts = key.split(".");
  let result: unknown = dictionaries[locale];
  for (const part of parts) {
    if (result && typeof result === "object" && part in result) {
      result = (result as Record<string, unknown>)[part];
    } else {
      return key;
    }
  }

  let message = typeof result === "string" ? result : key;

  if (values) {
    for (const [k, v] of Object.entries(values)) {
      message = message.replaceAll(`{${k}}`, String(v));
    }
  }

  return message;
}

export async function sendDocumentUpdateNotification(
  doc: Document,
  action: "created" | "updated" | "deleted",
  locale: Locale = "en"
) {
  const integrations = getAllSlackIntegrations();

  for (const integration of integrations) {
    if (!integration.enabledFeatures.includes("notifications")) continue;
    if (!integration.defaultChannel) continue;

    const client = new SlackClient(integration.teamId, integration.botToken);

    const actionText: Record<string, string> = {
      created: t(locale, "slack.notificationCreated"),
      updated: t(locale, "slack.notificationUpdated"),
      deleted: t(locale, "slack.notificationDeleted"),
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