import { Serializable } from './serializable';

export class CraftingMethod implements Serializable{
    name:string
    level:number
    constructor(name:string, level:number)
    {
        this.name = name
        this.level = level
    }
    serialize()
    {
        return this
    }
    deserialize(json:any)
    {
        this.name = json.name
        this.level = json.level
    }
}
