export interface GuestData {
    name: string;
    phoneNumber: string;
}

export interface Guest extends GuestData {
    id: number;
}
