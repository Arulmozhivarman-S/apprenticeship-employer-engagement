import { useEffect, useSyncExternalStore } from 'react';
import { getEvents, subscribe, trackOnce } from './analytics.js';

/** Subscribe a component to the in-memory event log. */
export function useAnalyticsEvents() {
  return useSyncExternalStore(subscribe, getEvents, getEvents);
}

/** Fire an event once, the first time the element is ~40% visible. */
export function useTrackOnView(ref, eventName, props) {
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackOnce(eventName, props);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
    // props are static labels; intentionally not a dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, eventName]);
}
