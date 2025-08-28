// server start

import { app } from './app';
import { loadEnv } from './config/env';

const env = loadEnv();
const port = Number(env.PORT);
if (!port || isNaN(port) || port <= 0) {
  throw new Error('Invalid or missing PORT in environment configuration.');
}
app.listen(port, () => console.log(`API listening on :${port}`));



