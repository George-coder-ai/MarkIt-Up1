
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

// Always initialize GoogleGenAI with the direct process.env.API_KEY string
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateProductDescription = async (
  productInfo: string, 
  images: string[], 
  language: string
): Promise<string> => {
  const ai = getAI();
  const model = 'gemini-3-pro-preview';
  
  const parts = [
    { text: `You are an expert e-commerce copywriter. Analyze this product and generate three distinct versions of descriptions in ${language}:
    1. SIMPLE: A concise, catchy summary.
    2. PROFESSIONAL: A detailed, trust-building description.
    3. SEO OPTIMIZED: A version with relevant keywords.
    
    Format each clearly with headers and bullet points.` },
    { text: `Context provided by user: ${productInfo}` },
    ...images.map(img => ({
      inlineData: {
        mimeType: "image/jpeg",
        data: img.split(',')[1]
      }
    }))
  ];

  const response = await ai.models.generateContent({
    model,
    contents: { parts },
  });

  return response.text || "Failed to generate description.";
};

export const enhanceProductImage = async (base64Image: string): Promise<string | undefined> => {
  const ai = getAI();
  const model = 'gemini-2.5-flash-image';
  
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/jpeg' } },
        { text: "Please enhance this product photo for a professional marketplace listing. Adjust lighting and sharpen the subject." }
      ]
    }
  });

  const candidates = response.candidates;
  if (candidates && candidates.length > 0) {
    const parts = candidates[0].content.parts;
    for (const part of parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }
  return undefined;
};

export const performPriceAnalysis = async (
  productName: string, 
  category: string,
  basePrice: string
): Promise<{ text: string, links: { title: string, uri: string }[] }> => {
  const ai = getAI();
  const model = 'gemini-3-pro-preview';

  const response = await ai.models.generateContent({
    model,
    contents: `Search for the current market price range for "${productName}" in the "${category}" category on major retail sites. 
    The user is proposing a base price of "${basePrice}". 
    
    Tasks:
    1. Provide a detailed breakdown of competitor prices.
    2. Determine if the user's base price of "${basePrice}" is competitive, too high, or too low compared to the market.
    3. If the user's price is not meeting the range, suggest a specific optimized price or range to maximize sales.
    
    Format the response with a clear "Market Verdict" section at the top.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text || "No analysis available.";
  const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
    title: chunk.web?.title || "Reference Source",
    uri: chunk.web?.uri || "#"
  })) || [];

  return { text, links };
};
