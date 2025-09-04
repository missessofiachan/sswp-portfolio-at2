import { useEffect, useMemo, useState } from 'react';
import * as s from './status.css';
import { getHealth, type HealthResponse } from '@client/api/clients/health.api';

type State = {
  loading: boolean;
  apiOk: boolean;
  dbOk: boolean;
  store: 'firestore' | 'memory' | null;
  latencyMs: number | null;
  lastChecked: number | null; // epoch ms
  error?: string;
};

export default function ConnectionStatus() {
  const [state, setState] = useState<State>({
    loading: true,
    apiOk: false,
    dbOk: false,
    store: null,
    latencyMs: null,
    lastChecked: null,
  });

  useEffect(() => {
    let mounted = true;
    let timer: number | undefined;

    const fetchOnce = async () => {
      try {
        const data: HealthResponse = await getHealth();
        if (!mounted) return;
        setState({
          loading: false,
          apiOk: true,
          dbOk: data.database.ok,
          store: data.database.store,
          latencyMs: data.database.latencyMs,
          lastChecked: Date.now(),
          error: data.database.ok ? undefined : data.database.error,
        });
      } catch (err) {
        if (!mounted) return;
        setState({
          loading: false,
          apiOk: false,
          dbOk: false,
          store: null,
          latencyMs: null,
          lastChecked: Date.now(),
          error: (err as Error)?.message ?? 'Network error',
        });
      }
    };

    fetchOnce();
    // Poll every 10s
    timer = window.setInterval(fetchOnce, 10_000);

    return () => {
      mounted = false;
      if (timer) window.clearInterval(timer);
    };
  }, []);

  const apiClass = useMemo(() => (state.loading ? s.idle : state.apiOk ? s.ok : s.bad), [state]);
  const dbClass = useMemo(() => (state.loading ? s.idle : state.dbOk ? s.ok : s.bad), [state]);

  return (
    <span className={s.wrap} title={state.error ?? undefined}>
      <span className={s.pill}>
        <span className={`${s.dot} ${apiClass}`} />
        <span>API</span>
      </span>
      <span className={s.pill}>
        <span className={`${s.dot} ${dbClass}`} />
        <span>
          DB
          {state.store ? (
            <span className={s.muted}>
              &nbsp;({state.store}
              {state.latencyMs != null ? ` ${state.latencyMs}ms` : ''})
            </span>
          ) : null}
        </span>
      </span>
    </span>
  );
}
