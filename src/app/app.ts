import { Server } from 'http';

import { AppConfig } from './config';
import { createGuestRouter } from '../guest/guest.router';
import { createRouter } from './router';
import { GuestService } from '../guest/guest.service';
import express from 'express';
import { loggingMiddleware } from '../middleware/logging';
import { errorMiddleware } from '../middleware/error';
import { createPropertyRouter } from '../property/property.router';
import { PropertyService } from '../property/property.service';
import { ReservationService } from '../reservation/reservation.service';
import { createReservationRouter } from '../reservation/reservation.router';
import { Database } from 'sqlite3';
import { SqliteGuestRepository } from '../guest/repository/sqlite-guest.repository';
import { SqlitePropertyRepository } from '../property/repository/sqlite-property.repository';
import { SqliteReservationRepository } from '../reservation/repository/sqlite-reservation.repository';
import { SqliteClient } from '../database/sqlite-client';

export default class App {
    private closables: Array<() => Promise<void>> = [];
    constructor(private config: AppConfig) {}

    async close(): Promise<void> {
        for (const close of this.closables) {
            await close();
        }
    }

    async start(): Promise<Server> {
        const config = this.config;
        // Create server
        const app = express();

        // Initialize middlewares
        app.use(loggingMiddleware);
        app.use(express.json());

        // Initialize db connection
        const sqliteDb = new Database(__dirname + config.sqlite.path);
        this.closables.push(
            () => new Promise((resolve, reject) => sqliteDb.close((err) => (err ? reject(err) : resolve()))),
        );

        // Initialize clients
        const dbClient = new SqliteClient(sqliteDb);
        dbClient.initialize();

        // Initialize repositories
        const guestRepository = new SqliteGuestRepository(dbClient);
        const propertyRepository = new SqlitePropertyRepository(dbClient);
        const reservationRepository = new SqliteReservationRepository(dbClient);

        // Initialize services
        const guestService = new GuestService(guestRepository);
        const propertyService = new PropertyService(propertyRepository);
        const reservationService = new ReservationService(reservationRepository);

        // Initialize routers
        const guestsRouter = createGuestRouter(guestService, reservationService);
        const propertyRouter = createPropertyRouter(propertyService, reservationService, guestService);
        const reservationsRouter = createReservationRouter(reservationService);

        const router = createRouter(guestsRouter, propertyRouter, reservationsRouter);

        app.use(router);

        app.all('*', (_req, res) => {
            res.status(404).send({ message: 'Not Found' });
        });
        app.use(errorMiddleware);

        return app.listen(config.port, () => {
            console.info(`server started on port ${config.port}`);
        });
    }
}
