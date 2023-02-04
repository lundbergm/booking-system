import { SqliteClient } from '../../database/sqlite-client';
import { Guest, GuestData } from '../model/guest';
import { GuestRepository } from './guest.repository';

export class SqliteGuestRepository implements GuestRepository {
    constructor(private dbClient: SqliteClient) {}

    async getGuest(id: number): Promise<Guest | undefined> {
        const query = 'SELECT * FROM guests WHERE id = ?';

        return this.dbClient.get<Guest | undefined>(query, [id]);
    }

    async getGuests(ids?: Array<number>): Promise<Array<Guest>> {
        const filter = `WHERE id IN (${new Array(ids?.length ?? 0).fill('?').join(', ')})`;
        const query = `SELECT * FROM guests ${ids !== undefined ? filter : ''};`;

        return this.dbClient.all<Guest>(query, ids ?? []);
    }

    async createGuest(guestData: GuestData): Promise<Guest> {
        const query = 'INSERT INTO guests (name, phoneNumber) VALUES (?, ?)';

        const { name, phoneNumber } = guestData;

        const { lastID } = await this.dbClient.run(query, [name, phoneNumber]);

        return { id: lastID, name, phoneNumber };
    }

    async updateGuest(guest: Guest): Promise<Guest | undefined> {
        const query = 'UPDATE guests SET name = ?, phoneNumber = ? WHERE id = ?';

        const { id, name, phoneNumber } = guest;

        const { changes } = await this.dbClient.run(query, [name, phoneNumber, id]);

        if (changes !== 1) {
            return;
        }

        return guest;
    }

    async deleteGuest(id: number): Promise<void> {
        const query = 'DELETE FROM guests WHERE id = ?';

        const { changes } = await this.dbClient.run(query, [id]);
        if (changes !== 1) {
            throw new Error(`Guest with id ${id} not found`);
        }
    }
}
