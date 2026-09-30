export type MotionIntent = {
  behavior: string;
  teaches: string;
};

export const principleMotion: Record<string, MotionIntent> = {
  'Human agency first': {
    behavior: 'stable-agency',
    teaches: 'The system yields around the person instead of moving the person around the interface.',
  },
  'Evidence before optimization': {
    behavior: 'resolve-evidence',
    teaches: 'Useful certainty is earned as evidence becomes legible; it is not created by presentation.',
  },
  'Humans are infrastructure': {
    behavior: 'contextual-connect',
    teaches: 'The right human connection appears in context rather than turning everyone into a permanent network node.',
  },
  'Simulation must earn trust': {
    behavior: 'branch-counterfactual',
    teaches: 'A simulated future can branch from reality without visually replacing reality.',
  },
};

export const laneMotion: Record<string, MotionIntent> = {
  Understand: {
    behavior: 'clarify',
    teaches: 'Understanding reduces ambiguity and organizes relationships rather than adding activity.',
  },
  Simulate: {
    behavior: 'branch',
    teaches: 'Counterfactuals remain translucent alternatives beside an unchanged observed state.',
  },
  Connect: {
    behavior: 'contextual-connect',
    teaches: 'Expertise becomes available when a need makes the relationship relevant.',
  },
  Improve: {
    behavior: 'compare',
    teaches: 'Improvement is a comparison against retained evidence, not an abstract upward arrow.',
  },
};

export const loopMotion: Record<string, MotionIntent> = {
  Goal: {
    behavior: 'anchor',
    teaches: 'Human intention is the stable reference frame for the entire loop.',
  },
  Observe: {
    behavior: 'resolve',
    teaches: 'Reality contributes evidence before the system decides what it means.',
  },
  Model: {
    behavior: 'organize',
    teaches: 'A model organizes evidence while remaining separate from reality.',
  },
  Hypothesize: {
    behavior: 'branch-soft',
    teaches: 'An explanation is a possibility, not a fact.',
  },
  Simulate: {
    behavior: 'branch-ghost',
    teaches: 'Possible futures can be explored without overwriting the observed world.',
  },
  Connect: {
    behavior: 'reveal-relation',
    teaches: 'Relevant humans enter the loop when their expertise matters.',
  },
  Intervene: {
    behavior: 'commit',
    teaches: 'One chosen possibility crosses from idea into a scoped real-world action.',
  },
  Measure: {
    behavior: 'retain-baseline',
    teaches: 'The previous state remains available so change can be compared.',
  },
  Verify: {
    behavior: 'reconcile',
    teaches: 'Prediction and observation meet, and disagreement stays visible.',
  },
  Learn: {
    behavior: 'settle',
    teaches: 'What survives verification becomes the quieter starting state for the next loop.',
  },
};

export function motionBehavior(
  map: Record<string, MotionIntent>,
  key: string,
): string | undefined {
  return map[key]?.behavior;
}
