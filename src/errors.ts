/**
 * MCP-compatible error formatting.
 * Returns { content, isError } so the AI client sees the error message
 * without the SDK throwing an opaque exception.
 */

import { ImpactApiError, RateLimitError } from "./client.js";

export interface ToolResult {
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
}

export function formatError(error: unknown): ToolResult {
  if (error instanceof RateLimitError) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Rate limited by Impact.com API. Retry after ${error.retryAfterSeconds} seconds.`,
        },
      ],
      isError: true,
    };
  }

  if (error instanceof ImpactApiError) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Impact API error (${error.status}): ${error.message}\n${error.body}`,
        },
      ],
      isError: true,
    };
  }

  const message =
    error instanceof Error ? error.message : "Unknown error occurred";
  return {
    content: [{ type: "text" as const, text: message }],
    isError: true,
  };
}

export function withErrorHandling<T extends readonly unknown[]>(
  fn: (...args: T) => Promise<ToolResult>
): (...args: T) => Promise<ToolResult> {
  return async (...args: T) => {
    try {
      return await fn(...args);
    } catch (error) {
      return formatError(error);
    }
  };
}
