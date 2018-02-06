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
    name: string
    input : Array<Ingredient>
    output :  Array<Output>
    tags : Tags
    craftingMethod : CraftingMethod


    constructor(name?:string,input?:Array<Ingredient>, output?:Array<Output>, tags?:Tags, craftingMethod?:CraftingMethod){
        this.name = name
        this.input = input ? input : new Array<Ingredient>()
        this.output = output ? output : new Array<Output>()
        this.tags = tags ? tags : new Tags();
        this.craftingMethod = craftingMethod ? craftingMethod : new CraftingMethod()
    }
    serialize() {
        return {
            name:this.name,
            input:this.input.map(val=>val.serialize()),
            output:this.output.map(val=>val.serialize()),
            tags:this.tags.serialize(),
            craftingMethod:this.craftingMethod.serialize()
        }
    }
    deserialize(obj: any) {
        this.name = obj.name
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
