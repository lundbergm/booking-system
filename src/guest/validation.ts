import { GuestData } from './model/guest';
import * as yup from 'yup';
import { BadUserInputError } from '../http-error/http-error';

const guestDataSchema = yup.object().shape({
    name: yup.string().required(),
    phoneNumber: yup.string().required(),
});

export function validateGuestData(guestData: GuestData): void {
    try {
        guestDataSchema.validateSync(guestData);
    } catch (err) {
        if (err instanceof yup.ValidationError) {
            const message = err.message;
            throw new BadUserInputError(message);
        }
        throw err;
    }
}
