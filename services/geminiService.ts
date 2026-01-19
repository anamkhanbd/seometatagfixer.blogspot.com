import { GoogleGenAI, Type } from "@google/genai";
import { SEOData } from "../types";

// Initialize Gemini Client
// In preview/dev, process.env.API_KEY is available.
// In standalone usage, the user provided key is used.
const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) ? process.env.API_KEY : 'AIzaSyAK2JnWt67oAvgdRLEMwkJUhRZyyl2kyzY'; 
const ai = new GoogleGenAI({ apiKey });

export const analyzeContent = async (text: string, language: string): Promise<SEOData> => {
  if (!apiKey) {
    console.error("API Key is missing from env");
    // We let the SDK fail if it must, or we can throw a clearer error
    throw new Error("API Key is missing");
  }

  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze the following text for SEO purposes. The user's UI language is ${language === 'bn' ? 'Bengali' : 'English'}, so ensure the analysis tips are in ${language === 'bn' ? 'Bengali' : 'English'}, but keep the generated meta tags (title, description, keywords) appropriate for the content's language (detect the content language automatically).

    Return a valid JSON object with the following structure:
    - title: An SEO optimized title (approx 50-60 chars).
    - description: An SEO optimized meta description (approx 150-160 chars).
    - keywords: An array of strings containing mixed keywords.
    - robots: Default to "index, follow".
    - author: Infer an author name if possible, otherwise leave blank.
    - score: An integer from 0 to 100 representing SEO readiness based on content depth, keyword usage, and readability.
    - tips: An array of strings with actionable advice to improve the content's SEO.
    - keywordsDetailed: An object containing three arrays of strings: 'primary' (main topics), 'secondary' (related terms), and 'longTail' (phrases).

    Content to analyze:
    """
    ${text.substring(0, 10000)}
    """
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            robots: { type: Type.STRING },
            author: { type: Type.STRING },
            score: { type: Type.INTEGER },
            tips: { type: Type.ARRAY, items: { type: Type.STRING } },
            keywordsDetailed: {
              type: Type.OBJECT,
              properties: {
                primary: { type: Type.ARRAY, items: { type: Type.STRING } },
                secondary: { type: Type.ARRAY, items: { type: Type.STRING } },
                longTail: { type: Type.ARRAY, items: { type: Type.STRING } },
              }
            }
          }
        }
      }
    });

    console.log("Raw Response:", response.text);

    let resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from AI");
    }

    // CLEANUP: Remove Markdown Code Blocks if present (fixes common JSON parse errors)
    resultText = resultText.trim();
    if (resultText.startsWith('```json')) {
        resultText = resultText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (resultText.startsWith('```')) {
         resultText = resultText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    return JSON.parse(resultText) as SEOData;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};