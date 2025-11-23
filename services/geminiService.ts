import { GoogleGenAI } from '@google/genai';

/**
 * Message part structure for Gemini API
 */
interface MessagePart {
  text: string;
}

/**
 * Message structure for Gemini API
 */
interface GeminiMessage {
  role: string;
  parts: MessagePart[];
}

/**
 * Configuration for Gemini API requests
 */
interface GeminiConfig {
  systemInstruction: string;
  temperature: number;
}

/**
 * Response structure from Gemini API
 */
interface GeminiResponse {
  text?: string;
}

/**
 * Singleton AI client instance
 */
let aiClient: GoogleGenAI | null = null;

/**
 * Initialize client only when needed or if key is present
 * @returns GoogleGenAI client instance or null if API key is missing
 */
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

/**
 * Error types for better error handling
 */
enum GeminiErrorType {
  NO_API_KEY = 'NO_API_KEY',
  NETWORK_ERROR = 'NETWORK_ERROR',
  RATE_LIMIT = 'RATE_LIMIT',
  INVALID_RESPONSE = 'INVALID_RESPONSE',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Custom error class for Gemini API errors
 */
class GeminiServiceError extends Error {
  type: GeminiErrorType;
  originalError?: Error;

  constructor(type: GeminiErrorType, message: string, originalError?: Error) {
    super(message);
    this.name = 'GeminiServiceError';
    this.type = type;
    this.originalError = originalError;
  }
}

/**
 * Get user-friendly error message based on error type
 */
const getUserFriendlyErrorMessage = (errorType: GeminiErrorType): string => {
  const messages: Record<GeminiErrorType, string> = {
    [GeminiErrorType.NO_API_KEY]:
      "I'm currently offline (API Key missing). Our AI concierge will be back soon!",
    [GeminiErrorType.NETWORK_ERROR]:
      "It seems you're experiencing connection issues. Please check your internet and try again.",
    [GeminiErrorType.RATE_LIMIT]:
      "We're experiencing high demand right now. Please wait a moment and try again.",
    [GeminiErrorType.INVALID_RESPONSE]:
      "I'm having trouble understanding that request. Could you try rephrasing?",
    [GeminiErrorType.UNKNOWN_ERROR]:
      'Our autonomous systems are currently recalibrating. Please try again in a moment.',
  };

  return messages[errorType];
};

/**
 * Classify error type based on error object
 */
const classifyError = (error: unknown): GeminiErrorType => {
  if (!error) return GeminiErrorType.UNKNOWN_ERROR;

  const errorMessage = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  // Network-related errors
  if (
    errorMessage.includes('network') ||
    errorMessage.includes('fetch') ||
    errorMessage.includes('connection') ||
    errorMessage.includes('timeout') ||
    errorMessage.includes('offline')
  ) {
    return GeminiErrorType.NETWORK_ERROR;
  }

  // Rate limiting errors
  if (
    errorMessage.includes('rate limit') ||
    errorMessage.includes('quota') ||
    errorMessage.includes('429') ||
    errorMessage.includes('too many requests')
  ) {
    return GeminiErrorType.RATE_LIMIT;
  }

  // Invalid response errors
  if (
    errorMessage.includes('invalid') ||
    errorMessage.includes('parse') ||
    errorMessage.includes('malformed')
  ) {
    return GeminiErrorType.INVALID_RESPONSE;
  }

  return GeminiErrorType.UNKNOWN_ERROR;
};

/**
 * Send a query to the Gemini AI Concierge with comprehensive error handling
 * @param history - Array of messages representing the conversation history
 * @returns Promise resolving to the AI's response text
 * @throws GeminiServiceError with detailed error information
 */
export const sendQueryToConcierge = async (history: GeminiMessage[]): Promise<string> => {
  // Validate input
  if (!history || history.length === 0) {
    throw new GeminiServiceError(
      GeminiErrorType.INVALID_RESPONSE,
      'Message history is required'
    );
  }

  // Check for API client
  const client = getClient();
  if (!client) {
    const error = new GeminiServiceError(
      GeminiErrorType.NO_API_KEY,
      'API key is not configured'
    );
    console.warn('Gemini API key is missing. AI features will be unavailable.');
    return getUserFriendlyErrorMessage(error.type);
  }

  // Check network connectivity
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    const error = new GeminiServiceError(
      GeminiErrorType.NETWORK_ERROR,
      'No internet connection detected'
    );
    console.warn('Network is offline. Cannot reach Gemini API.');
    return getUserFriendlyErrorMessage(error.type);
  }

  try {
    // Use the generateContent method with the full history as contents
    const response: GeminiResponse = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: history,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      } as GeminiConfig,
    });

    // Validate response
    if (!response || !response.text) {
      throw new GeminiServiceError(
        GeminiErrorType.INVALID_RESPONSE,
        'Received empty or invalid response from API'
      );
    }

    return response.text;
  } catch (error) {
    // Classify and log the error
    const errorType = classifyError(error);
    const geminiError = new GeminiServiceError(
      errorType,
      error instanceof Error ? error.message : String(error),
      error instanceof Error ? error : undefined
    );

    // Detailed logging for debugging
    console.error('Gemini API Error:', {
      type: geminiError.type,
      message: geminiError.message,
      stack: geminiError.stack,
      originalError: geminiError.originalError,
      timestamp: new Date().toISOString(),
    });

    // Return user-friendly error message
    return getUserFriendlyErrorMessage(errorType);
  }
};

/**
 * Health check for Gemini service
 * @returns boolean indicating if the service is available
 */
export const isGeminiServiceAvailable = (): boolean => {
  const hasApiKey = !!process.env.API_KEY;
  const hasNetworkConnection = typeof navigator !== 'undefined' ? navigator.onLine : true;

  return hasApiKey && hasNetworkConnection;
};
