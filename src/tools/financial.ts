/**
 * Impact.com Financial tools - invoices and contracts.
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ImpactClient } from "../client.js";

export function registerFinancialTools(
  server: McpServer,
  client: ImpactClient
) {
  server.tool(
    "list_invoices",
    "List all invoices in your Impact account",
    {},
    async () => {
      const data = await client.request<Record<string, unknown>>("/Invoices");
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "get_invoice",
    "Get details for a specific invoice",
    {
      invoiceId: z.string().describe("The invoice ID"),
    },
    async ({ invoiceId }) => {
      const data = await client.request<Record<string, unknown>>(
        `/Invoices/${invoiceId}`
      );
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "list_contracts",
    "List all partner contracts",
    {},
    async () => {
      const data = await client.request<Record<string, unknown>>("/Contracts");
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "get_contract",
    "Get details for a specific contract",
    {
      contractId: z.string().describe("The contract ID"),
    },
    async ({ contractId }) => {
      const data = await client.request<Record<string, unknown>>(
        `/Contracts/${contractId}`
      );
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}
