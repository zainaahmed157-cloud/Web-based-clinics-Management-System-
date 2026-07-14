import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      },
    },
    plugins: [react(), tailwindcss()],
    server: {
      port: 5174, 
      strictPort: true, 
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'https://clynk.vercel.app',
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: {
            "*": ""
          }
        }
      }
    }
  };
});
