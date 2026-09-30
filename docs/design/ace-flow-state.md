# ACE flow-state design constitution

ACE is a **living instrument for human potential**.

The interface should make reality more legible without replacing it. The future in ACE is not more interface; it is a better relationship between a person, evidence, experts, environments, models, and action.

## North star

**Invisible augmentation.**

A visitor should feel that the environment is becoming more responsive and understandable, not that a website is performing for them.

When a design choice competes with the person's attention, remove it.

## Brand story

### Navy = environment

The deep navy substrate is the quiet world ACE operates inside: sky, water, depth, space, recovery, calm.

Canonical substrate: `#071426`.

### Tennis green = life and agency

The original ACE tennis green is reserved for things that are alive, active, chosen, verified, or presently connected.

Canonical signal: `#DFFF4F`.

If everything is green, green stops carrying meaning.

### Glass = augmentation

Glass is not decoration. It is used where information is intentionally layered **over reality**:

- navigation;
- campus controls;
- selected-place annotations;
- assistant / guide surfaces;
- contextual instrumentation;
- human-to-system collaboration surfaces such as Contact.

Content that is itself the source of truth should generally not look like glass.

### Shape follows ontology

- physical architecture: precise and structural;
- human interaction: softer radii;
- biological systems: organic cues;
- evidence / data: precise, quiet, traceable;
- controls: compact rounded instruments.

Rounded corners are not a blanket style.

## Motion constitution

Every motion must complete:

> When **X** happens, **Y** changes because this teaches the visitor **Z**.

Allowed purposes:

1. preserve spatial context;
2. reveal causality;
3. reward deliberate attention;
4. distinguish epistemic state;
5. show continuity between abstract system and physical world.

Motion whose only reason is "it feels dynamic" does not ship.

### Human is the stable frame

ACE adapts around the person. The human/goal should not orbit, wobble, parallax, or become a moving target.

### Resolve in place

When content becomes available, prefer optical clarity over spatial travel. Fade, focus, and material resolution preserve context better than cards flying upward or controls lifting toward the pointer.

### Semantic loop

| Step | Complementary motion idea |
| --- | --- |
| Goal | anchors surrounding context |
| Observe | ambiguity resolves into evidence |
| Model | relationships organize |
| Hypothesize | a restrained alternate branch appears |
| Simulate | ghost futures diverge without replacing reality |
| Connect | a relevant human relationship becomes available |
| Intervene | one possibility becomes materially committed |
| Measure | baseline remains visible for comparison |
| Verify | predicted and observed states reconcile or visibly disagree |
| Learn | the system settles into a changed starting state |

The executable mapping lives in `landing/motion.ts`.

## Epistemic material

The interface should make truth boundaries intuitive before the label is even read.

- **LIVE / SHIPPED**: settled, materially grounded.
- **SPEC**: stable and quiet.
- **RESEARCH**: slightly unresolved, but not noisy.
- **VISION**: lighter / more translucent.
- **SIMULATION**: visibly counterfactual; never allowed to overwrite observed state.

Labels remain explicit for accessibility and precision. Material is reinforcement, not a replacement.

## Page stories

### Manifesto

**Idea → system.**

One focal point. Human remains stable. The system resolves around the person. The ten-step rail is one continuous journey, not ten flashing animations.

### Principles

**Trust is restraint.**

Each principle receives one complementary cue. The page gets calmer after the hero.

### System

**Different operations should feel different.**

- Understand clarifies.
- Simulate branches.
- Connect reveals a relationship.
- Improve preserves a baseline for comparison.

### Research

**Uncertainty is visible, not embarrassing.**

Material treatment communicates maturity without adding motion for its own sake.

### Spec

**Truth does not need choreography.**

This is deliberately the least animated route.

### Campus

**System → place.**

The world is primary. Controls recede until attended. Selecting a place changes authoritative scene geometry first; annotation follows. SPEC and VISION remain distinguishable.

### Contact

**Start with the human goal.**

Ask what the person wants to improve before asking who they are. Additional fields resolve only after the goal is meaningful and the person pauses long enough for context to become useful. The form is glass because it is an augmentation surface, not a source-of-truth document.

### Navigation

**Peripheral until needed.**

The ACE mark remains stable. While the reader moves forward, secondary chrome recedes. Scrolling back toward prior context—or deliberately approaching the navigation—restores full clarity.

## Interaction density

ACE may contain many interactions while feeling nearly still.

Prefer:

- opacity;
- material clarity;
- edge light;
- progressive disclosure;
- contextual relationships;
- subtle focus states;
- retained baselines;
- continuity between views.

Avoid:

- hover lifts;
- icon rotations;
- pointer-follow spotlights;
- perpetual marquees;
- moving grids;
- autoplay camera orbits;
- decorative pulses;
- unnecessary parallax;
- simultaneous entrance choreography.

## Flow-state test

For every viewport:

1. What is the single dominant idea?
2. What can disappear without reducing understanding?
3. Does motion explain something the words cannot?
4. Does interaction preserve the person's context?
5. Is ACE responding to attention, or competing for it?

If the interface itself becomes the most memorable thing in the viewport, it is too loud.

## Quality gates

The design is not complete until:

- semantic design contracts pass;
- TypeScript passes;
- production build passes;
- bundle budget passes;
- desktop/mobile/reduced-motion smoke passes;
- no eager 3D/chat regression is introduced;
- no horizontal overflow is introduced;
- the live nightly is visually reviewed after deployment.
