import { ReasoningRequest, ReasoningResponse, ReasoningProvider } from "./types";
import { generateStructuredGuidance, StructuredAnswer } from "../../../knowledge/retrieval";

export class StructuredAgriculturalProvider implements ReasoningProvider {
  name = "KisanSetu-Structured-Reasoning-Engine";

  async generateResponse(request: ReasoningRequest): Promise<ReasoningResponse> {
    const structured: StructuredAnswer = generateStructuredGuidance(request.prompt, request.language);

    // Format structured response cleanly for chat & voice rendering
    let formattedResponse = structured.answer;
    if (structured.recommendedActions && structured.recommendedActions.length > 0) {
      formattedResponse += "\n\n📌 Recommended Actions:\n• " + structured.recommendedActions.join("\n• ");
    }
    if (structured.precautions && structured.precautions.length > 0) {
      formattedResponse += "\n\n⚠️ Precautions:\n• " + structured.precautions.join("\n• ");
    }
    if (structured.followUpQuestion) {
      formattedResponse += "\n\n❓ " + structured.followUpQuestion;
    }

    return {
      response: formattedResponse,
      source: structured.source,
      provider: this.name,
    };
  }
}

let activeProvider: ReasoningProvider = new StructuredAgriculturalProvider();

export function setReasoningProvider(provider: ReasoningProvider) {
  activeProvider = provider;
}

export function getReasoningProvider(): ReasoningProvider {
  return activeProvider;
}
