/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NODE_ENV?: 'development' | 'production' | 'test';
  readonly MODE?: string;
  readonly BASE_URL?: string;
  readonly DEV?: boolean;
  readonly PROD?: boolean;
  readonly SSR?: boolean;
  // common project-specific VITE_ variables (allow any VITE_* as string/boolean)
  readonly VITE_API_URL?: string;
  readonly [key: `VITE_${string}`]: string | boolean | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/* Asset modules 
declare module '*.svg' {
  const src: string;
  export default src;
}
declare module '*.png' {
  const src: string;
  export default src;
}
declare module '*.jpg' {
  const src: string;
  export default src;
}
declare module '*.jpeg' {
  const src: string;
  export default src;
}
declare module '*.gif' {
  const src: string;
  export default src;
}
declare module '*.webp' {
  const src: string;
  export default src;
}
declare module '*.avif' {
  const src: string;
  export default src;
}
declare module '*.ico' {
  const src: string;
  export default src;
}
*/
export {};
