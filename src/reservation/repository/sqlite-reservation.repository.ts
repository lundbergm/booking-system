import { SqliteClient } from '../../database/sqlite-client';
import { Reservation, ReservationData } from '../model/reservation';
import { ReservationRepository } from './reservation.repository';

export class SqliteReservationRepository implements ReservationRepository {
    constructor(private dbClient: SqliteClient) {}

    async getReservation(id: number): Promise<Reservation | undefined> {
        const query = 'SELECT * FROM reservations WHERE id = ?;';

        return this.dbClient.get<Reservation | undefined>(query, [id]);
    }

    async getReservations(): Promise<Array<Reservation>> {
        const query = 'SELECT * FROM reservations;';

        return this.dbClient.all<Reservation>(query, []);
    }

    async getReservationsByPropertyId(id: number): Promise<Array<Reservation>> {
        const query = 'SELECT * FROM reservations WHERE propertyId = ?;';

        return this.dbClient.all<Reservation>(query, [id]);
    }

    async getReservationsByGuestId(id: number): Promise<Array<Reservation>> {
        const query = 'SELECT * FROM reservations WHERE guestId = ?;';

        return this.dbClient.all<Reservation>(query, [id]);
    }

    async createReservation(reservationData: ReservationData): Promise<Reservation> {
        const query =
            'INSERT INTO reservations (startDate, endDate, propertyId, guestId, status) VALUES (?, ?, ?, ?, ? )';

        const { startDate, endDate, propertyId, guestId, status } = reservationData;

        const { lastID } = await this.dbClient.run(query, [startDate, endDate, propertyId, guestId, status]);

        return { id: lastID, startDate, endDate, propertyId, guestId, status };
    }

    async updateReservation(reservation: Reservation): Promise<Reservation | undefined> {
        const query =
            'UPDATE reservations SET  startDate = ?, endDate = ?, propertyId = ?, guestId = ?, status = ? WHERE id = ?';

        const { id, startDate, endDate, propertyId, guestId, status } = reservation;

        const { changes } = await this.dbClient.run(query, [startDate, endDate, propertyId, guestId, status, id]);

        if (changes !== 1) {
            return;
        }

        return reservation;
    }

    async deleteReservation(id: number): Promise<void> {
        const query = 'DELETE FROM reservations WHERE id = ?';

        const { changes } = await this.dbClient.run(query, [id]);
        if (changes !== 1) {
            throw new Error(`Reservation with id ${id} not found`);
        }
    }
}
