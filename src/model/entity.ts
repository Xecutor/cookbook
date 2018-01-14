import { PropertiesCollection, BaseProperty } from "./property";

export class Entity{
    name:string;
    properties : PropertiesCollection;
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
}
