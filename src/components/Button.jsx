import { EVENTS, track } from '../analytics/analytics.js';

const VARIANTS = {
  primary: 'bg-accent text-white hover:bg-accent-hover',
  light: 'bg-paper text-navy-900 hover:bg-white',
  outlineLight: 'border border-white/30 text-white hover:border-white/60 hover:bg-white/5',
  outline: 'border border-line bg-white text-ink hover:border-navy-600/40 hover:bg-paper',
};

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-[0.95rem] font-semibold ' +
  'transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60';

/**
 * Renders an <a> when `href` is given, otherwise a <button>.
 * Pass `ctaId` to record an employer_cta_clicked event (label + location only).
 */
export default function Button({ href, variant = 'primary', ctaId, ctaLocation, className = '', onClick, children, ...rest }) {
  const classes = `${BASE} ${VARIANTS[variant]} ${className}`;
  const handleClick = (event) => {
    if (ctaId) track(EVENTS.EMPLOYER_CTA_CLICKED, { cta_id: ctaId, location: ctaLocation });
    onClick?.(event);
  };

  if (href) {
    return (
      <a href={href} className={classes} onClick={handleClick} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={classes} onClick={handleClick} {...rest}>
      {children}
    </button>
  );
}
