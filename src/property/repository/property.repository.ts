import { Property, PropertyData } from '../model/property';

export interface PropertyRepository {
    getProperty(id: number): Promise<Property | undefined>;
    getProperties(): Promise<Array<Property>>;
    createProperty(propertyData: PropertyData): Promise<Property>;
    updateProperty(property: Property): Promise<Property | undefined>;
    deleteProperty(id: number): Promise<void>;
}
