import { BadUserInputError } from '../http-error/http-error';

export function toId(sId: string): number {
    const id = parseInt(sId, 10);
    if (isNaN(id)) {
        throw new BadUserInputError('Invalid id');
    }
    return id;
}
