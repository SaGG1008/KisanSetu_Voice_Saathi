export interface GnaniClientConfig {
  apiKeyId?: string;
  baseUrl?: string;
  timeoutMs?: number;
}

export class GnaniClient {
  private apiKeyId: string;
  private baseUrl: string;
  private timeoutMs: number;

  constructor(config?: GnaniClientConfig) {
    this.apiKeyId = config?.apiKeyId || process.env.GNANI_API_KEY_ID || "";
    this.baseUrl = config?.baseUrl || process.env.GNANI_BASE_URL || "https://api.vachana.ai";
    this.timeoutMs = config?.timeoutMs || 30000;
  }

  protected getHeaders(additionalHeaders?: Record<string, string>): Record<string, string> {
    return {
      "X-API-Key-ID": this.apiKeyId,
      ...additionalHeaders,
    };
  }

  protected getBaseUrl(): string {
    return this.baseUrl;
  }

  protected getTimeoutMs(): number {
    return this.timeoutMs;
  }
}
