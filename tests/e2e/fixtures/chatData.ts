/**
 * Test fixtures for AI chat data
 */

export const mockChatResponses = {
  courtStatus: {
    message: 'Court 1 is available, Court 2 is occupied, and Court 3 is under maintenance.',
    timestamp: new Date().toISOString(),
    confidence: 0.95
  },
  weatherInfo: {
    message: 'Current weather conditions: 22°C, clear skies, light wind at 5 km/h. Perfect conditions for tennis!',
    timestamp: new Date().toISOString(),
    confidence: 0.98
  },
  bookingInfo: {
    message: 'Court 2 is booked from 10:00 AM to 11:00 AM by John Doe. Would you like to make a reservation?',
    timestamp: new Date().toISOString(),
    confidence: 0.92
  },
  error: {
    message: 'I apologize, but I encountered an error processing your request. Please try again.',
    timestamp: new Date().toISOString(),
    error: true
  }
};

export const mockChatHistory = [
  {
    id: 'msg-1',
    role: 'user',
    content: 'Show me court status',
    timestamp: new Date(Date.now() - 60000).toISOString()
  },
  {
    id: 'msg-2',
    role: 'assistant',
    content: 'Court 1 is available, Court 2 is occupied, and Court 3 is under maintenance.',
    timestamp: new Date(Date.now() - 58000).toISOString()
  },
  {
    id: 'msg-3',
    role: 'user',
    content: 'What is the weather like?',
    timestamp: new Date(Date.now() - 30000).toISOString()
  },
  {
    id: 'msg-4',
    role: 'assistant',
    content: 'Current weather conditions: 22°C, clear skies, light wind at 5 km/h. Perfect conditions for tennis!',
    timestamp: new Date(Date.now() - 28000).toISOString()
  }
];
