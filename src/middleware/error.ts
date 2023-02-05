import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../http-error/http-error';

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
