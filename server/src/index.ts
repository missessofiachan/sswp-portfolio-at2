// server start

import { app } from './app';
import { loadEnv } from './config/env';

const env = loadEnv();
app.listen(env.PORT, () => console.log(`API listening on :${env.PORT}`));
