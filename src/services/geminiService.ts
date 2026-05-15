import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const getLeadInsights = async (leads: any[]) => {
  const prompt = `Analyze these CRM leads: ${JSON.stringify(leads)}. Provide brief, actionable sales advice.`;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  return response.text;
};

export const scoreLead = async (lead: any) => {
    const prompt = `Score this lead (0-100) based on name: ${lead.name}, company: ${lead.company}. Return just the number. Lead: ${JSON.stringify(lead)}`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return parseInt(response.text || '0');
};
