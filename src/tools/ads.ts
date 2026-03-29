/**
 * Impact.com Ads & Creative tools.
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ImpactClient } from "../client.js";

export function registerAdTools(server: McpServer, client: ImpactClient) {
  server.tool(
    "list_ads",
    "List all ads/creative assets (banners, coupons, text links)",
    {
      campaignId: z.string().optional().describe("Filter by campaign ID"),
      type: z
        .enum(["BANNER", "COUPON", "TEXT_LINK"])
        .optional()
        .describe("Filter by ad type"),
    },
    async (params) => {
      const data = await client.request<Record<string, unknown>>("/Ads", {
        params: {
          CampaignId: params.campaignId,
          Type: params.type,
        },
      });
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "get_ad",
    "Get details for a specific ad/creative",
    {
      adId: z.string().describe("The ad ID"),
    },
    async ({ adId }) => {
      const data = await client.request<Record<string, unknown>>(`/Ads/${adId}`);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "get_tracking_link",
    "Get the tracking link for a specific ad",
    {
      adId: z.string().describe("The ad ID"),
    },
    async ({ adId }) => {
      const data = await client.request<Record<string, unknown>>(
        `/Ads/${adId}/TrackingLink`
      );
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "create_tracking_link",
    "Create a new tracking link for a partner in a program",
    {
      programId: z.string().describe("The program/campaign ID"),
      mediaPartnerId: z.string().describe("The media partner ID"),
      landingPage: z.string().optional().describe("Deep link destination URL"),
    },
    async (params) => {
      const data = await client.request<Record<string, unknown>>(
        `/Programs/${params.programId}/TrackingLinks`,
        {
          method: "POST",
          params: {
            MediaPartnerId: params.mediaPartnerId,
          },
          body: params.landingPage
            ? { LandingPage: params.landingPage }
            : undefined,
        }
      );
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}
