/**
 * Impact.com Campaigns/Programs tools.
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ImpactClient } from "../client.js";

export function registerCampaignTools(server: McpServer, client: ImpactClient) {
  server.tool(
    "list_campaigns",
    "List all campaigns/programs in your Impact account",
    {},
    async () => {
      const data = await client.request<Record<string, unknown>>("/Campaigns");
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "get_campaign",
    "Get details for a specific campaign/program",
    {
      campaignId: z.string().describe("The campaign ID"),
    },
    async ({ campaignId }) => {
      const data = await client.request<Record<string, unknown>>(
        `/Campaigns/${campaignId}`
      );
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}
