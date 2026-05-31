import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const srcDir = join(process.cwd(), 'src');

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!fullPath.endsWith('.ts') || fullPath.endsWith('.spec.ts')) {
      continue;
    }

    let content = readFileSync(fullPath, 'utf8');
    const updated = content.replace(
      /from '(\.{1,2}\/[^']+)'/g,
      (match, importPath) => {
        if (importPath.endsWith('.js')) {
          return match;
        }

        return `from '${importPath}.js'`;
      },
    );

    if (updated !== content) {
      writeFileSync(fullPath, updated);
      console.log(`Updated ${fullPath}`);
    }
  }
}

walk(srcDir);
