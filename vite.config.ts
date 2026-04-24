import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  base: '/',
  // @ts-ignore vite-ssg extends UserConfig with ssgOptions
  ssgOptions: {
    // Exclude workspace from SSG — it uses browser-only APIs at module level
    includedRoutes(paths: string[]) {
      return paths.filter((p: string) => p !== '/workspace')
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
          return undefined
        },
      },
    },
  },
})
