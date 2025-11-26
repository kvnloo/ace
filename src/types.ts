export enum View {
  HOME = 'HOME',
  FACILITY_DEMO = 'FACILITY_DEMO',
  AMENITIES = 'AMENITIES',
  INVEST = 'INVEST',
  SPECIFICATIONS = 'SPECIFICATIONS',
  ABOUT = 'ABOUT',
  CONTACT = 'CONTACT',
  FAQ = 'FAQ',
  GALLERY = 'GALLERY',
  SUSTAINABILITY = 'SUSTAINABILITY',
  PRIVACY = 'PRIVACY',
  TERMS = 'TERMS'
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

// Heat Map Types
export type HeatMapDataType = 'ball_impact' | 'player_position' | 'tactical_pattern' | 'serve_placement';
export type HeatMapMode = 'realtime' | 'historical' | 'comparison';

export interface HeatPoint {
  x: number;
  z: number;
  intensity: number;
  timestamp: number;
  type: HeatMapDataType;
  metadata?: {
    playerName?: string;
    shotType?: string;
    speed?: number;
    spin?: number;
  };
}

export interface CourtHeatData {
  courtId: string;
  courtType: 'hard' | 'clay' | 'grass' | 'wood';
  points: HeatPoint[];
  timeRange: {
    start: number;
    end: number;
  };
}

export interface HeatMapPattern {
  id: string;
  name: string;
  description: string;
  zones: Array<{ x: number; z: number; radius: number }>;
  frequency: number;
  confidence: number;
}

export type ShadowQuality = 'low' | 'medium' | 'high';