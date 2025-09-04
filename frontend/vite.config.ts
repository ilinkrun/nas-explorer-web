import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // 루트 디렉토리의 .env 파일을 로드
  const env = loadEnv(mode, path.resolve(__dirname, '..'), '');
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: parseInt(env.FRONTEND_PORT) || 11531,
      host: '0.0.0.0',
    },
    preview: {
      port: parseInt(env.FRONTEND_PORT) || 11531,
      host: '0.0.0.0',
    },
    envDir: '..',  // 상위 디렉토리의 .env 파일 사용
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          }
        }
      }
    },
  };
});