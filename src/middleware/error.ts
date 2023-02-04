import { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction): Promise<void> {
    let message = 'Server error';
    let status = 500;

    if (err instanceof HttpError) {
        message = err.message;
        status = err.status;
    }
    console.log(err);
    res.status(status).send({ status, message });
}

export class HttpError extends Error {
    constructor(title: string, public status: number) {
        super(title);
        this.name = 'HttpError';
    }
}

export class BadUserInputError extends HttpError {
    constructor(message: string) {
        super(message, 400);
        this.name = 'BadUserInputError';
    }
}

export class NotFoundError extends HttpError {
    constructor(message: string) {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}
