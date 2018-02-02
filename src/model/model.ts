import { Recipe } from './recipe';
import { Crafter } from './crafter';
import { Resource } from './resource';
import { Item } from './item';
import { Tags } from "./tags";
import { PropertyDecl } from './property';
import { CraftingMethod } from './crafting-method';
import { TrackableArray, Trackable } from './trackable';

export interface ModelState{
    tags?:Array<string>
    items?:Array<Item>
    resources?:Array<Resource>
    crafters?:Array<Crafter>
    properties?:Array<PropertyDecl>
    craftingMethods?:Array<CraftingMethod>
    recipes?:Array<Recipe>
}

type ModelType = string | Item | Resource | Crafter | PropertyDecl | CraftingMethod | Recipe

function updateState<T>(name: keyof ModelState, cnt:Trackable<T>,  st:ModelState)
{
    if(cnt.modified) {
        st[name] = cnt.clone() as any
        cnt.ack()
    }
}

export class Model{
    tags = new Tags()
    properties = new TrackableArray<PropertyDecl>()
    items = new TrackableArray<Item>()
    resources = new TrackableArray<Resource>()
    crafters = new TrackableArray<Crafter>()
    craftingMethods = new TrackableArray<CraftingMethod>()
    recipes  = new  TrackableArray<Recipe>()
    getStateUpdate()
    {
        let result : ModelState = {}
        updateState("tags", this.tags, result)
        updateState("properties", this.properties, result)
        updateState("items", this.items, result)
        updateState("resources", this.resources, result)
        updateState("crafters", this.crafters, result)
        updateState("craftingMethods", this.craftingMethods, result)
        updateState("recipes", this.recipes, result)

        return result
    }
    serialize() {
        let result : any = {}
        result.tags = this.tags.serialize()
        result.properties = this.properties.serialize()
        result.items = this.items.serialize()
        let resultStr = JSON.stringify(result);
        console.log("saving:", resultStr);
        return resultStr;
    }
    deserialize(jsonString:string)
    {
        console.log("loading:", jsonString);
        let json = JSON.parse(jsonString)
        this.tags.deserialize(json.tags || [])
        this.properties.deserialize(json.properties || [], PropertyDecl)
        this.items.deserialize(json.items || [], Item);
    }
}