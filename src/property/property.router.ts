import { Router } from 'express';
import { NotFoundError } from '../http-error/http-error';
import { ReservationService } from '../reservation/reservation.service';
import { GuestService } from '../guest/guest.service';
import { toId } from '../utils/to-id';
import { PropertyData } from './model/property';
import { PropertyService } from './property.service';
import { validatePropertyData } from './validation';

export function createPropertyRouter(
    propertyService: PropertyService,
    reservationService: ReservationService,
    guestService: GuestService,
): Router {
    const router = Router();

    /**
     * Get all properties.
     *
     * Returns an array of all properties.
     * Improvements: Pagination, sorting, filtering, etc.
     */
    router.get('/', async (req, res, next) => {
        try {
            const properties = await propertyService.getProperties();

            res.status(200).send(properties);
        } catch (err) {
            next(err);
        }
    });

    /**
     * Get property by id.
     *
     * Returns property with given id.
     */
    router.get('/:id', async (req, res, next) => {
        try {
            const id = toId(req.params.id);

            const property = await propertyService.getProperty(id);

            if (property === undefined) {
                throw new NotFoundError(`Property with id ${id} not found`);
            }

            res.status(200).send(property);
        } catch (err) {
            next(err);
        }
    });

    /**
     *  Get reservations for property by id.
     *
     * Returns an array of reservations for property with given id.
     * Improvements: Date filters would be handy.
     */
    router.get('/:id/reservations', async (req, res, next) => {
        try {
            const id = toId(req.params.id);

            const property = await propertyService.getProperty(id);

            if (property === undefined) {
                throw new NotFoundError(`Property with id ${id} not found`);
            }

            const reservations = await reservationService.getReservationsByPropertyId(id);

            res.status(200).send(reservations);
        } catch (err) {
            next(err);
        }
    });

    /**
     * Get guests for property by id.
     *
     * Returns an array of guests for property with given id.
     * Improvements: Date filters.
     */
    router.get('/:id/guests', async (req, res, next) => {
        try {
            const id = toId(req.params.id);

            const property = await propertyService.getProperty(id);

            if (property === undefined) {
                throw new NotFoundError(`Property with id ${id} not found`);
            }

            const reservations = await reservationService.getReservationsByPropertyId(id);

            const guestIds = reservations.map((reservation) => reservation.guestId);

            if (guestIds.length === 0) {
                res.status(200).send([]);
                return;
            }

            const guests = await guestService.getGuests(guestIds);

            res.status(200).send(guests);
        } catch (err) {
            next(err);
        }
    });

    /**
     * Create property.
     *
     * Creates a new property with all fields and returns it.
     */
    router.post('/create', async (req, res, next) => {
        try {
            const propertyData = req.body as PropertyData;
            validatePropertyData(propertyData);

            const createdGuest = await propertyService.createProperty(propertyData);

            res.status(201).send(createdGuest);
        } catch (err) {
            next(err);
        }
    });

    /**
     * Update property.
     *
     * Updates property with given id and returns it.
     * Improvements: Partial updates.
     */
    router.put('/update/:id', async (req, res, next) => {
        try {
            const id = toId(req.params.id);
            const propertyData = req.body as PropertyData;
            validatePropertyData(propertyData);

            const updatedProperty = await propertyService.updateProperty({ id, ...propertyData });
            res.status(200).send(updatedProperty);
        } catch (err) {
            next(err);
        }
    });

    /**
     * Delete property.
     *
     * Deletes property with given id.
     * Improvements: Check if property has reservations first.
     */
    router.delete('/delete/:id', async (req, res, next) => {
        try {
            const id = toId(req.params.id);

            await propertyService.deleteProperty(id);
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    });

    return router;
}
