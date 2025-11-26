/**
 * Mock Gemini Service for E2E Tests
 *
 * Provides a mock implementation of the Gemini API service
 * to avoid external API calls during testing
 */

export const mockGeminiService = () => {
  return {
    sendQueryToConcierge: async (history: any[]): Promise<string> => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Return mock responses based on the last user message
      const lastMessage = history[history.length - 1];
      const userText = lastMessage?.parts?.[0]?.text?.toLowerCase() || '';

      if (userText.includes('court') || userText.includes('status')) {
        return 'Court 1 is available, Court 2 is occupied, and Court 3 is under maintenance.';
      } else if (userText.includes('weather')) {
        return 'Current weather conditions: 22°C, clear skies, light wind at 5 km/h. Perfect conditions for tennis!';
      } else if (userText.includes('book')) {
        return 'Court 2 is booked from 10:00 AM to 11:00 AM. Would you like to make a reservation?';
      } else {
        return 'I can help you with court status, weather information, and booking inquiries. What would you like to know?';
      }
    }
  };
};

/**
 * Mock error response from Gemini
 */
export const mockGeminiError = () => {
  return {
    sendQueryToConcierge: async (): Promise<string> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      throw new Error('API Error');
    }
  };
};
