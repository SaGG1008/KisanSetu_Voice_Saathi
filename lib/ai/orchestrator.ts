import { getReasoningProvider } from "./providers/reasoning/provider";

export async function processQueryOrchestration(query: string, language: string) {
  const provider = getReasoningProvider();
  const result = await provider.generateResponse({
    prompt: query,
    language,
  });

  return {
    answer: result.response,
    source: result.source,
    provider: result.provider,
  };
}
