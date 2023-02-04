import { GuestData } from './model/guest';
import * as yup from 'yup';
import { BadUserInputError } from '../middleware/error';

const guestPropertiesSchema = yup.object().shape({
    name: yup.string().required(),
    phoneNumber: yup.string().required(),
});

export function validateGuestData(guestProperties: GuestData): void {
    try {
        guestPropertiesSchema.validateSync(guestProperties);
    } catch (err) {
        if (err instanceof yup.ValidationError) {
            const message = err.message;
            throw new BadUserInputError(message);
        }
        throw err;
    }
}
