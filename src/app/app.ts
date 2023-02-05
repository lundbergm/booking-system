import { Server } from 'http';
import { Database } from 'sqlite3';
import express from 'express';

import { AppConfig } from './config';
import { createGuestRouter } from '../guest/guest.router';
import { createRouter } from './router';
import { GuestService } from '../guest/guest.service';
import { loggingMiddleware } from '../middleware/logging';
import { errorMiddleware } from '../middleware/error';
import { createPropertyRouter } from '../property/property.router';
import { PropertyService } from '../property/property.service';
import { ReservationService } from '../reservation/reservation.service';
import { createReservationRouter } from '../reservation/reservation.router';
import { SqliteGuestRepository } from '../guest/repository/sqlite-guest.repository';
import { SqlitePropertyRepository } from '../property/repository/sqlite-property.repository';
import { SqliteReservationRepository } from '../reservation/repository/sqlite-reservation.repository';
import { SqliteClient } from '../database/sqlite-client';
import { SqliteMessageRepository } from '../message/repository/sqlite-message.repository';
import { MessageService } from '../message/message.service';
import { createMessageRouter } from '../message/message.router';

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
        /**
         * Logging middleware logs all requests with path and respose code to the console.
         */
        app.use(loggingMiddleware);
        app.use(express.json());

        // Initialize db connection
        const sqliteDb = new Database(__dirname + config.sqlite.path);

        // Add close function to closables to be run when server is closed
        this.closables.push(
            () => new Promise((resolve, reject) => sqliteDb.close((err) => (err ? reject(err) : resolve()))),
        );

        // Initialize clients
        const dbClient = new SqliteClient(sqliteDb);
        // Needed to enable foreign key support
        dbClient.initialize();

        // Initialize repositories
        const guestRepository = new SqliteGuestRepository(dbClient);
        const propertyRepository = new SqlitePropertyRepository(dbClient);
        const reservationRepository = new SqliteReservationRepository(dbClient);
        const messageRepository = new SqliteMessageRepository(dbClient);

        // Initialize services
        const guestService = new GuestService(guestRepository);
        const propertyService = new PropertyService(propertyRepository);
        const reservationService = new ReservationService(reservationRepository);
        const messageService = new MessageService(messageRepository);

        // Initialize routers
        const guestsRouter = createGuestRouter(guestService, reservationService);
        const propertyRouter = createPropertyRouter(propertyService, reservationService, guestService);
        const reservationsRouter = createReservationRouter(reservationService);
        const messageRouter = createMessageRouter(messageService, guestService);

        const router = createRouter(guestsRouter, propertyRouter, reservationsRouter, messageRouter);

        app.use(router);

        app.all('*', (_req, res) => {
            res.status(404).send({ message: 'Not Found' });
        });

        /**
         * Error middleware handles all errors thrown by the application.
         * If the error is an instance of HttpError, it is converted to a response with the appropriate status code.
         * If the error is not an instance of HttpError, it is converted to a 500 Internal Server Error.
         */
        app.use(errorMiddleware);

        return app.listen(config.port, () => {
            console.info(`server started on port ${config.port}`);
        });
    }
}
