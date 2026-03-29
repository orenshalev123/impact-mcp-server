/**
 * Impact.com Conversion submission tools.
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ImpactClient } from "../client.js";

export function registerConversionTools(
  server: McpServer,
  client: ImpactClient
) {
  server.tool(
    "submit_conversion",
    "Submit a new conversion event to Impact (server-side tracking)",
    {
      campaignId: z.string().describe("Campaign ID"),
      eventTypeId: z.string().describe("Event type ID"),
      orderId: z.string().describe("Your internal order ID"),
      clickId: z
        .string()
        .optional()
        .describe("Impact click ID for attribution"),
      customerId: z.string().optional().describe("Customer identifier"),
      currencyCode: z
        .string()
        .optional()
        .describe("Currency code (e.g. USD)"),
      amount: z.number().optional().describe("Conversion amount"),
      eventDate: z
        .string()
        .optional()
        .describe("Event date (ISO 8601). Defaults to now"),
    },
    async (params) => {
      const body: Record<string, unknown> = {
        CampaignId: params.campaignId,
        EventTypeId: params.eventTypeId,
        OrderId: params.orderId,
      };

      if (params.clickId) body.ClickId = params.clickId;
      if (params.customerId) body.CustomerId = params.customerId;
      if (params.currencyCode) body.CurrencyCode = params.currencyCode;
      if (params.amount !== undefined) body.Amount = params.amount;
      if (params.eventDate) body.EventDate = params.eventDate;

      const data = await client.request<Record<string, unknown>>(
        "/Conversions",
        { method: "POST", body }
      );
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}
