export class AppError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

export function isUniqueViolation(error: unknown): boolean {
  const current = error as { code?: string; cause?: { code?: string } };
  return current?.code === "23505" || current?.cause?.code === "23505";
}
