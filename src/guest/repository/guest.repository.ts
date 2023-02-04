import { Guest, GuestData } from '../model/guest';

export interface GuestRepository {
    getGuest(id: number): Promise<Guest | undefined>;
    getGuests(ids?: Array<number>): Promise<Array<Guest>>;
    createGuest(guestData: GuestData): Promise<Guest>;
    updateGuest(guest: Guest): Promise<Guest | undefined>;
    deleteGuest(id: number): Promise<void>;
}
