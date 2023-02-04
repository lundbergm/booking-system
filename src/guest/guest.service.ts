import { isForeignKeyError } from '../database/db-errors';
import { NotFoundError } from '../middleware/error';
import { Guest, GuestData } from './model/guest';
import { GuestRepository } from './repository/guest.repository';

export class GuestService {
    constructor(private guestRepository: GuestRepository) {}

    public getGuest(id: number): Promise<Guest | undefined> {
        return this.guestRepository.getGuest(id);
    }

    public getGuests(ids?: Array<number>): Promise<Array<Guest>> {
        return this.guestRepository.getGuests(ids);
    }

    public createGuest(guestData: GuestData): Promise<Guest> {
        return this.guestRepository.createGuest(guestData);
    }

    public updateGuest(guest: Guest): Promise<Guest | undefined> {
        return this.guestRepository.updateGuest(guest);
    }

    public async deleteGuest(id: number): Promise<void> {
        try {
            await this.guestRepository.deleteGuest(id);
        } catch (error) {
            if (isForeignKeyError(error)) {
                throw new NotFoundError(`Guest with id ${id} have a reservation and can't be deleted`);
            }
            throw new NotFoundError(`Guest with id ${id} not found`);
        }
    }
}
