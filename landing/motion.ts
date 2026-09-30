export type MotionSemantic =
  | 'anchor'
  | 'resolve'
  | 'branch'
  | 'connect'
  | 'commit'
  | 'compare'
  | 'verify'
  | 'retain';

export const loopMotion: Record<string, MotionSemantic> = {
  Goal: 'anchor',
  Observe: 'resolve',
  Model: 'resolve',
  Hypothesize: 'branch',
  Simulate: 'branch',
  Connect: 'connect',
  Intervene: 'commit',
  Measure: 'compare',
  Verify: 'verify',
  Learn: 'retain',
};

export const principleMotion = {
  'Human agency first': 'anchor',
  'Evidence before optimization': 'resolve',
  'Humans are infrastructure': 'connect',
  'Simulation must earn trust': 'verify',
} as const;

export const laneMotion = {
  Understand: 'resolve',
  Simulate: 'branch',
  Connect: 'connect',
  Improve: 'compare',
} as const;

export const motionReason = {
  anchor: 'keep the human or goal spatially stable while the system adapts around it',
  resolve: 'reduce ambiguity without adding spectacle',
  branch: 'show possibility without replacing observed reality',
  connect: 'surface a relationship only when context makes it relevant',
  commit: 'make a chosen intervention feel materially different from a possibility',
  compare: 'retain a baseline so change remains legible',
  verify: 'let prediction meet observation and preserve disagreement when they differ',
  retain: 'leave the interface in a quieter changed state after learning',
} satisfies Record<MotionSemantic, string>;
