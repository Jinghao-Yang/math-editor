import { SlackClient } from "./client";
import type { KnownBlock } from "@slack/web-api";

export interface SlackEvent {
  type: string;
  team_id: string;
  channel?: string;
  links?: Array<{ url: string }>;
  subtype?: string;
}

export async function handleSlackEvent(event: SlackEvent) {
  const { type, team_id } = event;

  if (type === "link_shared") {
    return handleLinkShared(event, team_id);
  }

  if (type === "message" && event.subtype === "message_changed") {
    return handleMessageChanged(event, team_id);
  }

  return { status: "ignored" };
}

async function handleLinkShared(event: SlackEvent, teamId: string) {
  const client = await SlackClient.forTeam(teamId);
  if (!client) return;

  const links = event.links || [];
  for (const link of links) {
    const url = link.url;
    const docIdMatch = url.match(/doc=([^&]+)/);

    if (docIdMatch) {
      const docId = decodeURIComponent(docIdMatch[1]);
      const doc = await getDocumentInfo(docId);
      if (doc) {
        const blocks: KnownBlock[] = [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${doc.title}*\n${doc.description || "暂无描述"}`,
            },
          },
        ];
        await client.sendMessage(event.channel || "", `📄 *${doc.title}*`, blocks as any);
      }
    }
  }
}

async function handleMessageChanged(event: SlackEvent, teamId: string) {
}

async function getDocumentInfo(docId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/outline/documents/${docId}`);
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error("Failed to get document info:", error);
  }
  return null;
}