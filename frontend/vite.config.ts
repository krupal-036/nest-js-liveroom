import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react(), tailwindcss()],
    
    define: {
      'process.env': {} 
    },
    
    server: {
      proxy: (mode === 'development' || env.VITE_ENABLE_PROXY === 'true') ? {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
        },
      } : undefined,
    },
    
    build: {
      outDir: '../backend/public',
      emptyOutDir: true,
      target: 'node14', 
      modulePreload: false, 
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          inlineDynamicImports: true, 
          entryFileNames: `assets/js/[name].js`,
          chunkFileNames: `assets/js/[name].js`,
          assetFileNames: (assetInfo) => {
            const name = assetInfo.name || 'assets';
            const info = name.split('.');
            const ext = info[info.length - 1];
            if (ext === 'css') {
              return `assets/css/[name].[ext]`;
            }
            return `assets/[name].[ext]`;
          }
        }
      }
    }
  }
})
