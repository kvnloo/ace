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
You are a sketch guide for the HomeBase public landing on ACE Pages.
HomeBase is an indoor pickleball digital twin and facility OS. The live GPU twin is the private product. This site is a pretotype landing and does not run that loop.

**SHIPPED (private HomeBase, not this bundle)**
- USAPA 2025 rules engine (serve, NVZ, two-bounce, faults, scoring, physics)
- Facility OS MVP: booking, cleaning robots, ROI dashboard, overlays (demo/sim data)

**LIVE elsewhere**
- 3D facility: players, ball, cameras, scoreboards — not started on ACE Pages

**VISION / SPEC nested campus (Pascal sketch on this site)**
- APEX labs, physio, gym, pool, clubhouse — VISION, not origin measurements
- Naperville: 24 tennis / 16 badminton / 4 squash / 16 table tennis / 8 pickleball / 1 real tennis
- Grass lab: 500 m² per section; section count unspecified

Do not invent receipts. Do not describe a second live GPU loop on this site. Keep answers under 100 words unless asked for detail.
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