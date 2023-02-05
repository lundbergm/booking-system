import { isForeignKeyError } from '../database/db-errors';
import { BadUserInputError, NotFoundError } from '../http-error/http-error';
import { Reservation, ReservationData } from './model/reservation';
import { ReservationRepository } from './repository/reservation.repository';

export class ReservationService {
    constructor(private reservationRepository: ReservationRepository) {}

    public getReservations(): Promise<Reservation[]> {
        return this.reservationRepository.getReservations();
    }

    public getReservationsByGuestId(id: number): Promise<Reservation[]> {
        return this.reservationRepository.getReservationsByGuestId(id);
    }

    public getReservationsByPropertyId(id: number): Promise<Reservation[]> {
        return this.reservationRepository.getReservationsByPropertyId(id);
    }

    public getReservation(id: number): Promise<Reservation | undefined> {
        return this.reservationRepository.getReservation(id);
    }

    public async createReservation(reservationData: ReservationData): Promise<Reservation> {
        try {
            const reservation = await this.reservationRepository.createReservation(reservationData);
            return reservation;
        } catch (error) {
            if (isForeignKeyError(error)) {
                throw new BadUserInputError('Invalid property or guest id');
            }
            throw error;
        }
    }

    public async updateReservation(reservation: Reservation): Promise<Reservation | undefined> {
        try {
            const updatedReservation = await this.reservationRepository.updateReservation(reservation);
            return updatedReservation;
        } catch (error) {
            if (isForeignKeyError(error)) {
                throw new BadUserInputError('Invalid property or guest id');
            }
            throw error;
        }
    }

    public async deleteReservation(id: number): Promise<void> {
        try {
            await this.reservationRepository.deleteReservation(id);
        } catch (error) {
            throw new NotFoundError(`Reservation with id ${id} not found`);
        }
    }
}
