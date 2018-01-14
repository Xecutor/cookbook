
export enum PropertyType{
    boolean,
    string,
    number,
    item,
    resource,
    craftingMethod
}

export enum PropertyClass {
    item,
    resource,
    crafter
}

declare class Item{}
declare class Resource{}
declare class CraftingMethod{}

class PropertyValue {
    value : PropertyValueType
    constructor(value : PropertyValueType)
    {
        this.value = value
    }
}

type PropertyValueType = boolean | string | number | Item | Resource | CraftingMethod | Array<PropertyValue>;

export class BaseProperty{
    name:string
    value:PropertyValueType
    constructor( name:string, value:PropertyValueType)
    {
        this.name = name
        this.value = new PropertyValue(value)
    }
}

export class PropertyDecl{
    pclass:PropertyClass
    name:string
    type:PropertyType
    constructor(pclass:PropertyClass, name:string, type:PropertyType)
    {
        this.pclass = pclass
        this.name = name
        this.type = type
    }
}

export class PropertiesCollection {
    array : Array<BaseProperty>;
    add(prop:BaseProperty)
    {
        this.array.push(prop);
    }
    removeByName(propName:string)
    {
        this.array = this.array.filter(prop=>prop.name!=propName);
    }
    findByName(propName:string)
    {
        for(let prop of this.array) {
            if(prop.name == propName) {
                return prop;
            }
        }
        return null;
    }
}