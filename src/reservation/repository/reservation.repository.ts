import { Reservation, ReservationData } from '../model/reservation';

export interface ReservationRepository {
    getReservation(id: number): Promise<Reservation | undefined>;
    getReservations(): Promise<Array<Reservation>>;
    getReservationsByGuestId(id: number): Promise<Array<Reservation>>;
    getReservationsByPropertyId(id: number): Promise<Array<Reservation>>;
    createReservation(reservationData: ReservationData): Promise<Reservation>;
    updateReservation(reservation: Reservation): Promise<Reservation | undefined>;
    deleteReservation(id: number): Promise<void>;
}
