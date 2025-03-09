import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { createWriteStream } from 'fs'; // Fixed: Import createWriteStream directly
import { join, relative, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';
import axios from 'axios';
import FormData from 'form-data';
import { exec } from 'child_process';

export default function astroItchioPublisher({ itchProject, apiKey, useButler = false } = {}) {
  return {
    name: 'astro-itchio-publisher',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const distDir = fileURLToPath(dir);
        console.log('🚀 Starting astro-itchio-publisher...');

        // Step 1: Fix Paths
        console.log('📝 Fixing paths in dist folder...');
        const fixFile = (filePath) => {
          let content = readFileSync(filePath, 'utf8');
          const fileDir = resolve(dirname(filePath));
          const relPath = relative(distDir, fileDir);
          const depth = relPath === '' ? 0 : relPath.split('/').length;
          const prefix = depth > 0 ? '../'.repeat(depth) : './';

          console.log(`  - Processing: ${relative(distDir, filePath)}`);
          content = content.replace(/(href|src)="\/([^"]*)"/g, (match, attr, path) => {
            if (path.startsWith('http')) return match;
            if (attr === 'href' && !path.startsWith('_astro') && !path.includes('.')) {
              const normalizedPath = path.replace(/^\/|\/$/g, '');
              const fixedPath = normalizedPath === '' ? 'index.html' : `${normalizedPath}/index.html`;
              return `${attr}="${prefix}${fixedPath}"`;
            }
            return `${attr}="${prefix}${path}"`;
          });

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
        console.log('✅ Paths fixed successfully!');

        // Step 2: Zip dist folder
        console.log('📦 Zipping dist folder...');
        const zipFile = 'astro-itchio-publisher-dist.zip';
        await new Promise((resolve, reject) => {
          const output = createWriteStream(zipFile); // Fixed: Use createWriteStream
          const archive = archiver('zip', { zlib: { level: 9 } });

          output.on('close', () => {
            console.log(`  - Created ${zipFile} (${archive.pointer()} bytes)`);
            resolve();
          });

          archive.on('error', (err) => {
            console.error('  - Zipping failed:', err.message);
            reject(err);
          });

          archive.pipe(output);
          archive.directory(distDir, false);
          archive.finalize();
        });

        // Step 3: Upload to Itch.io
        if (!itchProject) {
          console.log('⚠️ No Itch.io project specified (e.g., "username/project:channel"). Skipping upload.');
          console.log('🎉 Build complete (without upload).');
          return;
        }

        if (useButler) {
          console.log('🌐 Uploading to Itch.io with Butler...');
          const butlerPath = process.platform === 'win32' ? 'butler.exe' : 'butler';
          if (!existsSync(butlerPath)) {
            console.log('⚠️ Butler not found. Install it from https://itch.io/docs/butler/');
            console.log(`  Then run: ${butlerPath} login`);
            console.log('  Alternatively, set useButler: false and provide an apiKey.');
            throw new Error('Butler not installed');
          }

          const command = `${butlerPath} push ${zipFile} ${itchProject}`;
          await new Promise((resolve, reject) => {
            exec(command, (err, stdout, stderr) => {
              if (err) {
                console.error('  - Upload failed:', stderr);
                reject(err);
              } else {
                console.log('  - Upload successful!');
                console.log(stdout);
                resolve();
              }
            });
          });
        } else {
          if (!apiKey) {
            console.log('⚠️ No API key provided for API upload. Skipping.');
            console.log('  - Get your API key from https://itch.io/user/settings/api-keys');
            console.log('  - Add { apiKey: "your-api-key" } to astro.config.mjs');
            console.log('  - Or set useButler: true and install Butler.');
            console.log('🎉 Build complete (without upload).');
            return;
          }

          console.log('🌐 Uploading to Itch.io via API...');
          const [username, project, channel] = itchProject.split(/[:\/]/);

          try {
            const uploadResponse = await axios.post(
              `https://api.itch.io/games/${project}/upload`,
              { channel_name: channel },
              { headers: { Authorization: `Bearer ${apiKey}` } }
            );
            const uploadUrl = uploadResponse.data.upload_url;

            const form = new FormData();
            form.append('file', readFileSync(zipFile), zipFile);

            await axios.post(uploadUrl, form, {
              headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${apiKey}`,
              },
            });

            console.log('  - Upload successful!');
          } catch (err) {
            console.error('  - Upload failed:', err.response?.data?.errors || err.message);
            throw err;
          }
        }

        console.log('🎉 Publishing to Itch.io complete!');
      },
    },
  };
}