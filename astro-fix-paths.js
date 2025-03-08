import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

export default function astroFixPaths() {
  return {
    name: 'astro-fix-paths',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const distDir = fileURLToPath(dir);

        const fixFile = (filePath) => {
          let content = readFileSync(filePath, 'utf8');
          const fileDir = resolve(dirname(filePath));
          const relPath = relative(distDir, fileDir);
          const depth = relPath === '' ? 0 : relPath.split('/').length;
          const prefix = depth > 0 ? '../'.repeat(depth) : './';

          console.log(`Fixing paths in: ${filePath}`);

          content = content.replace(/(href|src)="\/([^"]*)"/g, (match, attr, path) => {
            if (path.startsWith('http')) return match; // Ignore external links

            if (attr === 'href' && !path.startsWith('_astro') && !path.includes('.')) {
              const normalizedPath = path.replace(/^\/|\/$/g, '');
              const fixedPath = normalizedPath === '' ? 'index.html' : `${normalizedPath}/index.html`;
              return `${attr}="${prefix}${fixedPath}"`;
            }

            return `${attr}="${prefix}${path}"`;
          });

          // Fix leftover `./` paths in subdirectories
          if (depth > 0) {
            content = content.replace(/(href|src)="\.\/([^"]*)"/g, (match, attr, path) => {
              return `${attr}="${prefix}${path}"`;
            });
          }

          writeFileSync(filePath, content, 'utf8');
        };

        const processDir = (dir) => {
          readdirSync(dir).forEach((file) => {
            const fullPath = join(dir, file);
            if (statSync(fullPath).isDirectory()) {
              processDir(fullPath);
            } else if (fullPath.endsWith('.html') || fullPath.endsWith('.js')) {
              fixFile(fullPath);
            }
          });
        };

        processDir(distDir);
        console.log('✅ Paths fixed in dist folder.');
      },
    },
  };
}
