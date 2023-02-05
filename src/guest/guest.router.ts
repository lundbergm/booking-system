import { Router } from 'express';
import { ReservationService } from '../reservation/reservation.service';
import { toId } from '../utils/to-id';
import { GuestData } from './model/guest';
import { GuestService } from './guest.service';
import { validateGuestData } from './validation';
import { NotFoundError } from '../http-error/http-error';

export function createGuestRouter(guestService: GuestService, reservationService: ReservationService): Router {
    const router = Router();

    /**
     * Get all guests
     *
     * Returns an array with all guests.
     * Improvements: Pagination, sorting, filtering, etc.
     */
    router.get('/', async (req, res, next) => {
        try {
            const guests = await guestService.getGuests();

            return res.status(200).send(guests);
        } catch (err) {
            next(err);
        }
    });
    /**
     * Get guest by id.
     *
     * Returns guest with given id.
     */
    router.get('/:id', async (req, res, next) => {
        try {
            const guestId = toId(req.params.id);

            const guest = await guestService.getGuest(guestId);

            if (guest === undefined) {
                throw new NotFoundError(`Guest with id ${guestId} not found`);
            }

            return res.status(200).send(guest);
        } catch (err) {
            next(err);
        }
    });
    /**
     * Get reservations for guest by id.
     *
     * Returns an array of reservations for guest with given id.
     * Improvements: Date filters, status filter...
     */
    router.get('/:id/reservations', async (req, res, next) => {
        try {
            const guestId = toId(req.params.id);

            const guest = await guestService.getGuest(guestId);

            if (guest === undefined) {
                throw new NotFoundError(`Guest with id ${guestId} not found`);
            }

            const reservations = await reservationService.getReservationsByGuestId(guestId);

            return res.status(200).send(reservations);
        } catch (err) {
            next(err);
        }
    });
    /**
     * Create a new guest.
     *
     * Returns the created guest with all fields.
     */
    router.post('/create', async (req, res, next) => {
        try {
            const guestData = req.body as GuestData;
            validateGuestData(guestData);

            const createdGuest = await guestService.createGuest(guestData);

            res.status(201).send(createdGuest);
        } catch (err) {
            next(err);
        }
    });
    /**
     * Update guest by id.
     *
     * Returns the updated guest with all fields.
     * Improvements: Partial updates, validation of fields to update.
     */
    router.put('/update/:id', async (req, res, next) => {
        try {
            const guestId = toId(req.params.id);
            const guestData = req.body as GuestData;
            validateGuestData(guestData);

            const updatedGuest = await guestService.updateGuest({ id: guestId, ...guestData });

            if (updatedGuest === undefined) {
                throw new NotFoundError(`Guest with id ${guestId} not found`);
            }

            res.status(200).send(updatedGuest);
        } catch (err) {
            next(err);
        }
    });

    /**
     * Delete guest by id.
     *
     * Returns 204 No Content.
     * Improvements: Check if guest has reservations first.
     */
    router.delete('/delete/:id', async (req, res, next) => {
        try {
            const guestId = toId(req.params.id);

            await guestService.deleteGuest(guestId);

            res.status(204).send();
        } catch (err) {
            next(err);
        }
    });

    return router;
}
