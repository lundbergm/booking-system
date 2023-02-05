import { MessageData, Sender } from './model/message';
import * as yup from 'yup';
import { BadUserInputError } from '../http-error/http-error';

const messageDataSchema = yup.object().shape({
    guestId: yup.number().required(),
    propertyManagerId: yup.number().required(),
    sentBy: yup.mixed<Sender>().oneOf(Object.values(Sender)).required(),
    body: yup.string().required(),
});

export function validateMessageData(messageData: MessageData): void {
    try {
        messageDataSchema.validateSync(messageData);
    } catch (err) {
        if (err instanceof yup.ValidationError) {
            const message = err.message;
            throw new BadUserInputError(message);
        }
        throw err;
    }
}
