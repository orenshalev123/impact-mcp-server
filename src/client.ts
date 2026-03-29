/**
 * Impact.com API client with Basic Auth and rate limit handling.
 */

export interface ImpactConfig {
  readonly accountSid: string;
  readonly authToken: string;
  readonly baseUrl?: string;
}

export interface PaginatedResponse<T> {
  readonly items: readonly T[];
  readonly totalCount: number;
  readonly pageSize: number;
  readonly page: number;
}

export class ImpactApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body: string
  ) {
    super(message);
    this.name = "ImpactApiError";
  }
}

export class RateLimitError extends ImpactApiError {
  constructor(
    public readonly retryAfterSeconds: number,
    body: string
  ) {
    super(`Rate limited. Retry after ${retryAfterSeconds} seconds.`, 429, body);
    this.name = "RateLimitError";
  }
}

export function createClient(config: ImpactConfig) {
  const baseUrl = config.baseUrl ?? "https://api.impact.com";
  const credentials = Buffer.from(
    `${config.accountSid}:${config.authToken}`
  ).toString("base64");

  async function request<T>(
    path: string,
    options: {
      readonly method?: string;
      readonly params?: Record<string, string | undefined>;
      readonly body?: Record<string, unknown>;
    } = {}
  ): Promise<T> {
    const method = options.method ?? "GET";
    const url = new URL(
      `/Advertisers/${config.accountSid}${path}`,
      baseUrl
    );

    if (options.params) {
      for (const [key, value] of Object.entries(options.params)) {
        if (value !== undefined) {
          url.searchParams.set(key, value);
        }
      }
    }

    const headers: Record<string, string> = {
      Authorization: `Basic ${credentials}`,
      Accept: "application/json",
    };

    const fetchOptions: RequestInit = { method, headers };

    if (options.body) {
      headers["Content-Type"] = "application/json";
      fetchOptions.body = JSON.stringify(options.body);
    }

    const response = await fetch(url.toString(), fetchOptions);

    if (response.status === 429) {
      const retryAfter = parseInt(
        response.headers.get("X-RateLimit-Reset") ?? "60",
        10
      );
      throw new RateLimitError(retryAfter, await response.text());
    }

    if (!response.ok) {
      const body = await response.text();
      throw new ImpactApiError(
        `Impact API error: ${response.status} ${response.statusText}`,
        response.status,
        body
      );
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as Promise<T>;
  }

  return { request };
}

export type ImpactClient = ReturnType<typeof createClient>;
