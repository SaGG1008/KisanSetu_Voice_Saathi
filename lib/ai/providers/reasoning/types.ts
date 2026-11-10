export interface ReasoningRequest {
  prompt: string;
  language: string;
  context?: string[];
}

export interface ReasoningResponse {
  response: string;
  source?: {
    title: string;
    publisher: string;
    verified: boolean;
  };
  provider: string;
}

export interface ReasoningProvider {
  name: string;
  generateResponse(request: ReasoningRequest): Promise<ReasoningResponse>;
}
