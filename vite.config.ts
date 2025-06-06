import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// import dns from 'dns'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/server-options.html#server-options
// dns.setDefaultResultOrder('verbatim')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    // host: '0.0.0.0', cấu hình mạng lan
    port: 3000, //5173
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler', // or "modern"
        silenceDeprecations: ['mixed-decls', 'color-functions', 'global-builtin', 'import']
      }
    }
  }
})