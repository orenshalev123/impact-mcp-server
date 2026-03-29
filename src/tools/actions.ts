/**
 * Impact.com Actions (Conversions) tools.
 * Actions represent conversions attributed to affiliate partners.
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ImpactClient } from "../client.js";

export function registerActionTools(server: McpServer, client: ImpactClient) {
  server.tool(
    "list_actions",
    "List affiliate conversions/actions with filtering by state, date range, campaign, and media partner",
    {
      state: z
        .enum(["PENDING", "APPROVED", "REVERSED"])
        .optional()
        .describe("Filter by action state"),
      startDate: z
        .string()
        .optional()
        .describe("Start date in ISO 8601 format (e.g. 2026-03-01T00:00:00Z). Uses EventDate field for accurate filtering"),
      endDate: z
        .string()
        .optional()
        .describe("End date in ISO 8601 format (e.g. 2026-03-28T23:59:59Z). Max 45-day range"),
      campaignId: z
        .string()
        .optional()
        .describe("Filter by campaign/program ID"),
      mediaPartnerId: z
        .string()
        .optional()
        .describe("Filter by media partner ID"),
      pageSize: z
        .number()
        .optional()
        .describe("Results per page (2000-20000, default 20000)"),
      page: z.number().optional().describe("Page number (1-based)"),
    },
    async (params) => {
      const data = await client.request<Record<string, unknown>>("/Actions", {
        params: {
          State: params.state,
          ActionDateStart: params.startDate,
          ActionDateEnd: params.endDate,
          CampaignId: params.campaignId,
          MediaPartnerId: params.mediaPartnerId,
          PageSize: params.pageSize?.toString(),
          Page: params.page?.toString(),
        },
      });

      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "get_action",
    "Get details for a specific action/conversion by ID",
    {
      actionId: z.string().describe("The action ID to retrieve"),
    },
    async ({ actionId }) => {
      const data = await client.request<Record<string, unknown>>(
        `/Actions/${actionId}`
      );
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "update_action",
    "Update an action - approve, adjust amount, or change state. Reason codes: APPROVED, CONS_FRAUD, ITEM_RETURNED, ORDER_UPDATE, REJECTED, TEST_ACTION",
    {
      actionId: z.string().describe("The action ID to update"),
      state: z
        .enum(["APPROVED", "REVERSED"])
        .describe("New state for the action"),
      reason: z
        .enum([
          "APPROVED",
          "CONS_FRAUD",
          "ITEM_RETURNED",
          "ORDER_UPDATE",
          "REJECTED",
          "TEST_ACTION",
        ])
        .describe("Reason code for the update"),
      amount: z.number().optional().describe("New amount if adjusting"),
    },
    async (params) => {
      const body: Record<string, unknown> = {
        State: params.state,
        Reason: params.reason,
      };
      if (params.amount !== undefined) {
        body.Amount = params.amount;
      }

      const data = await client.request<Record<string, unknown>>(
        `/Actions/${params.actionId}`,
        { method: "PUT", body }
      );
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "get_action_items",
    "List line items within a specific action (order-level detail)",
    {
      actionId: z.string().describe("The action ID"),
    },
    async ({ actionId }) => {
      const data = await client.request<Record<string, unknown>>(
        `/Actions/${actionId}/Items`
      );
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "list_action_updates",
    "List history of action updates/modifications",
    {
      startDate: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      endDate: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async (params) => {
      const data = await client.request<Record<string, unknown>>(
        "/ActionUpdates",
        {
          params: {
            StartDate: params.startDate,
            EndDate: params.endDate,
          },
        }
      );
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}
