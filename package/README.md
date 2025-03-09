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


Astro Itchio Publisher
An AstroJS integration that automates deployment to Itch.io by fixing paths, zipping your dist folder, and uploading it via the Itch.io API or Butler.
Usage
Install the package:

npm install astro-itchio-publisher

Configure in astro.config.mjs:
API Method (Default):
javascript

import { defineConfig } from 'astro/config';
import astroItchioPublisher from 'astro-itchio-publisher';

export default defineConfig({
  integrations: [
    astroItchioPublisher({
      itchProject: 'your-username/your-game:html5',
      apiKey: 'your-itchio-api-key' // From https://itch.io/user/settings/api-keys
    })
  ]
});

Butler Method:
Install Butler: Download and run butler login.

javascript

import { defineConfig } from 'astro/config';
import astroItchioPublisher from 'astro-itchio-publisher';

export default defineConfig({
  integrations: [
    astroItchioPublisher({
      itchProject: 'your-username/your-game:html5',
      useButler: true
    })
  ]
});

Build and Deploy:

npm run build

Fixes paths, zips dist, and uploads to Itch.io using your chosen method.

Options
itchProject: Your Itch.io project (e.g., username/project:channel).

apiKey: Required for API method, from Itch.io settings.

useButler: Set to true for Butler, false for API (default: false).

Links
npm

GitHub

