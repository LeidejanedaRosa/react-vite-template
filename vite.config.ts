import { sentryVitePlugin } from '@sentry/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    ...(process.env.NODE_ENV === 'production' &&
    process.env.SENTRY_AUTH_TOKEN &&
    process.env.SENTRY_ORG &&
    process.env.SENTRY_PROJECT
      ? [
          sentryVitePlugin({
            org: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT,
            authToken: process.env.SENTRY_AUTH_TOKEN,
            sourcemaps: {
              assets: './dist/**',
              ignore: ['node_modules'],
              filesToDeleteAfterUpload: ['./dist/**/*.map'],
            },
            release: {
              name: process.env.VITE_APP_VERSION,
              setCommits: { auto: true, ignoreMissing: true },
            },
            telemetry: false,
          }),
        ]
      : []),
    ...(process.env.ANALYZE === 'true'
      ? [
          visualizer({
            open: true,
            filename: 'dist/stats.html',
            gzipSize: true,
            brotliSize: true,
          }),
        ]
      : []),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@features': path.resolve(__dirname, './src/features'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@types': path.resolve(__dirname, './src/types'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@services': path.resolve(__dirname, './src/services'),
    },
  },

  build: {
    outDir: 'dist',
    target: 'es2022',
    sourcemap: process.env.NODE_ENV === 'production' ? 'hidden' : false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-sentry': ['@sentry/react'],
        },
      },
    },
  },

  server: {
    port: 5173,
    open: true,
    host: true,
  },

  preview: {
    port: 4173,
    host: true,
  },
})
