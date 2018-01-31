import { Serializable } from './serializable';
import { Tags } from './tags';
import { PropertiesCollection, BaseProperty } from "./property";

export function entityEqByName(a:Entity, b:Entity)
{
    return a.name == b.name
}

export function entityDefaultFilter(e:Entity, filter:string)
{
    let filterItems = filter.split(/\s+/)
    let allTags = true
    let nameMatch = true
    for(let f of filterItems) {
        if(f.startsWith('#')) {
            allTags = allTags && e.tags.contains(f.substr(1))
        }
        else {
            nameMatch = e.name.includes(f)
        }
    }
    return nameMatch && allTags
}

export class Entity implements Serializable{

    constructor(public name:string, public properties:PropertiesCollection, public tags:Tags)
    {
    }

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
        return {
            name:this.name,
            properties:this.properties,
            tags:this.tags.serialize()
        }
    }
    deserialize(obj:any)
    {
        this.name = obj.name
        this.properties.deserialize(obj.properties)
        this.tags.deserialize(obj.tags)
    }
}
