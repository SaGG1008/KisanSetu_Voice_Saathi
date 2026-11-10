export interface AgriculturalSource {
  title: string;
  publisher: string;
  url?: string;
  verified: boolean;
}

export interface KnowledgeItem {
  id: string;
  topic: string;
  crop: string;
  category: string;
  supportedLanguages: string[];
  content: Record<string, string>; // lang -> text
  source: AgriculturalSource;
  updatedDate: string;
}

export const EXPANDED_AGRICULTURAL_KNOWLEDGE_BASE: KnowledgeItem[] = [
  {
    id: "tomato-whitefly",
    topic: "Crop & Pest Control",
    crop: "Tomato",
    category: "Pest Management",
    supportedLanguages: ["mr", "hi", "en"],
    content: {
      mr: "टोमॅटो पिकात पांढरी माशी नियंत्रणासाठी पिकात पिवळे चिकट सापळे प्रति एकरी १०-१२ लावावेत. निंबोळी तेल (१%) फवारावे.",
      hi: "टमाटर की फसल में सफेद मक्खी नियंत्रण के लिए प्रति एकड़ 10-12 पीले चिपचिपे ट्रैप लगाएं। नीम का तेल (1%) छिड़कें।",
      en: "For whitefly control on tomato crops, install 10-12 yellow sticky traps per acre. Spray neem oil (1%).",
    },
    source: {
      title: "ICAR-NCIPM Tomato Pest Management Guidelines",
      publisher: "ICAR",
      url: "https://icar.org.in",
      verified: true,
    },
    updatedDate: "2026-01-15",
  },
  {
    id: "cotton-yellow-leaves",
    topic: "Crop Health & Nutrition",
    crop: "Cotton",
    category: "Nutrient Deficiency",
    supportedLanguages: ["mr", "hi", "en"],
    content: {
      mr: "कापूस पिकात पाने पिवळी पडल्यास मॅग्नेशियम सल्फेट (१%) किंवा युरिया (२%) ची फवारणी शिफारस केली जाते. पाण्याचा निचरा योग्य ठेवा.",
      hi: "कपास की फसल में पत्तियां पीली पड़ने पर मैग्नीशियम सल्फेट (1%) या यूरिया (2%) का छिड़काव अनुशंसित है। जल निकासी उचित रखें।",
      en: "For yellow leaves in cotton crops, spraying magnesium sulphate (1%) or urea (2%) is recommended. Ensure proper drainage.",
    },
    source: {
      title: "ICAR-Central Institute for Cotton Research (CICR)",
      publisher: "ICAR-CICR",
      url: "https://cicr.org.in",
      verified: true,
    },
    updatedDate: "2026-01-20",
  },
  {
    id: "irrigation-management",
    topic: "Water & Irrigation",
    crop: "General Crops",
    category: "Water Management",
    supportedLanguages: ["mr", "hi", "en"],
    content: {
      mr: "पिकांना पाणी देताना ठिबक सिंचन (Drip Irrigation) चा वापर करावा. यामुळे पाण्याची बचत होते आणि मुळांना योग्य वाफसा मिळतो.",
      hi: "फसलों की सिंचाई करते समय ड्रिप सिंचाई (Drip Irrigation) का उपयोग करें। इससे पानी की बचत होती है और जड़ों को उचित नमी मिलती है।",
      en: "Use drip irrigation for watering crops to conserve water and maintain optimal root zone moisture.",
    },
    source: {
      title: "Water Technology Centre, ICAR-IARI",
      publisher: "ICAR-IARI",
      verified: true,
    },
    updatedDate: "2026-02-01",
  },
  {
    id: "soil-preparation",
    topic: "Soil & Land Preparation",
    crop: "General Crops",
    category: "Agronomy",
    supportedLanguages: ["mr", "hi", "en"],
    content: {
      mr: "पेरणीपूर्वी जमिनीची खोल नांगरट करून कुजलेले शेणखत (FYM) प्रति एकर ५-६ टन मिसळावे. माती भुसभुशीत करावी.",
      hi: "बुवाई से पहले खेत की गहरी जुताई करके सड़ी हुई गोबर की खाद (FYM) प्रति एकड़ 5-6 टन मिलाएं। मिट्टी को भुरभुरी बनाएं।",
      en: "Before sowing, perform deep ploughing and mix 5-6 tons of well-decomposed farmyard manure (FYM) per acre to ensure fine tilth.",
    },
    source: {
      title: "ICAR Agronomy Division Guidelines",
      publisher: "ICAR",
      verified: true,
    },
    updatedDate: "2026-02-10",
  },
  {
    id: "urea-fertilizer",
    topic: "Fertilizer Management",
    crop: "General Crops",
    category: "Nutrient Management",
    supportedLanguages: ["mr", "hi", "en"],
    content: {
      mr: "युरिया खताचा वापर पिकाच्या वाढीच्या अवस्थेत सिंचनानंतर किंवा हलक्या पावसानंतर योग्य प्रमाणात करावा.",
      hi: "यूरिया खाद का उपयोग फसल की वानस्पतिक वृद्धि के दौरान सिंचाई के बाद या हल्की बारिश के बाद उचित मात्रा में करें.",
      en: "Apply urea fertilizer during vegetative growth after irrigation or light rainfall in recommended split doses.",
    },
    source: {
      title: "ICAR-IARI Nutrient Management Guidelines",
      publisher: "ICAR-IARI",
      verified: true,
    },
    updatedDate: "2026-02-15",
  },
];

export function retrieveAdvancedKnowledge(query: string, lang: string) {
  const lowerQuery = query.toLowerCase();
  const langKey = ["mr", "hi", "en"].includes(lang) ? lang : "en";

  const matches = EXPANDED_AGRICULTURAL_KNOWLEDGE_BASE.filter(item => {
    const textContent = (item.content[langKey] || item.content["en"]).toLowerCase();
    const topicMatch = item.topic.toLowerCase().includes(lowerQuery) || item.crop.toLowerCase().includes(lowerQuery) || item.category.toLowerCase().includes(lowerQuery);
    const queryWords = lowerQuery.split(/\s+/);
    const keywordMatch = queryWords.some(qw => qw.length > 2 && (textContent.includes(qw) || item.crop.toLowerCase().includes(qw) || item.topic.toLowerCase().includes(qw)));
    return topicMatch || keywordMatch;
  });

  if (matches.length === 0) {
    return {
      matches: [],
      source: {
        title: "Krishi Vigyan Kendra (KVK) & State Department of Agriculture",
        publisher: "KVK Advisory",
        verified: true,
      }
    };
  }

  return {
    matches,
    source: matches[0].source,
  };
}
