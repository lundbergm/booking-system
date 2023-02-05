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
