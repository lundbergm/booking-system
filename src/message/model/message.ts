export enum Sender {
    Guest = 'GUEST',
    PropertyManager = 'PROPERTY_MANAGER',
}

export interface MessageData {
    guestId: number;
    propertyManagerId: number;
    sentBy: Sender;
    body: string;
}

export interface Message extends MessageData {
    id: number;
}
