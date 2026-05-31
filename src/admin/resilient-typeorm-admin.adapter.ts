import { TypeOrmAdminAdapter } from 'nestjs-dj-admin';
import { DataSource } from 'typeorm';

const retryableCodes = new Set([
  'ECONNRESET',
  'ETIMEDOUT',
  'ECONNREFUSED',
  '57P01',
  '08006',
  '08003',
]);

const retryableMethods = new Set([
  'findMany',
  'findOne',
  'distinct',
  'create',
  'update',
  'delete',
]);

function getErrorCode(error: unknown): string | undefined {
  if (!error || typeof error !== 'object') {
    return undefined;
  }

  const record = error as { code?: string; driverError?: { code?: string } };
  return record.code ?? record.driverError?.code;
}

async function withDbRetry<T>(
  action: () => Promise<T>,
  attempts = 3,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await action();
    } catch (error) {
      lastError = error;
      const code = getErrorCode(error);

      if (!code || !retryableCodes.has(code) || attempt === attempts) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }

  throw lastError;
}

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
