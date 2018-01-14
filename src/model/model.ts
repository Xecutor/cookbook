import { Recipe } from './recipe';
import { Crafter } from './crafter';
import { Resource } from './resource';
import { Item } from './item';
import { Tags } from "./tags";
import { PropertyDecl } from './property';
import { CraftingMethod } from './crafting-method';

export class Model {
    tags = new Tags
    items = new Array<Item>()
    resources = new Array<Resource>()
    crafters = new Array<Crafter>()
    properties = new Array<PropertyDecl>()
    craftingMethods = new Array<CraftingMethod>()
    recipes  = new  Array<Recipe>()
}