export const ACE_FACILITY_THEME = {
  environment: '#071426',
  environmentDeep: '#050D18',
  panel: '#0B1A2E',
  signal: '#DFFF4F',
  paper: '#F3F5ED',
  spec: '#36566A',
  specCourt: '#41633B',
  specCourtAlt: '#355B4B',
  specEarth: '#6B5A3D',
  vision: '#60758A',
  visionCool: '#4E6C84',
  visionLife: '#486B58',
  water: '#376F82',
  glass: '#86AFC1',
  muted: '#7D8C98',
} as const;

export type AceFacilityTheme = typeof ACE_FACILITY_THEME;
