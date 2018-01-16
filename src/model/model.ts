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
    items = new TrackableArray<Item>()
    resources = new TrackableArray<Resource>()
    crafters = new TrackableArray<Crafter>()
    properties = new TrackableArray<PropertyDecl>()
    craftingMethods = new TrackableArray<CraftingMethod>()
    recipes  = new  TrackableArray<Recipe>()
    getStateUpdate()
    {
        let result : ModelState = {}
        updateState("tags", this.tags, result)
        updateState("items", this.items, result)
        updateState("resources", this.resources, result)
        updateState("crafters", this.crafters, result)
        updateState("properties", this.properties, result)
        updateState("craftingMethods", this.craftingMethods, result)
        updateState("recipes", this.recipes, result)

        return result
    }
}