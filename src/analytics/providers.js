/**
 * Analytics providers. Each provider receives already-sanitized events.
 *
 * Only the console provider is active. The example below shows the shape a
 * real integration would take; it is intentionally NOT registered, and no
 * analytics account is connected to this prototype.
 *
 * export const ga4Provider = {
 *   name: 'ga4',
 *   send: (event) => window.gtag?.('event', event.name, event.props),
 * };
 */
export const consoleProvider = {
  name: 'console',
  send(event) {
    console.info(`[analytics:demo] ${event.name}`, event.props, event.timestamp);
  },
};
