import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { defineConfig, type Plugin, type ResolvedConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** Every file under dir, as posix paths relative to root. */
function listFiles(root: string, dir = root): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? listFiles(root, full) : [relative(root, full).split('\\').join('/')];
  });
}

/**
 * Stamps dist/sw.js with a build id and the list of files to precache, so each
 * deploy gets its own cache and a replaced sprite can never be served stale.
 */
function stampServiceWorker(): Plugin {
  let config: ResolvedConfig;
  return {
    name: 'stamp-service-worker',
    apply: 'build',
    configResolved(resolved) {
      config = resolved;
    },
    closeBundle() {
      const outDir = join(config.root, config.build.outDir);
      const files = listFiles(outDir).filter((file) => file !== 'sw.js');
      const hash = createHash('sha256');
      for (const file of files) hash.update(file).update(readFileSync(join(outDir, file)));
      const buildId = hash.digest('hex').slice(0, 10);

      const swPath = join(outDir, 'sw.js');
      const stamped = readFileSync(swPath, 'utf8')
        .replace('__BUILD_ID__', buildId)
        .replace("'__PRECACHE__'", JSON.stringify(['./', ...files]));
      writeFileSync(swPath, stamped);
    },
  };
}

// GitHub Pages serves project sites from /<repo>/, so keep every asset URL relative.
export default defineConfig({
  base: './',
  plugins: [react(), stampServiceWorker()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
  },
});
