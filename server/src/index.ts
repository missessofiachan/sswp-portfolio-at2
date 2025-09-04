// server start

import { app } from './app';
import { loadEnv } from './config/env';

const env = loadEnv();
/**
 * TCP port number the API server will attempt to bind to.
 *
 * This value is parsed from the `PORT` environment variable via `Number(env.PORT)`.
 * If the variable is unset, empty, or not a valid numeric string, the result
 * will be `NaN` and should be considered invalid.
 *
 * @remarks
 * - Must be an integer in the inclusive range 0–65535.
 * - Always validate with `Number.isFinite(port)` and a range check before using.
 * - Supply a safe fallback (e.g. `3000`) if the environment is misconfigured.
 *
 * @constant
 * @type {number}
 * @see https://nodejs.org/api/process.html#processenv
 *
 * @example
 * // Validate and provide a fallback:
 * const port = Number(env.PORT);
 * const listenPort = Number.isFinite(port) && port >= 0 && port <= 65535
 *   ? port
 *   : 3000;
 */

const port = Number(env.PORT);
if (!port || isNaN(port) || port <= 0) {
  throw new Error('Invalid or missing PORT in environment configuration.');
}
app.listen(port, () => console.log(`API listening on :${port}`));
