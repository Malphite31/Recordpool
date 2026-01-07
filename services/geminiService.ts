
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const analyzeTrackMetadata = async (title: string, artist: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the track "${title}" by "${artist}". Since you don't have the audio file, provide creative, DJ-focused insights about what a track with this name might sound like in terms of genre vibes, mixing potential, and energy levels. Be concise and professional.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text || "No insights available.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "AI analysis currently unavailable.";
  }
};

export const generateSearchSuggestions = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User is searching for: "${query}". Suggest 3 related musical sub-genres or vibes that a DJ would search for in a record pool.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    return [];
  }
};
