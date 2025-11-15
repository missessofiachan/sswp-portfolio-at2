import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths(), vanillaExtractPlugin()],
  server: {
    port: 5173,
    proxy: {
      // Forward API requests during development
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        // Keep the /api prefix so client can use '/api/v1/*'
      },
    },
  },
});
