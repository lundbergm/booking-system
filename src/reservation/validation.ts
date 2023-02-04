import * as yup from 'yup';
import { BadUserInputError } from '../middleware/error';
import { ReservationData, ReservationStatus } from './model/reservation';
import { parse } from 'date-fns';

function parseDate(value: unknown, originalValue: unknown): Date | null | undefined {
    if (originalValue === null || originalValue === '') return null;
    if (originalValue === undefined) return undefined;
    if (typeof originalValue !== 'string') return new Date('');

    return parse(originalValue, 'yyyy-MM-dd', new Date());
}

const reservationDataSchema = yup.object().shape({
    startDate: yup.date().transform(parseDate).required(),
    endDate: yup
        .date()
        .transform(parseDate)
        .min(yup.ref('startDate'), '${path}: date cannot be earlier than startDate')
        .required(),
    propertyId: yup.number().required(),
    guestId: yup.number().required(),
    status: yup.mixed<ReservationStatus>().oneOf(Object.values(ReservationStatus)).required(),
});

export function validateReservationData(propertyData: ReservationData): void {
    try {
        reservationDataSchema.validateSync(propertyData);
    } catch (err) {
        if (err instanceof yup.ValidationError) {
            const message = err.message;
            throw new BadUserInputError(message);
        }
        throw err;
    }
}
