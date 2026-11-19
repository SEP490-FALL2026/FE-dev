import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const targetRelativePaths = [
  'dist/cli/index.js',
  'dist/vite/cloudflare.js',
  'dist/vite.js',
];

const packageBasePath = resolve(process.cwd(), 'node_modules/@react-router/dev');

for (const relativePath of targetRelativePaths) {
  const targetFilePath = resolve(packageBasePath, relativePath);
  if (!existsSync(targetFilePath)) {
    continue;
  }

  const originalContent = readFileSync(targetFilePath, 'utf8');
  if (originalContent.includes('envFile: false')) {
    const updatedContent = originalContent.replaceAll('envFile: false', 'envDir: false');
    writeFileSync(targetFilePath, updatedContent, 'utf8');
    console.log(`[patch] Patched Vite 8 compatibility in @react-router/dev/${relativePath}`);
  }
}
