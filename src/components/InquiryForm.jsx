import { cloneElement, useEffect, useMemo, useRef, useState } from 'react';
import { CircleAlert, CircleCheck, FlaskConical } from 'lucide-react';
import {
  AREAS_OF_INTEREST, EMPTY_INQUIRY, INQUIRY_FIELD_ORDER, MESSAGE_MAX, isLikelyPersonalEmail, validateInquiry,
} from '../utils/inquiryValidation.js';
import { EVENTS, track } from '../analytics/analytics.js';
import Button from './Button.jsx';

const SIMULATED_DELAY_MS = 700;

/**
 * DEMO MODE: nothing is transmitted or stored. Values live in React state
 * only and are cleared after the simulated submission. The analytics event
 * carries the chosen area of interest (a fixed category), never personal data.
 */
export default function InquiryForm() {
  const [values, setValues] = useState(EMPTY_INQUIRY);
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | submitting | success
  const [submittedName, setSubmittedName] = useState('');
  const startedRef = useRef(false);
  const formRef = useRef(null);
  const successRef = useRef(null);
  const timerRef = useRef(null);

  const errors = useMemo(() => validateInquiry(values), [values]);
  const showError = (name) => (touched[name] || submitAttempted ? errors[name] : undefined);

  useEffect(() => () => clearTimeout(timerRef.current), []);
  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    track(EVENTS.INQUIRY_FORM_STARTED, { location: 'inquiry_form' });
  };

  const update = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };
  const blur = (e) => setTouched((prev) => ({ ...prev, [e.target.name]: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    const firstInvalid = INQUIRY_FIELD_ORDER.find((name) => errors[name]);
    if (firstInvalid) {
      formRef.current?.elements.namedItem(firstInvalid)?.focus();
      return;
    }
    setStatus('submitting');
    timerRef.current = setTimeout(() => {
      track(EVENTS.INQUIRY_FORM_SUBMITTED_DEMO, { area_of_interest: values.area });
      setSubmittedName(values.name.trim().split(/\s+/)[0]);
      setValues(EMPTY_INQUIRY); // discard personal details immediately
      setTouched({});
      setSubmitAttempted(false);
      setStatus('success');
    }, SIMULATED_DELAY_MS);
  };

  const startOver = () => {
    startedRef.current = false;
    setStatus('idle');
  };

  const errorCount = Object.keys(errors).length;
  const personalEmail = !errors.email && isLikelyPersonalEmail(values.email);

  return (
    <section id="inquiry" aria-labelledby="inquiry-title" className="on-navy bg-navy-900 py-20 text-white sm:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id="inquiry-title" className="text-3xl font-semibold tracking-tight sm:text-4xl" style={{ textWrap: 'balance' }}>
            Start a conversation with the program team
          </h2>
          <p className="mt-5 max-w-prose text-lg leading-relaxed text-white/75">
            Share a little about your organization and what you’d like to explore. There’s no commitment involved in
            asking questions.
          </p>
          <div className="mt-8 flex gap-3 rounded-lg border border-accent-light/30 bg-white/[0.04] p-4">
            <FlaskConical aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-accent-light" />
            <p className="text-sm leading-relaxed text-white/80">
              <span className="font-semibold text-white">Demo mode.</span> This form doesn’t send or save anything. It
              won’t contact Northeastern University, and your details are cleared as soon as you submit.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-xl bg-paper p-6 text-ink sm:p-8">
            {status === 'success' ? (
              <div ref={successRef} tabIndex={-1} role="status" className="py-6 focus:outline-none">
                <CircleCheck aria-hidden="true" className="h-10 w-10 text-accent" strokeWidth={1.75} />
                <h3 className="mt-4 text-2xl font-semibold tracking-tight">
                  Demo inquiry complete{submittedName ? `, ${submittedName}` : ''}
                </h3>
                <p className="mt-3 max-w-prose leading-relaxed text-ink-muted">
                  Nothing was sent. In a live version, your message would go to the program team. This prototype has not
                  contacted the university or submitted a real inquiry, and the details you entered have been cleared.
                </p>
                <Button variant="outline" className="mt-6" onClick={startOver}>
                  Start a new demo inquiry
                </Button>
              </div>
            ) : (
              <form ref={formRef} noValidate onSubmit={handleSubmit} onFocus={markStarted}>
                {submitAttempted && errorCount > 0 && (
                  <div role="alert" className="mb-6 flex gap-2 rounded-md border border-red-800/30 bg-red-50 px-4 py-3 text-sm text-red-900">
                    <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                    {errorCount === 1 ? 'One field needs attention.' : `${errorCount} fields need attention.`} Check the
                    messages below.
                  </div>
                )}

                <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                  <Field label="Name" name="name" required error={showError('name')}>
                    <input type="text" autoComplete="name" value={values.name} onChange={update} onBlur={blur} />
                  </Field>
                  <Field
                    label="Work email"
                    name="email"
                    required
                    error={showError('email')}
                    hint={personalEmail ? 'This looks like a personal address. A work email helps route your inquiry.' : undefined}
                  >
                    <input type="email" autoComplete="email" value={values.email} onChange={update} onBlur={blur} />
                  </Field>
                  <Field label="Organization" name="organization" required error={showError('organization')}>
                    <input type="text" autoComplete="organization" value={values.organization} onChange={update} onBlur={blur} />
                  </Field>
                  <Field label="Job title" name="jobTitle" optional error={showError('jobTitle')}>
                    <input type="text" autoComplete="organization-title" value={values.jobTitle} onChange={update} onBlur={blur} />
                  </Field>
                  <Field label="Area of interest" name="area" required error={showError('area')} className="sm:col-span-2">
                    <select value={values.area} onChange={update} onBlur={blur}>
                      <option value="">Choose an area</option>
                      {AREAS_OF_INTEREST.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field
                    label="Message"
                    name="message"
                    optional
                    error={showError('message')}
                    hint={`${values.message.length} of ${MESSAGE_MAX} characters`}
                    className="sm:col-span-2"
                  >
                    <textarea rows={4} value={values.message} onChange={update} onBlur={blur} />
                  </Field>
                </div>

                <div className="mt-7 flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[0.8rem] text-ink-muted">Demo mode: nothing is sent or stored.</p>
                  <Button type="submit" disabled={status === 'submitting'} className="w-full sm:w-auto">
                    {status === 'submitting' ? 'Completing demo…' : 'Submit demo inquiry'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Wires label, hint, error, and ARIA attributes onto a single child control. */
function Field({ label, name, required, optional, error, hint, className = '', children }) {
  const id = `inquiry-${name}`;
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined;
  const control = cloneElement(children, {
    id,
    name,
    required,
    'aria-invalid': error ? 'true' : 'false',
    'aria-describedby': describedBy,
    className: `field-input ${children.type === 'textarea' ? 'resize-y' : ''}`,
  });

  return (
    <div className={className}>
      <label htmlFor={id} className="flex items-baseline justify-between text-[0.95rem] font-medium">
        <span>{label}</span>
        {optional && <span className="text-[0.8rem] font-normal text-ink-muted">Optional</span>}
      </label>
      <div className="mt-2">{control}</div>
      {error && (
        <p id={`${id}-error`} className="mt-2 flex items-start gap-1.5 text-sm text-red-800">
          <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-[0.8rem] text-ink-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
