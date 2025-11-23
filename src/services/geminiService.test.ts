/**
 * Mock Gemini Service for Testing
 * Provides deterministic responses without making actual API calls
 */

let useMock = false;
let mockDelay = 800;
let mockShouldError = false;

export const setMockMode = (enabled: boolean) => {
  useMock = enabled;
};

export const setMockDelay = (delay: number) => {
  mockDelay = delay;
};

export const setMockError = (shouldError: boolean) => {
  mockShouldError = shouldError;
};

export const mockSendQueryToConcierge = async (history: {role: string, parts: {text: string}[]}[]): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, mockDelay));

  if (mockShouldError) {
    throw new Error('Simulated API Error');
  }

  const lastMessage = history[history.length - 1];
  const userText = lastMessage?.parts?.[0]?.text?.toLowerCase() || '';

  if (userText.includes('court') || userText.includes('status')) {
    return 'Court 1 is available, Court 2 is occupied, and Court 3 is under maintenance.';
  } else if (userText.includes('weather')) {
    return 'Current weather conditions: 22°C, clear skies, light wind at 5 km/h. Perfect conditions for tennis!';
  } else if (userText.includes('book')) {
    return 'Court 2 is booked from 10:00 AM to 11:00 AM. Would you like to make a reservation?';
  } else {
    return 'I can help you with court status, weather information, and booking inquiries.';
  }
};

// Export controls for test setup
export const testUtils = {
  setMockMode,
  setMockDelay,
  setMockError,
};
