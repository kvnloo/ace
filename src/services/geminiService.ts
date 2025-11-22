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

Key Facility Layout & Features:

**Ground Floor (The Tennis Arena)**
- 24 Total Tennis Courts: 6 Hard, 6 Clay, 6 Grass, 6 Wood.
- Autonomous maintenance: Robotic mowers and cleaners.
- Amenities: Pro Shop, Locker Rooms, Smart Recovery Areas.

**First Floor (The Racquet Mezzanine)**
- 16 Badminton Courts.
- 4 Squash Courts (Glass-walled).
- 16 Table Tennis Tables.

**Second Floor (The Pickleball & Heritage Deck)**
- 8 Pickleball Courts.
- 1 Real Tennis Court (The historic sport).

**Third Floor (The Vertical Grass Lab)**
- 4 massive autonomous farming sections (500 sq meters each).
- Hydroponic cultivation of court surfaces using robotics.

**Autonomous Tech**
- Drones for court monitoring.
- Biometric entry and payments.
- AI Building Management System (BMS) for renewable energy and HVAC.
- Emergency response AI.

Tone: Visionary, precise, architectural, and welcoming.
Keep answers concise (under 100 words) unless asked for detail.
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