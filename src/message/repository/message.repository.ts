import { Message, MessageData } from '../model/message';

export interface MessageRepository {
    getMessagesByGuest(id: number): Promise<Array<Message>>;
    createMessage(messageData: MessageData): Promise<Message>;
    updateMessage(message: Message): Promise<Message | undefined>;
    deleteMessage(id: number): Promise<void>;
}
