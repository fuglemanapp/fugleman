const MAX_ATTEMPTS = 3;

function isTransientDatabaseError(error: unknown) {
  return error instanceof Error && error.name === "PrismaClientInitializationError";
}

export async function retryDatabaseOperation<T>(
  operation: () => Promise<T>,
  options: { delay?: (milliseconds: number) => Promise<void> } = {},
): Promise<T> {
  const delay = options.delay || ((milliseconds) => new Promise<void>((resolve) => setTimeout(resolve, milliseconds)));

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      if (!isTransientDatabaseError(error) || attempt === MAX_ATTEMPTS) throw error;
      await delay(attempt * 250);
    }
  }

  throw new Error("Operação de banco não foi executada.");
}
