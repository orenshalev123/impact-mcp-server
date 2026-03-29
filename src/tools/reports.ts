/**
 * Impact.com Reporting & Export tools.
 * Handles async report/click exports via the Jobs system.
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ImpactClient } from "../client.js";

export function registerReportTools(server: McpServer, client: ImpactClient) {
  server.tool(
    "list_reports",
    "List all available report templates in your Impact account",
    {},
    async () => {
      const data = await client.request<Record<string, unknown>>("/Reports");
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "get_report_metadata",
    "Get metadata and available columns for a specific report template",
    {
      reportId: z.string().describe("The report template ID"),
    },
    async ({ reportId }) => {
      const data = await client.request<Record<string, unknown>>(
        `/Reports/${reportId}/MetaData`
      );
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "export_report",
    "Schedule an async report export as CSV. Returns a job URI to poll. Limited to 100/day.",
    {
      reportId: z.string().describe("The report template ID"),
      startDate: z.string().describe("Start date (YYYY-MM-DD)"),
      endDate: z.string().describe("End date (YYYY-MM-DD)"),
    },
    async (params) => {
      const data = await client.request<Record<string, unknown>>(
        "/ReportExport",
        {
          params: {
            ReportId: params.reportId,
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

  server.tool(
    "export_clicks",
    "Schedule an async click export as CSV. Limited to 10/day.",
    {
      programId: z.string().describe("The program/campaign ID"),
      startDate: z.string().describe("Start date (YYYY-MM-DD)"),
      endDate: z.string().describe("End date (YYYY-MM-DD)"),
    },
    async (params) => {
      const data = await client.request<Record<string, unknown>>(
        `/Programs/${params.programId}/ClickExport`,
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

  server.tool(
    "list_jobs",
    "List all async export jobs (report and click exports)",
    {},
    async () => {
      const data = await client.request<Record<string, unknown>>("/Jobs");
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "get_job_status",
    "Check the status of an async export job",
    {
      jobId: z.string().describe("The job ID"),
    },
    async ({ jobId }) => {
      const data = await client.request<Record<string, unknown>>(
        `/Jobs/${jobId}`
      );
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "download_job",
    "Download the result of a completed export job",
    {
      jobId: z.string().describe("The job ID"),
    },
    async ({ jobId }) => {
      const data = await client.request<Record<string, unknown>>(
        `/Jobs/${jobId}/Download`
      );
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}
