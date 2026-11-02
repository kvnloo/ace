export enum View {
  HOME = 'HOME',
  FACILITY_DEMO = 'FACILITY_DEMO',
  AMENITIES = 'AMENITIES',
  INVEST = 'INVEST',
  SPECIFICATIONS = 'SPECIFICATIONS',
  TWIN = 'TWIN'
}

export interface FeatureData {
  id: string;
  title: string;
  description: string;
  icon: string;
  position: [number, number, number];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}