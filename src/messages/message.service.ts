import { isForeignKeyError } from '../database/db-errors';
import { BadUserInputError, NotFoundError } from '../http-error/http-error';
import { Message, MessageData } from './model/message';
import { MessageRepository } from './repository/message.repository';

export class MessageService {
    constructor(private messageRepository: MessageRepository) {}

    public getMessageByGuestId(id: number): Promise<Array<Message>> {
        return this.messageRepository.getMessagesByGuest(id);
    }

    public async createMessage(messageData: MessageData): Promise<Message> {
        try {
            const message = await this.messageRepository.createMessage(messageData);
            return message;
        } catch (error) {
            if (isForeignKeyError(error)) {
                throw new BadUserInputError('Invalid guest id');
            }
            throw error;
        }
    }

    public async updateMessage(message: Message): Promise<Message | undefined> {
        try {
            const updatedMessage = await this.messageRepository.updateMessage(message);
            return updatedMessage;
        } catch (error) {
            if (isForeignKeyError(error)) {
                throw new BadUserInputError('Invalid guest id');
            }
            throw error;
        }
    }

    public async deleteMessage(id: number): Promise<void> {
        try {
            await this.messageRepository.deleteMessage(id);
        } catch (error) {
            throw new NotFoundError(`Message with id ${id} not found`);
        }
    }
}
