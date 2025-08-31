import { useEffect, useState } from 'react';

/**
 * LegacyClock
 *
 * A small React functional component that displays the current local time and updates it every second.
 *
 * Behavior:
 * - Initializes component state with the current time string using new Date().toLocaleTimeString().
 * - Uses useEffect to create a window.setInterval that updates the time state every 1000ms (1 second).
 * - Cleans up the interval on unmount via window.clearInterval to prevent memory leaks.
 *
 * Notes:
 * - The displayed time is formatted according to the user's locale (toLocaleTimeString()).
 * - This component relies on the global window object and is intended for client-side rendering.
 *
 * @returns {JSX.Element} A section element containing a heading and a paragraph with the current time.
 * @example
 * <LegacyClock />
 */
export default function LegacyClock() {
  const [now, setNow] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date().toLocaleTimeString());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section>
      <h2>Legacy Clock</h2>
      <p>{now}</p>
    </section>
  );
}
