import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const packageRoot = join(process.cwd(), 'node_modules', 'nestjs-dj-admin', 'dist', 'src');

const indexPath = join(packageRoot, 'index.js');
let indexContent = readFileSync(indexPath, 'utf8');

indexContent = indexContent
  .replace(
    /export \{ PrismaAdminAdapter \} from '\.\/admin\/adapters\/prisma\.adapter\.js';\n/,
    '',
  )
  .replace(
    /export \{ MikroOrmAdminAdapter \} from '\.\/admin\/adapters\/mikroorm\.adapter\.js';\n/,
    '',
  );

writeFileSync(indexPath, indexContent);

const adminServicePath = join(packageRoot, 'admin', 'services', 'admin.service.js');
let adminServiceContent = readFileSync(adminServicePath, 'utf8');

const parallelFilters =
  '        const options = await Promise.all(filters.map(async (field) => {\n            const fieldSchema = resource.schema.fields.find((candidate) => candidate.name === field);\n            return {\n                field,\n                values: fieldSchema?.relation\n                    ? []\n                    : (await this.adapter.distinct?.(this.toAdapterResource(resource), field)) ?? [],\n            };\n        }));';

const serialFilters =
  '        const options = [];\n        for (const field of filters) {\n            const fieldSchema = resource.schema.fields.find((candidate) => candidate.name === field);\n            options.push({\n                field,\n                values: fieldSchema?.relation\n                    ? []\n                    : (await this.adapter.distinct?.(this.toAdapterResource(resource), field)) ?? [],\n            });\n        }';

if (adminServiceContent.includes(parallelFilters)) {
  adminServiceContent = adminServiceContent.replace(parallelFilters, serialFilters);
  writeFileSync(adminServicePath, adminServiceContent);
}

console.log('Patched nestjs-dj-admin');
