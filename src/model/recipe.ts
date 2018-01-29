import { Serializable } from './serializable';
import { Item } from './item';
import { Resource } from "./resource";
import { Tag, Tags } from './tags';

export class Ingredient {
    thing: Item | Resource | Tag
    count : number
    constructor(thing: Item | Resource | Tag, count : number)
    {
        this.thing = thing
        this.count = count
    }
}

export class Output {
    thing: Item | Resource
    count : number
    constructor(thing: Item | Resource, count : number)
    {
        this.thing = thing
        this.count = count
    }
}

export class Recipe implements Serializable {
    input = new Array<Ingredient>()
    output = new Array<Output>()
    tags = new Tags()
    serialize()
    {
        return this
    }
    deserialize(json:any)
    {
        //todo
    }
}
