/**
 * NotFound
 *
 * Renders a simple 404 "Page Not Found" heading for unmatched routes.
 *
 * Intended to be used as a fallback/catch-all route component (for example,
 * as the last route in a React Router <Routes> configuration) to indicate
 * that the requested page does not exist.
 *
 * @returns {JSX.Element} A heading element displaying "404 – Page Not Found".
 */
export default function NotFound() {
  return <h1>404 – Page Not Found</h1>;
}
