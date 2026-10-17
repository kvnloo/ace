# ACE design constitution

ACE is a **living instrument for human potential**: part physical campus, part evidence system, part expert network, part digital twin.

The interface should feel futuristic, solarpunk and quietly magical without asking the user to admire the interface. The governing idea is **invisible augmentation**: reality stays primary; technology makes the right part of reality more legible at the right moment.

## North star

**The facility is the environment. The feedback loop is the product. The human is the stable reference frame.**

ACE should feel like entering flow:
- one focal idea at a time;
- low decision friction;
- information arrives progressively;
- the system responds to attention instead of competing for it;
- motion preserves context, reveals causality, or rewards attention;
- detail recedes when it is not useful.

A useful review question for every visual behavior is:

> When ___ happens, ___ changes because this teaches the visitor that ___.

If that sentence cannot be completed with a meaningful ACE concept, remove the motion.

## Brand story

### Structure

Scientific rigor, evidence, provenance, architecture and trust boundaries are precise. Grids, rails, measured spacing and restrained typography express that precision.

### Atmosphere

Deep navy is the environmental substrate: calm, spatial and continuous. It should feel closer to evening sky, deep water or shaded architecture than to a black "AI" dashboard.

Primary field:
- navy: `#071426`
- raised navy: `#0B1B31`
- soft navy: `#10243B`
- mineral paper: `#F4F7EF`
- tennis / living signal: `#DFFF4F`

Tennis-lime means **life, active state, intervention or meaningful attention**. It is rare enough to retain meaning.

Cyan and warm mineral tones are secondary semantic colors, not competing brand accents.

### Augmentation

Liquid glass has a specific meaning: **information layered over reality without replacing it**.

Use glass for:
- navigation;
- 3D / campus controls;
- contextual annotations;
- transient guidance;
- selected-object detail;
- controls that sit over a world.

Do not use glass as a generic card treatment.

### Life

Human, biological and interactive surfaces may be softer and more rounded. Physical architecture, evidence matrices and system structure remain more precise.

Rounded corners should communicate touch, affordance or humanity—not "premium SaaS."

## Geometry

Use geometry according to ontology.

**Structural / factual**
- precise grids;
- restrained corners;
- 1px relationships;
- matrices;
- rails;
- generous negative space.

**Human / interactive**
- restrained `10–18px` radii;
- softer material transitions;
- glass where information augments another surface;
- comfortable hit targets.

Avoid:
- rounded cards around every paragraph;
- endless pills;
- floating glass rectangles with no semantic reason;
- decorative neon;
- arbitrary gradients;
- brutalism as an aesthetic end in itself.

## Typography

Display:
- Barlow Condensed;
- large, light weights;
- tight rhythm;
- used for architectural statements, not shouting.

Interface / evidence:
- IBM Plex Mono;
- explicit status, provenance, measurements and small labels.

Body:
- Inter;
- calm readable measures;
- never animate body copy simply because it entered the viewport.

A viewport should usually contain one dominant statement, one supporting system relationship, and optional detail.

## Motion language

Motion is part of ACE's ontology.

| Concept | Motion semantic | Meaning |
| --- | --- | --- |
| Goal | anchor | intention organizes the system |
| Observe | resolve | evidence reduces ambiguity |
| Model | resolve | relationships become legible |
| Hypothesize | branch | possibility appears without becoming truth |
| Simulate | branch | counterfactual diverges from observed reality |
| Connect | connect | the relevant human/tool becomes available in context |
| Intervene | commit | one possibility crosses into action |
| Measure | compare | a baseline remains available |
| Verify | verify | prediction meets observation |
| Learn | retain | the system settles into a changed state |

### Motion rules

- Human / goal stays spatially stable.
- Prefer opacity, clarity, material response and progressive disclosure over translation.
- Do not animate a word by literally acting out the word.
- Do not move body copy for decoration.
- No autonomous marquee.
- No automatic hero orbit.
- No global pointer spotlight.
- No moving background grid.
- No generic hover lift / rotate.
- No CTA shine sweep.
- No stagger merely to prove that a list is interactive.
- Route continuity should be nearly imperceptible.
- `prefers-reduced-motion` keeps all information and semantic distinctions.

The target is **more interactive states with less visible motion**.

## Route narratives

### Manifesto

Story: **idea → system**.

The human is the stable point. One restrained signal traces the feedback loop as the reader moves through the hero. The surrounding relationships resolve; they do not orbit for spectacle.

Operating beliefs sit quietly in the page rather than scrolling past as a ticker.

Principle interactions add complementary meaning:
- Human agency → surrounding system yields to the anchor.
- Evidence → ambiguity resolves.
- Humans are infrastructure → a relationship becomes available.
- Simulation must earn trust → an alternate branch remains visibly distinct from reality.

### System

Story: **how the loop compounds**.

Each lane gets its own behavior:
- Understand → clarity / resolution.
- Simulate → translucent branch.
- Connect → context-dependent relationship.
- Improve → new state remains comparable with baseline.

Do not give all four lanes the same hover animation.

### Research

Story: **possibility with discipline**.

Epistemic maturity is expressed by material confidence:
- LIVE / SHIPPED → stable and solid;
- SPEC → grounded;
- RESEARCH → slightly unresolved;
- VISION → lighter / more translucent.

Labels remain explicit. Material treatment reinforces the claim; it never replaces provenance text.

### Spec

Story: **trust does not need choreography**.

This is the quietest route.
- no card fly-ins;
- no stagger;
- no positional hover motion;
- provenance/status available without spectacle.

### Campus

Story: **system → place**.

The campus must feel like the same ACE world acquiring depth, not a separate 3D demo.

- deep navy environment;
- subdued physical materials;
- tennis-lime for active selection / human / live signal;
- SPEC geometry feels grounded;
- VISION geometry can feel lighter;
- glass overlays augment the world;
- labels and controls remain quiet until useful;
- no automatic camera orbit;
- no autonomous HUD motion.

Fallback and Pascal/WebGL views must share the same palette and hierarchy.

### Contact

Story: **the system organizes around the person's goal**.

The first question is:

> What do you want ACE to help you improve?

Only after a meaningful answer should role/context appear. Identity/contact comes later. Space expands calmly; the user's current context does not jump away.

The pretotype must continue to say when it does not submit/store data.

## The solar moment

ACE can use one deliberate light/mineral interlude for **verification / first proof**.

It is not a random light-theme section. It represents an idea leaving the dark modeling space and entering daylight where reality can falsify it.

Because this contrast carries meaning, it should remain rare.

## Campus palette

The website, CSS fallback and Pascal scene share one environmental family.

Physical sport surfaces may retain subdued identity colors, but the scene should not become a rainbow architectural model. APEX/VISION spaces stay within cool mineral/navy families so the tennis-lime signal remains special.

## Interaction hierarchy

1. **Reading** — no interaction required.
2. **Attention** — subtle clarity/material response.
3. **Intent** — progressive detail appears.
4. **Action** — control becomes clearly active.
5. **Consequence** — state persists and remains comparable.

Hover should mean "the system noticed your attention," not "move this object two pixels."

## Performance is part of calm

Flow breaks when the interface stalls.

- landing renders without Pascal;
- Pascal remains lazy-loaded;
- chat remains interaction-deferred;
- lite mode can defer 3D;
- avoid decorative media payloads;
- preserve bundle budgets;
- avoid continuous animation work when idle.

## Accessibility

Calm is not an excuse to hide affordances.

- keyboard/focus states remain explicit;
- reduced motion preserves meaning;
- status is never color-only;
- progressive disclosure remains logically ordered;
- contrast must remain readable on glass and navy;
- the page remains understandable with motion disabled.

## Regression gates

`npm test` must include the flow-state design contract.

The suite should fail on structural regressions such as:
- loss of navy + tennis-lime identity;
- glass used without augmentation semantics;
- autonomous ticker/corridor motion;
- reintroduced hero orbit;
- positional reveal motion;
- generic hover translate/rotate;
- animated Spec cards;
- loss of goal-first Contact;
- divergent Campus palettes;
- lost reduced-motion behavior.

Real-browser smoke should cover:
- desktop Manifesto;
- System;
- Spec;
- Contact progressive disclosure;
- mobile/lite Campus;
- reduced motion;
- lazy-loading boundaries;
- overflow;
- bundle budgets.

## Promotion standard

Before promotion, inspect wide desktop, laptop, tablet, narrow mobile and reduced motion.

Ask:
- Is there one focal idea per viewport?
- Does every visible movement add information?
- Does the interface recede when the user is reading?
- Is tennis-lime still meaningful because it is sparse?
- Does glass always represent augmentation?
- Does Campus feel like the same world?
- Can the visitor distinguish fact, research and vision without decoding decoration?
- Does the experience feel calmer after adding interaction?

The target is not "more designed."

The target is a system that becomes almost invisible while helping the visitor understand more.
