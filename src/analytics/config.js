/**
 * The analytics panel is a development tool, hidden from normal visitors.
 * It appears when running `npm run dev`, or on any build when the URL
 * includes ?analytics (handy for showing the demo on a deployed preview).
 */
export function isAnalyticsPanelEnabled() {
  if (import.meta.env?.DEV) return true;
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).has('analytics');
}
