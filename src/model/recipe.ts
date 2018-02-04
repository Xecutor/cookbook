import { CookBookApp } from './../components/app';
import { Named } from './named';
import { Crafter } from './crafter';
import { CraftingMethod } from './crafting-method';
import { Serializable } from './serializable';
import { Item } from './item';
import { Resource } from "./resource";
import { Tag, Tags } from './tags';

type IngredientType = "Item" | "Resource" | "Crafter" | "Tag"
type OutputType = "Item" | "Resource" | "Crafter"

export class Ingredient {
    constructor(public type: IngredientType, public name:string, public count: number) {
    }
    serialize() {
        return {
            type:this.type,
            name:this.name,
            count:this.count
        }
    }
    deserialize(obj:any) {
        this.type = obj.type
        this.name = obj.name
        this.count = obj.count
    }
}

export class Output {
    constructor(public type:OutputType, public name:string, public count: number) {
    }
    serialize() {
        return {
            type:this.type,
            name:this.name,
            count:this.count
        }
    }
    deserialize(obj:any) {
        this.type = obj.type
        this.name = obj.name
        this.count = obj.count
    }
}

export class Recipe implements Serializable {
    input = new Array<Ingredient>()
    output = new Array<Output>()
    tags = new Tags()
    craftingMethod: CraftingMethod
    serialize() {
        return {
            input:this.input.map(val=>val.serialize()),
            output:this.output.map(val=>val.serialize()),
            tags:this.tags.serialize(),
            craftingMethod:this.craftingMethod.serialize()
        }
    }
    deserialize(obj: any) {
        for(let ingObj of obj.input) {
            let ing = new Ingredient(ingObj.type, ingObj.name, ingObj.count)
            this.input.push(ing)
        }
        for(let outObj of obj.output) {
            let out = new Output(outObj.type, outObj.name, outObj.count)
            this.output.push(out)
        }
        this.tags.deserialize(obj.tags)
        this.craftingMethod.deserialize(obj.craftingMethod)
    }
}
