import { SlackClient } from "./client";

export interface SlackCommand {
  team_id: string;
  channel_id: string;
  command: string;
  text: string;
  user_id: string;
}

export async function handleSlashCommand(command: SlackCommand) {
  const { team_id, command: cmd, text } = command;

  if (cmd !== "/math-search") {
    return {
      response_type: "ephemeral",
      text: "未知命令",
    };
  }

  const client = await SlackClient.forTeam(team_id);
  if (!client) {
    return {
      response_type: "ephemeral",
      text: "请先安装 Slack 集成",
    };
  }

  if (!text.trim()) {
    return {
      response_type: "ephemeral",
      text: "请输入搜索关键词",
    };
  }

  const results = await client.searchDocuments(text);

  if (results.length === 0) {
    return {
      response_type: "in_channel",
      text: `未找到包含 "${text}" 的文档`,
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
    text: `找到 ${results.length} 个相关文档`,
    blocks,
  };
}