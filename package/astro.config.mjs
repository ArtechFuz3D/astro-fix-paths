import { defineConfig } from 'astro/config';
import astroFixPaths from 'astro-fix-paths';

export default defineConfig({
  integrations: [astroFixPaths()],
});
