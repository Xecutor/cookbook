import { Tags } from './tags';
import { Entity } from "./entity";
import { PropertiesCollection } from "./property";

export class Item extends Entity {
    constructor(name:string, properties: PropertiesCollection, tags:Tags) 
    {
        super(name, properties, tags)
    }
    isItem()
    {
        return true;
    }
}
