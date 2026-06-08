import { TypeOrmAdminAdapter } from 'nestjs-dj-admin';
import { DataSource } from 'typeorm';
import { withDbRetry } from '../common/db-retry.util.js';

const retryableMethods = new Set([
  'findMany',
  'findOne',
  'distinct',
  'create',
  'update',
  'delete',
]);

export function createResilientTypeOrmAdminAdapter(dataSource: DataSource) {
  const adapter = new TypeOrmAdminAdapter(dataSource);

  return new Proxy(adapter, {
    get(target, property, receiver) {
      const value = Reflect.get(target, property, receiver);

      if (
        typeof value !== 'function' ||
        !retryableMethods.has(String(property))
      ) {
        return typeof value === 'function' ? value.bind(target) : value;
      }

      return (...args: unknown[]) =>
        withDbRetry(() =>
          (value as (...params: unknown[]) => Promise<unknown>).apply(
            target,
            args,
          ),
        );
    },
  });
}
