import { Serializable } from './serializable';
import { Tags } from './tags';
import { PropertiesCollection, BaseProperty } from "./property";

export class Entity implements Serializable{
    name:string;
    properties = new PropertiesCollection()
    tags = new Tags()

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
    serialize()
    {
        return this
    }
    deserialize(obj:any)
    {
        this.name = obj.name
        this.properties.deserialize(obj.properties)
        this.tags.deserialize(obj.tags)
    }
}
