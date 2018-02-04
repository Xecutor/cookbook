import { Tags } from './tags';
import { Entity } from './entity';
import { PropertiesCollection } from './property';

export class Resource extends Entity {
    constructor(name: string = "", properties: PropertiesCollection = new PropertiesCollection, tags: Tags = new Tags) {
        super(name, properties, tags)
    }
    getType() {
        return "Resource"
    }
}