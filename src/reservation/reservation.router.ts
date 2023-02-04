import { Router } from 'express';
import { NotFoundError } from '../middleware/error';
import { toId } from '../utils/to-id';
import { ReservationData } from './model/reservation';
import { ReservationService } from './reservation.service';
import { validateReservationData } from './validation';

export function createReservationRouter(reservationService: ReservationService): Router {
    const router = Router();

    /**
     * Get all reservations
     *
     * Returns all reservations.
     * Improvements: Pagination, sorting, filtering, etc.
     */
    router.get('/', async (req, res, next) => {
        try {
            const reservations = await reservationService.getReservations();

            res.status(200).send(reservations);
        } catch (err) {
            next(err);
        }
    });
    /**
     * Get reservation by id
     *
     * Returns reservation with given id.
     */
    router.get('/:id', async (req, res, next) => {
        try {
            const id = toId(req.params.id);

            const reservation = await reservationService.getReservation(id);

            if (reservation === undefined) {
                throw new NotFoundError(`Reservation with id ${id} not found`);
            }

            res.status(200).send(reservation);
        } catch (err) {
            next(err);
        }
    });
    /**
     * Create reservation
     *
     * Creates a new reservation with all fields and returns it.
     */
    router.post('/create', async (req, res, next) => {
        try {
            const reservationData = req.body as ReservationData;
            validateReservationData(reservationData);

            const createdGuest = await reservationService.createReservation(reservationData);

            res.status(201).send(createdGuest);
        } catch (err) {
            next(err);
        }
    });
    /**
     * Update reservation
     *
     * Updates reservation with given id and returns it.
     * Improvements: Should handle partial updates.
     */
    router.put('/update/:id', async (req, res, next) => {
        try {
            const id = toId(req.params.id);
            const reservationData = req.body as ReservationData;
            validateReservationData(reservationData);

            const updatedReservation = await reservationService.updateReservation({ id: id, ...reservationData });
            res.status(200).send(updatedReservation);
        } catch (err) {
            next(err);
        }
    });
    /**
     * Delete reservation
     *
     * Deletes reservation with given id.
     */
    router.delete('/delete/:id', async (req, res, next) => {
        try {
            const id = toId(req.params.id);

            await reservationService.deleteReservation(id);
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    });

    return router;
}
