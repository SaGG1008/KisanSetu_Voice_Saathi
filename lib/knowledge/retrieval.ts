import { retrieveAdvancedKnowledge, KnowledgeItem, AgriculturalSource } from "./sources";

export interface StructuredAnswer {
  answer: string;
  recommendedActions: string[];
  precautions: string[];
  source: AgriculturalSource;
  confidence: number;
  followUpQuestion?: string;
  isUnrelated?: boolean;
}

export function generateStructuredGuidance(query: string, language: string): StructuredAnswer {
  const langKey = ["mr", "hi", "en"].includes(language) ? language : "en";
  const lowerQuery = query.toLowerCase();

  // Check if query is completely unrelated to agriculture/farming
  const agricultureKeywords = [
    "crop", "pest", "tomato", "cotton", "soil", "water", "irrigation", "urea", "fertilizer",
    "soybean", "disease", "farm", "farming", "plant", "seed", "agriculture", "शेतकरी", "पीक",
    "टोमॅटो", "कापूस", "खत", "पाणी", "सिंचन", "रोग", "कीड", "सोयाबीन", "फसल", "कीट", "टमाटर",
    "कपास", "उर्वरक", "सिंचाई", "मिट्टी", "बीज", "कृषि", "यूरिया"
  ];

  const isAgriRelated = agricultureKeywords.some(kw => lowerQuery.includes(kw));

  if (!isAgriRelated && query.trim().length > 3) {
    const unrelatedResponses: Record<string, StructuredAnswer> = {
      mr: {
        answer: "मी फक्त कृषी आणि शेतीसंबंधित प्रश्नांची उत्तरे देण्यासाठी तयार केला आहे. कृपया आपल्या पिकांविषयी, खतांबद्दल किंवा शेतीबद्दल प्रश्न विचार.",
        recommendedActions: ["कृषी किंवा पिकांशी संबंधित प्रश्न विचारा."],
        precautions: ["ही प्रणाली केवळ शेती व कृषी मार्गदर्शनासाठी आहे."],
        source: { title: "KisanSetu Voice Saathi System Guidance", publisher: "KisanSetu", verified: true },
        confidence: 0.99,
        followUpQuestion: "तुमच्या शेतातील पिकाबद्दल काही अडचण आहे का?",
        isUnrelated: true,
      },
      hi: {
        answer: "मैं केवल कृषि और खेती से संबंधित प्रश्नों के उत्तर देने के लिए हूँ। कृपया अपनी फसलों, उर्वरकों या खेती के बारे में प्रश्न पूछें।",
        recommendedActions: ["कृषि या फसल से संबंधित प्रश्न पूछें।"],
        precautions: ["यह प्रणाली केवल कृषि मार्गदर्शन के लिए है।"],
        source: { title: "KisanSetu Voice Saathi System Guidance", publisher: "KisanSetu", verified: true },
        confidence: 0.99,
        followUpQuestion: "क्या आपकी फसल से जुड़ी कोई समस्या है?",
        isUnrelated: true,
      },
      en: {
        answer: "I am specifically designed to assist with agricultural and farming queries. Please ask questions related to your crops, fertilizers, irrigation, or pest management.",
        recommendedActions: ["Ask a farming or crop-related question."],
        precautions: ["This assistant is restricted to agricultural advisory."],
        source: { title: "KisanSetu Voice Saathi System Guidance", publisher: "KisanSetu", verified: true },
        confidence: 0.99,
        followUpQuestion: "Do you have any specific questions about your crops today?",
        isUnrelated: true,
      }
    };
    return unrelatedResponses[langKey] || unrelatedResponses["en"];
  }

  const { matches, source } = retrieveAdvancedKnowledge(query, langKey);

  if (matches.length > 0) {
    const item = matches[0];
    const text = item.content[langKey] || item.content["en"];

    const actionsMap: Record<string, string[]> = {
      mr: ["शिफारस केलेल्या मार्गदर्शक तत्त्वांचे पालन करा.", "गरजेनुसार कृषी अधिकाऱ्यांचा सल्ला घ्या."],
      hi: ["अनुशंसित दिशा-निर्देशों का पालन करें।", "आवश्यकतानुसार कृषि अधिकारियों की सलाह लें।"],
      en: ["Follow recommended guidelines carefully.", "Consult your local agricultural officer if symptoms persist."]
    };

    const precautionsMap: Record<string, string[]> = {
      mr: ["अतिरासायनिक फवारणी टाळा.", "सुरक्षित साधनांचा वापर करा."],
      hi: ["अतिरिक्त रासायनिक छिड़काव से बचें।", "सुरक्षा उपकरणों का उपयोग करें।"],
      en: ["Avoid excessive chemical sprays.", "Use protective gear when handling inputs."]
    };

    const followUps: Record<string, string> = {
      mr: "या उपायाबद्दल तुम्हाला आणखी काही माहिती हवी आहे का?",
      hi: "क्या आपको इस उपाय के बारे में और कोई जानकारी चाहिए?",
      en: "Would you like further details on this recommendation?"
    };

    return {
      answer: text,
      recommendedActions: actionsMap[langKey] || actionsMap["en"],
      precautions: precautionsMap[langKey] || precautionsMap["en"],
      source: item.source,
      confidence: 0.95,
      followUpQuestion: followUps[langKey] || followUps["en"],
    };
  }

  // Fallback verified general advisory
  const fallbackAnswers: Record<string, StructuredAnswer> = {
    mr: {
      answer: "आपल्या प्रश्ना संदर्भात स्थानिक कृषी विज्ञान केंद्र (KVK) किंवा कृषी अधिकाऱ्यांशी संपर्क साधावा. पिकांची योग्य पाहणी करून उपचार करावा.",
      recommendedActions: ["स्थानिक कृषी केंद्राशी संपर्क साधा.", "पिकाची योग्य तपासणी करा."],
      precautions: ["अटींनुसार प्रमाणित औषधांचाच वापर करा."],
      source: { title: "Krishi Vigyan Kendra (KVK) General Advisory", publisher: "KVK", verified: true },
      confidence: 0.75,
      followUpQuestion: "तुमच्या पिकावर कोणते लक्षण दिसत आहे?",
    },
    hi: {
      answer: "आपके प्रश्न के संबंध में स्थानीय कृषि विज्ञान केंद्र (KVK) या कृषि अधिकारियों से संपर्क करें। फसलों की उचित जांच करवाकर उपचार करें।",
      recommendedActions: ["स्थानीय कृषि केंद्र से संपर्क करें।", "फसल की उचित जांच करवाएं।"],
      precautions: ["केवल अनुशंसित कृषि उत्पादों का उपयोग करें।"],
      source: { title: "Krishi Vigyan Kendra (KVK) General Advisory", publisher: "KVK", verified: true },
      confidence: 0.75,
      followUpQuestion: "आपकी फसल पर क्या लक्षण दिखाई दे रहे हैं?",
    },
    en: {
      answer: "For this query, please consult your local Krishi Vigyan Kendra (KVK) or agricultural officer for verified crop inspection and guidance.",
      recommendedActions: ["Contact your nearest KVK agricultural expert.", "Inspect crop symptoms carefully."],
      precautions: ["Use only recommended agricultural inputs."],
      source: { title: "Krishi Vigyan Kendra (KVK) General Advisory", publisher: "KVK", verified: true },
      confidence: 0.75,
      followUpQuestion: "What specific symptoms are you noticing on your crop?",
    }
  };

  return fallbackAnswers[langKey] || fallbackAnswers["en"];
}
