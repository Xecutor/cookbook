import { Tags } from './tags';
import { PropertiesCollection, BaseProperty } from "./property";

export class Entity{
    name:string;
    properties : PropertiesCollection;
    tags: Tags
    
    isItem()
    {
        return false
    }
    isResource()
    {
        return false
    }
    isCrafter()
    {
        return false
    }
}
