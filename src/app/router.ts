import { Router } from 'express';

export function createRouter(guestsRouter: Router, propertyRouter: Router, reservationsRouter: Router): Router {
    const router = Router();

    router.use('/guests', guestsRouter);
    router.use('/properties', propertyRouter);
    router.use('/reservations', reservationsRouter);

    return router;
}
