Astro Itchio Publisher Monorepo
This monorepo contains:
package/: The astro-itchio-publisher npm package.

website/: The landing page on GitHub Pages.

Setup
Install root dependencies:

npm install

Install package dependencies:

cd package && npm install

Install website dependencies:

cd website && npm install

Commands
Build package: npm run build:package

Publish package: npm run publish:package

Build website: npm run build:website

Deploy website: npm run deploy:website

Preview website: cd website && npm run dev

See package/README.md for usage details.

