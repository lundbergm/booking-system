export function isForeignKeyError(error: unknown): boolean {
    return (error as { code: string }).code === 'SQLITE_CONSTRAINT';
}
