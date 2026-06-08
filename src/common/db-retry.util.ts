const retryableCodes = new Set([
  'ECONNRESET',
  'ETIMEDOUT',
  'ECONNREFUSED',
  '57P01',
  '08006',
  '08003',
]);

function getErrorCode(error: unknown): string | undefined {
  if (!error || typeof error !== 'object') {
    return undefined;
  }

  const record = error as { code?: string; driverError?: { code?: string } };
  return record.code ?? record.driverError?.code;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }

  return String(error);
}

export function isRetryableDbError(error: unknown): boolean {
  const code = getErrorCode(error);

  if (code && retryableCodes.has(code)) {
    return true;
  }

  const message = getErrorMessage(error);
  const driverMessage =
    error && typeof error === 'object' && 'driverError' in error
      ? getErrorMessage((error as { driverError: unknown }).driverError)
      : '';

  return /connection terminated|ECONNRESET|timeout expired/i.test(
    `${message} ${driverMessage}`,
  );
}

export async function withDbRetry<T>(
  action: () => Promise<T>,
  attempts = 3,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await action();
    } catch (error) {
      lastError = error;

      if (!isRetryableDbError(error) || attempt === attempts) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }

  throw lastError;
}
