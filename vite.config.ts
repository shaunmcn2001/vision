/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const config = {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/tests/setup.ts'],
      include: ['src/**/*.{test,spec}.{js,ts,tsx}'],
      exclude: ['node_modules', 'dist'],
    },
  }

  // For production builds, add base path for GitHub Pages
  if (command === 'build' && mode === 'production') {
    // Get repository name from GitHub environment or use default
    const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'spark-template'
    config.base = `/${repoName}/`
  }

  return config
})