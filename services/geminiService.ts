import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI | null => {
  if (aiClient) return aiClient;
  if (process.env.API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return aiClient;
  }
  return null;
};

const SYSTEM_INSTRUCTION = `
You are a sketch guide for the ATLAS public pretotype.
ATLAS is soil to cell: specify a stack, simulate it, bind a live twin. Under an hour a week. This Pages site does not run the live GPU racquet loop or Unreal in the browser.

**SHIPPED (private racquet twin, not this bundle)**
- USAPA 2025 rules engine (serve, NVZ, two-bounce, faults, scoring, physics)
- Facility OS MVP: booking, cleaning robots, ROI dashboard, overlays (demo/sim data)

**VISION (GrowTwin / CEA — Blueprint outline)**
- PCPartPicker for farms: spec → yield/watts → bind a twin
- Photoreal UE5/Cesium is the twin claim, not this React page
- C(RAID) is a named hybrid, not CI/CD

**LIVE elsewhere**
- 3D racquet facility and photoreal farm twin — not started on this Pages site

**SPEC nested campus (Pascal sketch on this site)**
- Naperville: 24 tennis / 16 badminton / 4 squash / 16 table tennis / 8 pickleball / 1 real tennis
- Grass lab: 500 m² per section; section count unspecified
- APEX labs, physio, gym, pool, clubhouse — VISION, not origin measurements

Do not invent receipts. Do not describe a second live GPU loop on this site. Keep answers under 100 words unless asked for detail.
`;

export const sendQueryToConcierge = async (history: {role: string, parts: {text: string}[]}[]): Promise<string> => {
  const client = getClient();
  if (!client) {
    return "This chat is a stub on GitHub Pages (no API key). ATLAS is a pretotype — soil to cell, not a live twin.";
  }

  try {
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
