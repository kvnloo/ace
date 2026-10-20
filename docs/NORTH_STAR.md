# ACE north star: human flourishing through verified feedback

> **Status:** VISION / RESEARCH charter, October 2026. This is a statement of intent and decision criteria, not a claim that the full campus, human twin, clinical system, or learning platform already exists. For today's implemented scope see [README](../README.md) and [ROADMAP](../ROADMAP.md).

## The promise

**ACE is a consent-governed cyber-physical operating system for human flourishing.** It connects people, coaches and other experts, sensors, task-scoped digital twins, simulation, and helpful agents into an ongoing evidence-based process that lets each person understand their current capabilities, explore possibilities, choose interventions, and learn from actual outcomes.

**The facility is the environment. The feedback loop is the product. The human is the purpose.**

ACE is not just a better racquet facility, a longevity clinic, a synthetic copy of a human, an AI coach, a visualization, an agriculture company, or a universal performance score. These may be facilities, collaborators, testbeds, interfaces, or adjacent research tracks. None is the objective function.

The desired long-term result is **more self-directed capability, health, learning, enjoyment, and autonomy, with less avoidable trial-and-error and coordination friction**. Individuals choose their goals and acceptable tradeoffs. There is no single universal measure of human worth, potential, or flourishing.

### The recurring loop

1. **Goal:** The person specifies a meaningful outcome, constraints, and permissions.
2. **Observe:** Gather the smallest useful set of real measurements or self-reports, with calibration and source context.
3. **Model:** Maintain task-scoped beliefs, including uncertainty and validity limits.
4. **Hypothesize:** Identify testable obstacles and candidate interventions.
5. **Simulate:** Compare plausible futures without confusing a counterfactual with reality.
6. **Connect:** Bring in appropriate people, expertise, and tools.
7. **Intervene:** The person, and when necessary an authorized expert, chooses and approves action.
8. **Measure:** Collect comparable post-intervention observations.
9. **Verify:** Test whether the desired result occurred and whether evidence supports the claim.
10. **Learn and repeat:** Update beliefs, retain useful context, and change course when the hypothesis fails.

A 3D world or AI recommendation is valuable only insofar as it improves this loop.

## North-star outcome and how to measure it

**Primary test:** Does the complete ACE loop produce meaningful, durable improvement in a **participant-chosen capability** beyond a strong conventional baseline (excellent coaching, appropriate expert care, and ordinary software), without unacceptable privacy, safety, cost, time, or psychological burden?

Do not turn this into a universal number assigned to people. Track an evidence-based **portfolio of outcomes**, with individual goals and constraints preserved:

| Dimension | Proposed measures, established before the experiment |
| --- | --- |
| Chosen capability | Domain-appropriate change from baseline, repeatability, retention, and uncertainty |
| Incremental benefit | Comparison with strong standard coaching/software; use controlled or N-of-1 designs when suitable |
| Human agency | Ability to decline, alter or stop interventions; self-reported usefulness, enjoyment and autonomy |
| Scientific trust | Calibration, held-out predictive performance, causal validity, model drift, reproducible evidence receipts |
| Collaboration | Appropriate expert involvement, time to resolve a plateau, coordination burden saved versus added |
| Responsible operation | Consent compliance, revocation, data minimization, safety events, participant burden, operating cost |
| Scale and openness | Independent reuse of non-sensitive schemas, sport packages, benchmarks, adapters and methods |

Measure the distribution of outcomes, not just an average. Record harms, nonresponders and failures as seriously as successes. Set numerical targets only after the endpoint, baseline, measurement reliability, participants and risk budget have been agreed; do not invent retrospective targets to declare success.

The one-year research question is **not** “how many features or courts did we ship?” It is **“did at least one rigorously measured, end-to-end human capability loop outperform a simpler good alternative, and why?”** A negative finding must change the roadmap.

## Origins and scope decisions

The history matters because the mission grew, and previous explorations should not silently become either forgotten requirements or current product claims.

- **Physical starting point:** The early public ACE/LawnTech work explored a highly automated indoor grass-court tennis and multi-sport facility with sensing, environmental control, operations, and sporting experiences. This is important physical-world heritage, **not** proof that such a facility operates today. See [the early Pages work](https://github.com/kvnloo/ace/pull/1) and [exploratory multi-sport facility research](https://github.com/kvnloo/ace/pull/5).
- **Campus program:** The Naperville racquet inventory in the [README](../README.md) is an origin **SPEC**; the Pascal/APEX layouts and inferred dimensions are explicitly **VISION** or modeled geometry, not surveyed measurements. The long-range multidisciplinary program includes sport, strength, biomechanics, PT/rehab, appropriate medical partnerships, nutrition, recovery, learning, research, social spaces, and maker/robotics work. Co-location versus partnership remains open.
- **First functioning testbed:** The private Rally House/HomeBase pickleball digital twin and Facility OS provide a useful software proving ground. Pickleball is a **first falsifiable vertical**, not ACE's final market or a claim that all sports are implemented.
- **Adjacent environmental work:** Controlled-environment agriculture, grow systems, energy, and food provenance are potentially valuable research and community integrations. The [ATLAS soil-to-cell exploration](https://github.com/kvnloo/ace/pull/7) is historical exploration, **not** a change of ACE's mission into a farm or a requirement that every facility operate one.
- **Strategic reframing:** [The September 2026 ACE landing overhaul](https://github.com/kvnloo/ace/pull/9) and [human-flourishing architecture epic](https://github.com/kvnloo/ace-digital-twin/issues/109) established the goal-driven feedback loop as the organizing principle. That supersedes treating any one building, sport, renderer or agricultural subsystem as the product.
- **Presentation versus reality:** [Twin-export integration](https://github.com/kvnloo/ace/issues/20) and [approved recent twin images](https://github.com/kvnloo/ace/issues/30) should make the website more grounded; images remain evidence-labeled presentations, not proof of scientific prediction or built facilities.

Historical PRs are a decision trail, not automatic current requirements. Where old research conflicts with a validated contract, preserve the provenance and record why the direction changed.

## Architectural invariants

| Contract | ACE should enforce |
| --- | --- |
| Human authority | Goals belong to the participant. Experts are first-class collaborators, never merely fallback operators for agents |
| Task-scoped personal twins | An evidence graph of specific capabilities and constraints, not a complete synthetic person or inferred identity |
| Epistemic separation | Observation, self-report, expert judgment, estimate, hypothesis, simulation, recommendation, intervention and verified outcome remain distinct types |
| Traceability | Derived state has source, event time, model/rules version, uncertainty, validity, intended use and permission context |
| Consent and privacy | Purpose-scoped, revocable authorization; minimize raw video/biometrics; use local/edge processing where appropriate |
| World/sport separation | World observations describe time, objects, motion and contact; independent sport packages interpret those observations and own scoring and rules |
| Consistency | Real and simulated play feed compatible observation/adjudication contracts, **with different provenance** |
| Backend neutrality | Own the world/simulation interface and tests; benchmark physics engines rather than building or choosing one on aesthetics |
| Agents and experts | Planning and recommendations do not confer execution or medical authority; consequential actions require scoped approval and audit |
| Truthful visualization | A scene is a view of authoritative state, not a second database or evidence that something happened |
| Falsifiability | Stop, simplify or de-scope features when measured evidence does not justify their burden |

**Current renderer is not the long-term scientific architecture.** React/Three.js and the Pascal viewer are useful current browser/product implementations. Higher-fidelity Blender-as-code authoring and Unreal-class real-time visualization may be evaluated for the larger twin; no renderer should become the evidence store, simulation authority, or mandatory rewrite without a measured reason. Keep publication-safe stills and lightweight fallback views for the public website.

The shared scientific interfaces, provenance schemas, deterministic replay fixtures, test vectors, physics benchmarks, and intent/authority contracts should be **open and reusable when safe**. Participant histories, identifying video, clinical data, secrets, and sensitive facility operational details stay private by default. Interoperability and external reproducibility are strategic assets, not an excuse to reveal private data.

## Staged delivery: evidence before scale

These are **gated stages**, not claims of shipped milestones or promises of construction dates.

| Stage | Minimum demonstrable result | Gate to move forward |
| --- | --- | --- |
| 0 — Public pretotype | Explain ACE honestly; show the facility sketch and approved, dated exports with factual status and accessible fallback | No fabricated LIVE/SHIPPED states or private assets; site works on mobile and without WebGL |
| 1 — Trusted pickleball observation | A calibrated real or deliberately synthetic rally, versioned official rules, deterministic replay, and a provenance-bearing evidence chain | Independent oracle/property tests for rules; uncertainty and source are explicit |
| 2 — One athlete feedback loop | Baseline one chosen skill, define an intervention and comparator first, involve the coach/user, observe a repeated session, report the result and uncertainty | Complete pre/post receipt; negative outcomes reported; no causal claim beyond experimental design |
| 3 — Validated prediction and personalization | Compare physics and learning models with held-out real observations and strong simple baselines; test transfer from simulated choices to reality | Simulation and personalization outperform the simpler alternative for their **stated use**, or are restricted |
| 4 — Repeatability and portability | Falsify sport abstractions with a second sport; validate an expert/agent workflow; publish reusable non-sensitive interfaces and examples | Explicit external conformance tests, authorization tests, replication and participant experience |
| 5 — Physical and ecosystem scale | Evaluate spaces, partnerships, facilities, sensors, robotics, learning/community, agriculture and sustainable operations against actual demand and evidence | Measured participant benefit, economics, accessibility, privacy and safety justify each addition |

The first complete vertical slice should be possible to explain in one sentence: **a real person tries a drill, ACE can show what was observed, what was predicted, who approved the change, what happened afterward, and what the system learned.**

For concrete implementation work, follow the [private evidence/architecture epic](https://github.com/kvnloo/ace-digital-twin/issues/109) and its child issues; do not duplicate private design documents in the public website.

## Falsifiers and stop rules

ACE should reduce or stop a subsystem when its basic value claim fails:

- A digital-twin model cannot predict held-out real outcomes better than simple baselines: **use it for descriptive replay only**.
- More sensors fail to improve good decisions: **measure less**.
- Personalized intervention adds no improvement beyond a strong standard protocol: **prefer the standard protocol**.
- Simulation rankings do not transfer to reality: **limit them to research/visualization**.
- Agents cost experts more review than they save: **narrow to retrieval and documentation**.
- Continuous measurement undermines autonomy or enjoyment: **turn measurement off or give the person stronger control**.
- Multidisciplinary routing adds cost without benefit: **simplify collaboration**.
- Consent, retention, clinical authority, or safety cannot be enforced: **do not launch that feature**.

Operationally, invalid calibration, absent/revoked consent, missing provenance, out-of-domain models, expert override, or an adverse event should suspend the affected automation. Fail toward human judgment and reduced capability, not confident automation.

## Repository ownership and presentation rules

- **[kvnloo/ace](https://github.com/kvnloo/ace):** Public mission, narrative, evidence-status language, accessible user journeys, publication-safe media, and the visual design constitution. It does **not** run private physics, live facility controls, clinical decision-making, or unapproved personal twins.
- **[kvnloo/ace-digital-twin](https://github.com/kvnloo/ace-digital-twin):** Private current sport/facility twin runtime and the technical experiment backlog. The [ACE meta issue #109](https://github.com/kvnloo/ace-digital-twin/issues/109) defines the broader research direction; that vision is **not synonymous with features on its main branch**.
- **Related OSS:** Physics, sensing, 3D formats, rules formalization, agent orchestration, activity/evidence and infrastructure are integration candidates. A shared contract and benchmark must precede claims that a project is actually integrated.

For every public feature/copy change ask: **Which human goal does this serve? What is observation versus simulation? What actually runs? What evidence would disprove this claim? What would we remove if it does not help?** Use [the design constitution](DESIGN.md) for the flow-state UI, and the README's **LIVE / SHIPPED / RESEARCH / VISION / SPEC / MOCK / PRETOTYPE** vocabulary without substitution.

## Open decisions (intentionally unresolved)

1. Which first skill, participant population and comparator make the athlete pilot both meaningful and ethically appropriate?
2. What calibrated sensor minimum reliably supports that claim, with least invasive data collection?
3. When do higher-fidelity rendering, articulated simulation, more sports, or a physical building improve outcomes enough to justify their complexity?
4. Which experts, partner organizations, governance arrangements, and accessibility requirements are needed for a real pilot?
5. Which interoperable schemas can be published independently without exposing identifiable athlete or facility data?
6. Which experience outcomes must improve before ACE expands beyond the first proving ground?

These are research questions, not placeholders to fill with invented certainty. The long-term ambition may be expansive; **deployment authority comes from reproducible evidence and human consent, one working loop at a time**.
