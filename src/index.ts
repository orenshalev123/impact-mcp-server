#!/usr/bin/env node

/**
 * Impact.com MCP Server
 *
 * Provides AI tools for managing your Impact.com affiliate program:
 * actions, partners, campaigns, ads, deals, promo codes, reports, and invoices.
 *
 * Environment variables:
 *   IMPACT_ACCOUNT_SID - Your Impact.com Account SID
 *   IMPACT_AUTH_TOKEN   - Your Impact.com Auth Token
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createClient } from "./client.js";
import { registerAllTools } from "./tools/index.js";

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required environment variable: ${name}`);
    console.error(
      "Set IMPACT_ACCOUNT_SID and IMPACT_AUTH_TOKEN in your MCP config."
    );
    process.exit(1);
  }
  return value;
}

async function main() {
  const accountSid = getRequiredEnv("IMPACT_ACCOUNT_SID");
  const authToken = getRequiredEnv("IMPACT_AUTH_TOKEN");

  const client = createClient({ accountSid, authToken });

  const server = new McpServer({
    name: "impact-mcp-server",
    version: "1.0.0",
  });

  registerAllTools(server, client);

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
