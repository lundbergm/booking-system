import { isForeignKeyError } from '../database/db-errors';
import { NotFoundError } from '../middleware/error';
import { Property, PropertyData } from './model/property';
import { PropertyRepository } from './repository/property.repository';

export class PropertyService {
    constructor(private properyRepository: PropertyRepository) {}

    public getProperty(id: number): Promise<Property | undefined> {
        return this.properyRepository.getProperty(id);
    }

    public getProperties(): Promise<Array<Property>> {
        return this.properyRepository.getProperties();
    }

    public createProperty(propertyData: PropertyData): Promise<Property> {
        return this.properyRepository.createProperty(propertyData);
    }

    public updateProperty(property: Property): Promise<Property | undefined> {
        return this.properyRepository.updateProperty(property);
    }

    public async deleteProperty(id: number): Promise<void> {
        try {
            return await this.properyRepository.deleteProperty(id);
        } catch (error) {
            if (isForeignKeyError(error)) {
                throw new NotFoundError(`Property with id ${id} is in use and can't be deleted`);
            }
            throw new NotFoundError(`Property with id ${id} not found`);
        }
    }
}
