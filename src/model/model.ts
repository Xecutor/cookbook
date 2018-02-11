import { Recipe } from './recipe';
import { Crafter } from './crafter';
import { Resource } from './resource';
import { Item } from './item';
import { Tags } from "./tags";
import { PropertyDecl } from './property';
import { CraftingMethod } from './crafting-method';
import { TrackableArray, Trackable } from './trackable';
import { Entity } from './entity';

export interface ModelState {
    tags?: Array<string>
    items?: Array<Item>
    resources?: Array<Resource>
    crafters?: Array<Crafter>
    properties?: Array<PropertyDecl>
    craftingMethods?: Array<CraftingMethod>
    recipes?: Array<Recipe>
}

type ModelType = string | Item | Resource | Crafter | PropertyDecl | CraftingMethod | Recipe

function updateState<T>(name: keyof ModelState, cnt: Trackable<T>, st: ModelState) {
    if (cnt.modified) {
        st[name] = cnt.toState() as any
        cnt.ack()
    }
}

export class Model {
    tags = new Tags()
    properties = new TrackableArray<PropertyDecl>()
    items = new TrackableArray<Item>()
    resources = new TrackableArray<Resource>()
    crafters = new TrackableArray<Crafter>()
    craftingMethods = new TrackableArray<CraftingMethod>()
    recipes = new TrackableArray<Recipe>()
    getStateUpdate() {
        let result: ModelState = {}
        updateState("tags", this.tags, result)
        updateState("properties", this.properties, result)
        updateState("items", this.items, result)
        updateState("resources", this.resources, result)
        updateState("crafters", this.crafters, result)
        updateState("craftingMethods", this.craftingMethods, result)
        updateState("recipes", this.recipes, result)

        return result
    }
    cleanExport() {
        let result : any = {}
        result.items = this.items.array.map(item=>item.cleanExport())
        result.resources = this.resources.array.map(res=>res.cleanExport())
        result.crafters = this.crafters.array.map(craft=>craft.cleanExport())
        result.craftingMethods = this.craftingMethods.array.map(cm=>cm.cleanExport())
        result.recipes = this.recipes.array.map(recipe=>recipe.cleanExport())
        return JSON.stringify(result)
    }
    serialize() {
        let result: any = {}
        result.tags = this.tags.serialize()
        result.properties = this.properties.serialize()
        result.items = this.items.serialize()
        result.resources = this.resources.serialize()
        result.crafters = this.crafters.serialize()
        result.craftingMethods = this.craftingMethods.serialize()
        result.recipes = this.recipes.serialize()
        let resultStr = JSON.stringify(result);
        console.log("saving:", resultStr);
        return resultStr;
    }
    deserialize(jsonString: string) {
        console.log("loading:", jsonString);
        let json = JSON.parse(jsonString)
        this.tags.deserialize(json.tags || [])
        this.properties.deserialize(json.properties || [], PropertyDecl)
        this.items.deserialize(json.items || [], Item);
        this.resources.deserialize(json.resources || [], Resource);
        this.crafters.deserialize(json.crafters || [], Crafter);
        this.craftingMethods.deserialize(json.craftingMethods || [], CraftingMethod)
        this.recipes.deserialize(json.recipes || [], Recipe)
    }
    findRecipesByNameType(name:string, type:string) {
        let rv = []
        for(let r of this.recipes.array) {
            for(let o of r.output) {
                if(o.type==type && o.name==name) {
                    rv.push(r)
                }
            }
        }
        return rv
    }
}