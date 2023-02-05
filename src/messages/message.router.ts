import { Router } from 'express';
import { toId } from '../utils/to-id';
import { MessageData } from './model/message';
import { MessageService } from './message.service';
import { validateMessageData } from './validation';
import { GuestService } from '../guest/guest.service';
import { NotFoundError } from '../http-error/http-error';

export function createMessageRouter(messageService: MessageService, guestService: GuestService): Router {
    const router = Router();

    /**
     * Get all messages for a guest by id.
     *
     * Returns an array of messages for guest with given id.
     * Improvements: Should take propertyManagerId into account.
     */
    router.get('/guest/:id', async (req, res, next) => {
        try {
            const guestId = toId(req.params.id);

            const guest = await guestService.getGuest(guestId);

            if (guest === undefined) {
                throw new NotFoundError(`Guest with id ${guestId} not found`);
            }

            const messages = await messageService.getMessageByGuestId(guestId);

            return res.status(200).send(messages);
        } catch (err) {
            next(err);
        }
    });

    /**
     * Create a new message.
     *
     * Returns the created message.
     */
    router.post('/create', async (req, res, next) => {
        try {
            const messageData = req.body as MessageData;
            validateMessageData(messageData);

            const createMessage = await messageService.createMessage(messageData);

            res.status(201).send(createMessage);
        } catch (err) {
            next(err);
        }
    });

    /**
     * Update a message by id.
     *
     * Returns the updated message.
     * Improvements: Support partial updates.
     */
    router.put('/update/:id', async (req, res, next) => {
        try {
            const messageId = toId(req.params.id);
            const messageData = req.body as MessageData;
            validateMessageData(messageData);

            const updatedMessage = await messageService.updateMessage({ id: messageId, ...messageData });

            if (updatedMessage === undefined) {
                throw new NotFoundError(`Message with id ${messageId} not found`);
            }

            res.status(200).send(updatedMessage);
        } catch (err) {
            next(err);
        }
    });

    /**
     * Delete a message by id.
     *
     * Returns 204 No Content.
     */
    router.delete('/delete/:id', async (req, res, next) => {
        try {
            const messageId = toId(req.params.id);

            await messageService.deleteMessage(messageId);

            res.status(204).send();
        } catch (err) {
            next(err);
        }
    });

    return router;
}
