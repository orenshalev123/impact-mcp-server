/**
 * Barrel file — registers all Impact.com tool categories.
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ImpactClient } from "../client.js";
import { registerActionTools } from "./actions.js";
import { registerPartnerTools } from "./partners.js";
import { registerCampaignTools } from "./campaigns.js";
import { registerAdTools } from "./ads.js";
import { registerDealTools } from "./deals.js";
import { registerReportTools } from "./reports.js";
import { registerFinancialTools } from "./financial.js";
import { registerConversionTools } from "./conversions.js";

export function registerAllTools(server: McpServer, client: ImpactClient) {
  registerActionTools(server, client);
  registerPartnerTools(server, client);
  registerCampaignTools(server, client);
  registerAdTools(server, client);
  registerDealTools(server, client);
  registerReportTools(server, client);
  registerFinancialTools(server, client);
  registerConversionTools(server, client);
}
