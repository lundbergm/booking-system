import { Request, Response, NextFunction } from 'express';

export function loggingMiddleware(req: Request, res: Response, next: NextFunction) {
    res.on('finish', function () {
        console.log(req.method, req.originalUrl, res.statusCode, res.statusMessage);
    });
    next();
}
