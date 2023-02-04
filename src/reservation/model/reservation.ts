export enum ReservationStatus {
    Booked = 'BOOKED',
    Cancelled = 'CANCELLED',
    CheckedIn = 'CHECKED_IN',
    CheckedOut = 'CHECKED_OUT',
}

export interface ReservationData {
    startDate: string;
    endDate: string;
    propertyId: number;
    guestId: number;
    status: ReservationStatus;
}

export interface Reservation extends ReservationData {
    id: number;
}
