// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

const isProduction = process.env.NODE_ENV === 'production' && process.env.CF_PAGES;

// Use node adapter for local dev, cloudflare for production
const adapter = isProduction
  ? (await import('@astrojs/cloudflare')).default()
  : node({ mode: 'standalone' });

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [react()],
  adapter,

  vite: {
    plugins: [tailwindcss()],
  }
});
