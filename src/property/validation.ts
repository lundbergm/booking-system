import * as yup from 'yup';
import { BadUserInputError } from '../middleware/error';
import { PropertyData } from './model/property';

const propertyDataSchema = yup.object().shape({
    name: yup.string().required(),
});

export function validatePropertyData(propertyData: PropertyData): void {
    try {
        propertyDataSchema.validateSync(propertyData);
    } catch (err) {
        if (err instanceof yup.ValidationError) {
            const message = err.message;
            throw new BadUserInputError(message);
        }
        throw err;
    }
}
