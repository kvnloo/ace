# ACE visual system

ACE should feel like a field instrument, research poster, and world-model interface sharing one visual language.

The target is not "premium SaaS." It is a distinct, information-dense editorial system with enough restraint that evidence and status remain legible.

## Design thesis

**The facility is the environment. The feedback loop is the product.**

The interface should make that architecture visible:
- the human stays at the center;
- evidence and uncertainty are structural, not footnotes;
- experts and agents are visibly different kinds of actors;
- simulation is visually compelling without being presented as reality;
- LIVE / SHIPPED / RESEARCH / VISION / SPEC / MOCK / PRETOTYPE remain obvious.

## Reference qualities

Quackles is a useful internal quality bar for:
- poster-scale type;
- confident geometry;
- a single memorable visual per view;
- strong art direction on mobile, not merely responsive shrinking;
- sparse high-contrast color;
- motion used as hierarchy rather than decoration;
- no generic component-library look.

ACE should share those qualities without reusing Quackles branding or scene language.

## Core grammar

### Typography

Display:
- Barlow Condensed
- very large, light weights
- uppercase for architectural statements
- tight line-height and tracking

Interface / evidence:
- IBM Plex Mono
- small uppercase labels
- explicit status / provenance / coordinates / counts

Body:
- Inter
- compact readable measures
- secondary to the display layer

A page should normally have one dominant display statement, one information diagram, and one evidence/status layer.

### Color

Primary field:
- void: `#050806`
- paper: `#f1f3e8`
- signal: `#dcff45`
- evidence cyan: `#8cecff`
- caution orange: `#ff9a62`

Use signal yellow-green for actions and important state, not as ambient decoration everywhere.

A useful default budget is roughly:
- 80% void / paper field
- 15% line / muted information
- 5% signal color

### Geometry

Prefer:
- square corners;
- 1px dividers;
- grids;
- coordinates;
- rails;
- matrices;
- large empty fields;
- hard typography transitions.

Avoid:
- nested rounded cards;
- pills as the primary information structure;
- floating glass rectangles everywhere;
- generic icon + title + paragraph card grids;
- large gradients used only to imply "AI."

Small chips are acceptable when they behave like taxonomy or evidence labels.

## Signature compositions

### Hero

Required qualities:
- poster-scale ACE typography in the field;
- one human-centered systems visual;
- visible feedback-loop structure;
- strong asymmetry;
- one obvious action;
- micro-labels that reward inspection.

The hero must still work with motion disabled.

### System

Use rows / rails / matrices rather than cards.

The system view should communicate relationships before details.

### First proof

Use a deliberately different tonal field to create rhythm.

Current pattern:
- paper / ink interlude;
- four-step intervention loop;
- clear return arrow back to measurement.

### Campus

Treat the 3D / Pascal view as an instrument:
- map controls are compact and rectangular;
- floor / overlay state is explicit;
- feature selection uses a horizontal evidence strip;
- feature detail panels do not hide the world;
- fallback mode must look intentional, not like an error page.

### Contact

Contact is a collaboration surface, not a startup waitlist template.

It should communicate:
- what kind of human belongs in the loop;
- that the public form is MOCK until submission exists;
- no medical or performance claim is implied.

## Motion budget

Motion must explain hierarchy.

Good:
- slow orbital system motion;
- one marquee / signal rail;
- short page-entry transitions;
- line / border reveals;
- small hover transitions.

Avoid:
- every card floating independently;
- large parallax on body copy;
- motion that competes with reading;
- continuous animation in every section.

All continuous motion needs a `prefers-reduced-motion` fallback.

## Mobile

Do not shrink desktop.

Recompose:
- hero type can become more dominant;
- feedback loop becomes a horizontal rail;
- campus controls become horizontal strips;
- two-column editorial spreads become stacked sequences;
- text measures shorten;
- persistent side labels disappear.

The mobile composition should still feel designed, not merely functional.

## Truth / provenance UI

Status vocabulary is part of the design system:

- `LIVE`
- `SHIPPED`
- `RESEARCH`
- `VISION`
- `SPEC`
- `MOCK`
- `PRETOTYPE`

Evidence classes:
- observation;
- self report;
- expert judgment;
- estimate;
- hypothesis;
- simulation;
- recommendation;
- intervention;
- verified outcome.

Do not style all of these as equivalent colored badges. Hierarchy must reflect epistemic difference.

## Performance

Visual ambition cannot depend on loading the full twin.

- landing must render without Pascal;
- Pascal stays lazy-loaded;
- avoid unnecessary image/video payloads;
- use CSS / vector structure when it produces a stronger result than decorative media;
- real renders/screenshots should be introduced only when provenance-safe and materially better;
- remove the Tailwind browser runtime when build-time CSS migration is ready.

## Regression gates

`npm test` includes `check:design`.

It should fail when core public surfaces regress toward:
- generic `rounded-2xl` / `rounded-3xl` card UI;
- loss of display / mono typography;
- loss of the human-centered hero visual;
- loss of the feedback-loop rail;
- loss of reduced-motion handling;
- loss of mobile composition;
- loss of the paper proof interlude;
- loss of campus control art direction.

These checks are intentionally structural. They do not replace real visual QA.

## Visual acceptance before promotion

Before calling a public design wave complete, inspect:
- desktop wide;
- laptop;
- tablet portrait;
- narrow mobile;
- reduced-motion;
- Campus with WebGL;
- Campus fallback;
- System;
- Spec;
- Contact;
- guide open / closed.

Check:
- no horizontal overflow;
- no obscured controls;
- no contrast failures;
- no accidental generic card islands;
- no UI claiming more maturity than the underlying evidence;
- no private state or facility detail exposed.

## Next quality bar

The next major visual jump should come from **real, provenance-safe ACE media**, not more decoration.

Candidates:
1. real racquet-twin render;
2. one traceable rally replay;
3. one measured intervention before/after visualization;
4. one campus / lab render tied to an explicit SPEC or VISION label.

Until those assets are publishable, the abstract systems poster is preferable to fake photorealism.
