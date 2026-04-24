import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
plugins: [vue()],
base: "./", // Относительный путь, чтобы файлы были в корне
build: {
  sourcemap: false, // Disable sourcemaps in production for security
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['vue', 'vue-i18n'],
        widgets: ['@/components/*.vue'],
      },
    },
  },
},
});
