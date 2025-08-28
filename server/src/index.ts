// server start

import { app } from 'server/src/app';
import { loadEnv } from 'server/src/config/env';

const env = loadEnv();
app.listen(env.PORT, () => console.log(`API listening on :${env.PORT}`));
