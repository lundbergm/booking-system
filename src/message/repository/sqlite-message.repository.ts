import { SqliteClient } from '../../database/sqlite-client';
import { Message, MessageData } from '../model/message';
import { MessageRepository } from './message.repository';

export class SqliteMessageRepository implements MessageRepository {
    constructor(private dbClient: SqliteClient) {}

    getMessagesByGuest(id: number): Promise<Message[]> {
        const query = 'SELECT * FROM messages WHERE guestId = ?';

        return this.dbClient.all(query, [id]);
    }

    async createMessage(messageData: MessageData): Promise<Message> {
        const query = 'INSERT INTO messages (guestId, propertyManagerId, sentBy, body) VALUES (?, ?, ?, ?)';

        const { guestId, propertyManagerId, sentBy, body } = messageData;

        const { lastID } = await this.dbClient.run(query, [guestId, propertyManagerId, sentBy, body]);

        return { id: lastID, guestId, propertyManagerId, sentBy, body };
    }

    async updateMessage(message: Message): Promise<Message | undefined> {
        const query = 'UPDATE messages SET guestId = ?, propertyManagerId = ?, sentBy = ?, body = ? WHERE id = ?';

        const { id, guestId, propertyManagerId, sentBy, body } = message;

        const { changes } = await this.dbClient.run(query, [guestId, propertyManagerId, sentBy, body, id]);

        if (changes !== 1) {
            return;
        }

        return message;
    }

    async deleteMessage(id: number): Promise<void> {
        const query = 'DELETE FROM messages WHERE id = ?';

        const { changes } = await this.dbClient.run(query, [id]);
        if (changes !== 1) {
            throw new Error(`Message with id ${id} not found`);
        }
    }
}
