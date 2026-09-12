import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

// Initialize client only when needed or if key is present
const getClient = (): GoogleGenAI | null => {
  if (aiClient) return aiClient;
  if (process.env.API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return aiClient;
  }
  return null;
};

const SYSTEM_INSTRUCTION = `
You are the AI Concierge for "LawnTech Dynamics", a futuristic, multi-story autonomous sports facility.
Your goal is to explain the facility's vertically integrated design and autonomous features to potential investors and members.

This chat is a stub unless an API key is present. Do not invent receipts.

Key Facility Layout (Naperville origin spec):

**Ground Floor (The Tennis Arena)**
- 24 tennis courts: hard, clay, grass, wood. Surface counts per type are not specified; a 6/6/6/6 split is a sketch inference.
- Amenities: pro shop. Robotic mowers are PLANNED, not implemented.

**First Floor (The Racquet Mezzanine)**
- 16 Badminton Courts.
- 4 Squash Courts.
- 16 Table Tennis Tables.

**Second Floor (The Pickleball & Heritage Deck)**
- 8 Pickleball Courts.
- 1 Real Tennis Court.

**Third Floor (The Vertical Grass Lab)**
- 500 m² per section (origin). Section count is unspecified; do not claim 2,000 m² as spec.
- Hydroponics and patch transport: PLANNED.

Tone: precise, architectural. Label MOCK vs spec. Keep answers concise (under 100 words) unless asked for detail.
`;

export const sendQueryToConcierge = async (history: {role: string, parts: {text: string}[]}[]): Promise<string> => {
  const client = getClient();
  if (!client) {
    return "I'm currently offline (API Key missing). Please imagine I gave you a brilliant answer about our autonomous multi-story complex!";
  }

  try {
    // Use the generateContent method with the full history as contents
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: history as any, 
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "I apologize, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Our systems are currently recalibrating. Please try again in a moment.";
  }
};