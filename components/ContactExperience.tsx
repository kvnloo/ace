import React from 'react';
import { product } from '../landing/public.ts';

const roles = [
  'Athlete / member',
  'Coach',
  'Clinician / PT',
  'Researcher',
  'Engineer',
  'Technology partner',
  'Potential investor',
] as const;

const ContactExperience: React.FC = () => {
  const [goal, setGoal] = React.useState('');
  const [role, setRole] = React.useState('');
  const hasGoal = goal.trim().length > 2;
  const hasRole = role.length > 0;

  return (
    <div className="ace-contact-page" data-ace-reveal data-ace-section="Contact">
      <header className="ace-contact-head">
        <div>
          <p className="ace-kicker">MOCK · DOES NOT SUBMIT</p>
          <h1>Begin with <span>your goal.</span></h1>
        </div>
        <p>
          ACE should organize itself around what a person is trying to improve. This public pretotype
          does not transmit or store this form.
        </p>
      </header>

      <div className="ace-contact-layout">
        <aside className="ace-contact-context">
          <span className="ace-stamp" data-stamp="VISION">HUMANS ARE INFRASTRUCTURE</span>
          <h2>Bring a problem worth measuring.</h2>
          <p>
            A real goal comes first. Evidence, experts, agents, facilities and simulations only become
            relevant after the system understands what the person is trying to change.
          </p>
          <div className="ace-contact-principle">
            <span>GOAL</span><i /><span>CONTEXT</span><i /><span>RIGHT HUMAN</span>
          </div>
        </aside>

        <form className="ace-contact-form ace-goal-form" onSubmit={(e) => e.preventDefault()} aria-label="ACE interest form mock">
          <div className="ace-field ace-goal-field">
            <label htmlFor="ace-goal" className="ace-label">What do you want ACE to help you improve?</label>
            <textarea
              id="ace-goal"
              className="ace-textarea"
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              placeholder="A skill, plateau, recovery question, research problem, facility idea..."
              aria-describedby="ace-goal-help"
            />
            <p id="ace-goal-help" className="ace-field-help">Start with the outcome. The system should earn the right to ask for more.</p>
          </div>

          <div className="ace-progressive-field" data-open={hasGoal ? 'true' : 'false'} aria-hidden={!hasGoal}>
            {hasGoal && (
              <div className="ace-field">
                <label htmlFor="ace-role" className="ace-label">Which perspective are you bringing?</label>
                <select
                  id="ace-role"
                  className="ace-select"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                >
                  <option value="">Choose only if useful</option>
                  {roles.map((item) => <option key={item}>{item}</option>)}
                </select>
              </div>
            )}
          </div>

          <div className="ace-progressive-field" data-open={hasRole ? 'true' : 'false'} aria-hidden={!hasRole}>
            {hasRole && (
              <>
                <div className="ace-form-grid">
                  <div className="ace-field">
                    <label htmlFor="ace-name" className="ace-label">Name</label>
                    <input id="ace-name" type="text" className="ace-input" autoComplete="name" />
                  </div>
                  <div className="ace-field">
                    <label htmlFor="ace-email" className="ace-label">Email</label>
                    <input id="ace-email" type="email" className="ace-input" autoComplete="email" />
                  </div>
                </div>
                <button type="button" className="ace-disabled-cta" aria-disabled="true">Waitlist integration planned</button>
              </>
            )}
          </div>

          <div className="ace-contact-meta">
            <span>PRETOTYPE / NO SUBMISSION</span>
            <span>NO MEDICAL OR PERFORMANCE CLAIM IMPLIED</span>
            <span>{product.host.toUpperCase()}</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactExperience;
