import { SlackClient } from "./client";
import { dictionaries, type Locale } from "@/lib/i18n";

export interface SlackCommand {
  team_id: string;
  channel_id: string;
  command: string;
  text: string;
  user_id: string;
}

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

export async function handleSlashCommand(command: SlackCommand, locale: Locale = "en") {
  const { team_id, command: cmd, text } = command;

  if (cmd !== "/math-search") {
    return {
      response_type: "ephemeral",
      text: t(locale, "slack.unknownCommand"),
    };
  }

  const client = await SlackClient.forTeam(team_id);
  if (!client) {
    return {
      response_type: "ephemeral",
      text: t(locale, "slack.installFirst"),
    };
  }

  if (!text.trim()) {
    return {
      response_type: "ephemeral",
      text: t(locale, "slack.enterSearchKeyword"),
    };
  }

  const results = await client.searchDocuments(text);

  if (results.length === 0) {
    return {
      response_type: "in_channel",
      text: t(locale, "slack.noDocumentsFound", { text }),
    };
  }

  const blocks = results.map((result) => ({
    type: "section" as const,
    text: {
      type: "mrkdwn" as const,
      text: `*<${result.url}|${result.title}>*\n${result.snippet}`,
    },
  }));

  return {
    response_type: "in_channel" as const,
    text: t(locale, "slack.documentsFound", { count: results.length }),
    blocks,
  };
}