# Astro Itchio Publisher

An AstroJS integration that automates deployment to Itch.io by fixing paths, zipping your `dist` folder, and optionally uploading it via the Itch.io API or Butler. Perfect for manual uploads too—just fix paths and zip!

## Installation

```sh
npm install astro-itchio-publisher
```

## Usage

### Install the package:

```sh
npm install astro-itchio-publisher
```

### Configure in `astro.config.mjs`:

#### API Method (Automated Upload):

```javascript
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
```

#### Butler Method (Automated Upload):

**Install Butler**: Download and run `butler login`.

```javascript
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
```

#### Manual Upload Method (Path Fixing + Zip Only):

No upload config needed—just add the integration.

```javascript
import { defineConfig } from 'astro/config';
import astroItchioPublisher from 'astro-itchio-publisher';

export default defineConfig({
  integrations: [
    astroItchioPublisher()
  ]
});
```

### Build your project:

```sh
npm run build
```

This fixes paths and zips `dist` into `astro-itchio-publisher-dist.zip`.

- For API/Butler, it uploads automatically.
- For manual, upload the zip to Itch.io yourself.

## Options

- `itchProject`: Your Itch.io project (e.g., `username/project:channel`).
- `apiKey`: Required for API method, from Itch.io settings.
- `useButler`: Set to `true` for Butler, `false` for API (default: `false`).

## Links

- [npm](https://www.npmjs.com/package/astro-itchio-publisher)
- [GitHub](https://github.com/ArtechFuz3D/astro-itchio-publisher)
- [HomePage](https://artechfuz3d.github.io/astro-itchio-publisher/)
- [Live Demo](https://artechfuz3d.itch.io/space-bingo)

## Contributing

Built with ❤️ by Neill Hewitt. Open issues or PRs on GitHub!
