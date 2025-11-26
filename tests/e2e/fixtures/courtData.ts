/**
 * Test fixtures for court data
 */

export const mockCourtData = {
  courts: [
    {
      id: 'court-1',
      name: 'Tennis Court 1',
      type: 'tennis',
      status: 'available',
      surface: 'hard',
      dimensions: {
        length: 23.77,
        width: 10.97
      },
      lighting: true,
      bookings: []
    },
    {
      id: 'court-2',
      name: 'Tennis Court 2',
      type: 'tennis',
      status: 'occupied',
      surface: 'clay',
      dimensions: {
        length: 23.77,
        width: 10.97
      },
      lighting: true,
      bookings: [
        {
          id: 'booking-1',
          startTime: '2024-01-15T10:00:00Z',
          endTime: '2024-01-15T11:00:00Z',
          user: 'John Doe'
        }
      ]
    },
    {
      id: 'court-3',
      name: 'Tennis Court 3',
      type: 'tennis',
      status: 'maintenance',
      surface: 'grass',
      dimensions: {
        length: 23.77,
        width: 10.97
      },
      lighting: false,
      bookings: []
    }
  ]
};

export const mockCourtDetails = {
  id: 'court-1',
  name: 'Tennis Court 1',
  type: 'tennis',
  status: 'available',
  surface: 'hard',
  dimensions: {
    length: 23.77,
    width: 10.97
  },
  lighting: true,
  features: [
    'Professional grade surface',
    'LED lighting system',
    'Ball machine available',
    'Water fountain nearby'
  ],
  bookings: [],
  weatherData: {
    temperature: 22,
    humidity: 65,
    windSpeed: 5,
    conditions: 'clear'
  }
};
