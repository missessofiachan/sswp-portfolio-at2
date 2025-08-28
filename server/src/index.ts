// server start

import { app } from './app';
import { loadEnv } from './config/env';

const env = loadEnv();
/**
 * The port number derived from the PORT environment variable.
 *
 * This value is produced by converting process.env.PORT with Number(...).
 * If the variable is unset or not a numeric string the result may be NaN.
 *
 * Consumers should validate this constant (for example with Number.isFinite and a range check
 * for 0–65535) or supply a safe fallback before using it to bind a server.
 *
 * @constant
 * @type {number}
 * @see https://nodejs.org/api/process.html#processenv
 * @example
 * // Example validation and fallback:
 * // const listenPort = Number.isFinite(port) ? port : 3000;
 */
const port = Number(env.PORT);
if (!port || isNaN(port) || port <= 0) {
  throw new Error('Invalid or missing PORT in environment configuration.');
}
app.listen(port, () => console.log(`API listening on :${port}`));



