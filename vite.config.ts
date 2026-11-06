import { sentryVitePlugin } from '@sentry/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

import { resolveSentryBuild } from './src/lib/sentryBuild'

const sentryBuild = resolveSentryBuild(process.env)

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    ...(sentryBuild
      ? [
          sentryVitePlugin({
            org: sentryBuild.org,
            project: sentryBuild.project,
            authToken: sentryBuild.authToken,
            sourcemaps: {
              assets: './dist/**',
              ignore: ['node_modules'],
              filesToDeleteAfterUpload: ['./dist/**/*.map'],
            },
            release: {
              name: sentryBuild.release,
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
    // Gerados só quando vão ser enviados: o plugin apaga os .map depois do upload, então um
    // build sem Sentry publicaria esses arquivos.
    sourcemap: sentryBuild ? 'hidden' : false,
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
