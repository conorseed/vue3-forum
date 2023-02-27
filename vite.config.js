import { defineConfig } from "vite";
import vue from '@vitejs/plugin-vue'

const path = require("path")

export default defineConfig({
  plugins: [
    vue()
  ],
  resolve:{
    alias:{
      "@": path.resolve(__dirname, "./src")
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id)=>{
          if (id.includes('firebase')) {
            return 'firebase';
          }
          else if (id.includes('lodash')) {
            return 'lodash';
          }
          else if (id.includes('components')) {
            return 'components';
          }
          else if (id.includes('composables')) {
            return 'composables';
          }
          else if (id.includes('plugins')) {
            return 'plugins';
          }
          else if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
})
