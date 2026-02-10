import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [tailwind()],

  vite: {
    plugins: [tailwindcss()],
  },
});