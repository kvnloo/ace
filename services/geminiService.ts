type HistoryItem = { role: string; parts: { text: string }[] };

const concise = (text: string) => text.replace(/\s+/g, ' ').trim();

const answers: Array<{ test: RegExp; answer: string }> = [
  {
    test: /live|shipped|working|status/i,
    answer:
      'The public Pages site is a PRETOTYPE. A private racquet digital twin and Facility OS exist elsewhere. The evidence spine, WorldKernel/physics bakeoff, intervention-response loop, expert graph, traceable 3D loop, and machine-checkable sport laws are active RESEARCH or VISION, not shipped claims.',
  },
  {
    test: /doctor|physician|pt|physical therap|expert|coach|nutrition/i,
    answer:
      'ACE treats experts as first-class architecture. Coaches, PTs, physicians, nutritionists, biomechanists, researchers, farmers, engineers, peers, and mentors should receive purpose-scoped access and retain authority for consequential actions. Agents are meant to extend attention and coordination, not replace expertise.',
  },
  {
    test: /digital twin|twin/i,
    answer:
      'ACE treats a personal twin as an evidence graph, not a synthetic copy of a person. Observations, estimates, hypotheses, simulations, interventions, and verified outcomes stay distinct with provenance and uncertainty. The 3D world is a projection of that state, never the source of truth.',
  },
  {
    test: /sport|pickleball|tennis|badminton|rules/i,
    answer:
      'Sports are ACE’s first proving ground. Pickleball 2026 is the current rules testbed: a small sport-blind transition protocol, an independent pickleball package, deterministic differential tapes, and formal-law experiments. Other sports should extend the protocol rather than force one giant universal rules schema.',
  },
  {
    test: /simulate|physics|worldkernel|world kernel/i,
    answer:
      'ACE is researching a backend-neutral WorldKernel for time, bodies, contacts, surfaces, trajectories, and deterministic replay. Sport packages assign meaning after the physical observation. Physics backends should be benchmarked against measured cases before ACE trusts simulation-derived coaching decisions.',
  },
  {
    test: /blueprint|bryan johnson/i,
    answer:
      'ACE is inspired by the ambition behind quantified-self and Blueprint-style continuous measurement, but it is independent and broader. The goal is to connect measurement to experts, simulation, learning, nutrition, environment, community, intervention, and verified follow-up rather than stop at a personal dashboard.',
  },
  {
    test: /learn|personal|intervention|plateau/i,
    answer:
      'ACE personalization is meant to learn from measured response to interventions, not fixed learning-style labels. A narrow first loop is: baseline observation → capability estimate → coaching hypothesis → human-approved intervention → repeated measurement → update the belief or reject the hypothesis.',
  },
  {
    test: /farm|agriculture|food/i,
    answer:
      'Controlled-environment agriculture is part of the broader campus vision where it genuinely supports nutrition, food systems, experimentation, and facility operations. It is not treated as proof that nutrition outcomes are optimized; those links need their own evidence and intervention-response studies.',
  },
];

export const sendQueryToConcierge = async (history: HistoryItem[]): Promise<string> => {
  const latest = history.at(-1)?.parts.map((part) => part.text).join(' ') ?? '';
  const hit = answers.find((entry) => entry.test.test(latest));
  if (hit) return hit.answer;

  return concise(
    'ACE is a public pretotype for a human-flourishing feedback loop: set a goal, observe reality, update evidence-backed digital twins, form hypotheses, simulate options, connect the right humans and agents, intervene with scoped authority, measure again, verify the outcome, and learn. Ask me about the digital twin, experts, sports, simulation, personalized learning, the campus, or what is actually live.',
  );
};
