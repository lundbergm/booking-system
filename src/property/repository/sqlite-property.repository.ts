import { SqliteClient } from '../../database/sqlite-client';
import { Property, PropertyData } from '../model/property';
import { PropertyRepository } from './property.repository';

export class SqlitePropertyRepository implements PropertyRepository {
    constructor(private dbClient: SqliteClient) {}

    async getProperty(id: number): Promise<Property | undefined> {
        const query = 'SELECT * FROM properties WHERE id = ?';

        return this.dbClient.get<Property | undefined>(query, [id]);
    }

    async getProperties(): Promise<Array<Property>> {
        const query = 'SELECT * FROM properties';

        return this.dbClient.all<Property>(query, []);
    }

    async createProperty(propertyData: PropertyData): Promise<Property> {
        const query = 'INSERT INTO properties (name) VALUES (?)';

        const { name } = propertyData;

        const { lastID } = await this.dbClient.run(query, [name]);

        return { id: lastID, name };
    }

    async updateProperty(property: Property): Promise<Property | undefined> {
        const query = 'UPDATE properties SET name = ? WHERE id = ?';

        const { id, name } = property;

        const { changes } = await this.dbClient.run(query, [name, id]);

        if (changes !== 1) {
            return;
        }

        return property;
    }

    async deleteProperty(id: number): Promise<void> {
        const query = 'DELETE FROM properties WHERE id = ?';

        const { changes } = await this.dbClient.run(query, [id]);
        if (changes !== 1) {
            throw new Error(`Property with id ${id} not found`);
        }
    }
}
