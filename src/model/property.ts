import { isRegExp } from "util";


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

// class PropertyValue {
//     value : PropertyValueType
//     constructor(value : PropertyValueType)
//     {
//         this.value = value
//     }
// }

type PropertyValueType = boolean | string | number | Item | Resource | CraftingMethod;

export class BaseProperty{
    name:string
    value:PropertyValueType
    constructor( name:string, value:PropertyValueType)
    {
        this.name = name
        this.value = value//new PropertyValue(value)
    }
}

export class PropertyDecl{
    pclass:PropertyClass
    name:string
    type:PropertyType
    isRequired:boolean
    defaultValue:PropertyValueType
    constructor(pclass:PropertyClass, name:string, type:PropertyType, isRequired:boolean)
    {
        this.pclass = pclass
        this.name = name
        this.type = type
        this.isRequired = isRequired
    }
}

export class PropertiesCollection {
    array = new Array<BaseProperty>()
    add(name:string, value:PropertyValueType)
    {
        this.array.push(new BaseProperty(name, value));
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
    clone() {
        let rv = new PropertiesCollection()
        for(let v of this.array) {
            rv.add(v.name, v.value)
        }
        return rv
    }
}