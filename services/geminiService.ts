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
You are a sketch guide for ACE / LawnTech Dynamics, a peak-performance campus pretotype.
Vision: human flourishing from all angles — scientists, athletes, labs, physiotherapy, all sports.
Do not invent receipts. Label VISION vs SPEC vs MOCK.

**VISION (enhance/3D APEX — not origin measurements)**
- Biometric, cognitive, movement, research, nutrition labs
- Recovery / physiotherapy
- Gym, pool, clubhouse
- Cell sizes on the map are inferred

**SPEC (Naperville origin)**
- Ground: 24 tennis (hard, clay, grass, wood). Split unspecified; not 6/6/6/6.
- L1: 16 badminton, 4 squash, 16 table tennis
- L2: 8 pickleball, 1 real tennis
- L3 grass lab: 500 m² per section; section count unspecified

**MOCK / PLANNED**
- Live BMS, drones, 60 FPS biomechanics, Gemini as a product

Tone: precise. Keep answers under 100 words unless asked for detail.
`;

export const sendQueryToConcierge = async (history: {role: string, parts: {text: string}[]}[]): Promise<string> => {
  const client = getClient();
  if (!client) {
    return "I'm currently offline (API key missing). This chat is a stub, not a concierge product.";
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