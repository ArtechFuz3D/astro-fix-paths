# astro-fix-paths

An AstroJS integration that fixes output paths for Itch.io deployment.

## Installation

```sh
npm install astro-fix-paths
```

### Add to your astro.config.mjs

```js
import { defineConfig } from 'astro/config';
import astroFixPaths from 'astro-fix-paths';

export default defineConfig({
  integrations: [astroFixPaths()],
});
```

[Play Space Bingo - Live Demo](https://artechfuz3d.itch.io/space-bingo)
