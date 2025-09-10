import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <section aria-labelledby="unauthorized-title" style={{ maxWidth: 640, margin: '2rem auto' }}>
      <h1 id="unauthorized-title">Unauthorized</h1>
      <p>You don’t have permission to view this page.</p>
      <ul>
        <li>Try logging in with an account that has the required access.</li>
        <li>
          Or go back to the <Link to="/">home page</Link>.
        </li>
      </ul>
    </section>
  );
}
