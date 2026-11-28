export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly retryable = false,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Runtime-neutral sleep: works under Bun, Node (Vitest) and fake timers.
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

interface HttpClientOptions {
  baseUrl: string;
  headers: Record<string, string>;
  timeoutMs?: number;
}

export class HttpClient {
  constructor(private readonly options: HttpClientOptions) {}

  /**
   * An expanded get function, offering a streamlined way of setting url params for API requests,
   * built in exponential backoff and request cap.
   * @param path the target http(s) endpoint path your desired resource is located
   * @param params A key-value record of parameters to be serialised into search params
   * @param text For when you expect the returned content to be plaintext (such as the UEX the `/data_export` route)
   * @returns
   */
  async get<T>(
    path: string,
    params?: Record<string, string | number | undefined>,
    text = false,
  ): Promise<T | string> {
    const url = new URL(path, this.options.baseUrl);

    for (const [k, v] of Object.entries(params ?? {})) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }

    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...this.options.headers,
          },
          signal: AbortSignal.timeout(this.options.timeoutMs ?? 10000),
        });
        if (response.ok && !text) {
          return (await response.json()) as T;
        } else if (response.ok && text) {
          return await response.text();
        }

        const retryable = response.status === 429 || response.status >= 500;

        if (!retryable || attempt === maxAttempts) {
          throw new ApiError(`API Request failed: ${response.status}`, response.status, retryable);
        }

        const retryAfter = Number(response.headers.get("retry-after"));

        const delay =
          Number.isFinite(retryAfter) && retryAfter > 0
            ? Math.min(retryAfter * 1000, 30000)
            : Math.min(500 * 2 ** (attempt - 1), 5000);
        await sleep(delay);
      } catch (err) {
        if (err instanceof ApiError) throw err;
        if (attempt === maxAttempts) {
          throw new ApiError(`API request failed: ${String(err)}`, undefined, true);
        }
        await sleep(500 * 2 ** (attempt - 1));
      }
    }
    throw new ApiError("Request attempts exhausted");
  }
}
