import { Serializable } from './serializable';
import { Tags, Tagged } from './tags';
import { PropertiesCollection, BaseProperty } from "./property";
import { Named } from './named';

export function entityEqByName(a: Entity, b: Entity) {
    return a.name == b.name
}

export function nameAndTagsDefaultFilter(e: { name: string, tags?: Tags }, filter: string) {
    let filterItems = filter.toLocaleLowerCase().split(/\s+/)
    let allTags = true
    let nameMatch = true
    for (let f of filterItems) {
        if (f.startsWith('#') && e.tags) {
            allTags = allTags && e.tags.contains(f.substr(1))
        }
        else {
            nameMatch = e.name.toLowerCase().includes(f)
        }
    }
    return nameMatch && allTags
}

export abstract class Entity implements Serializable, Named, Tagged {

    constructor(public name: string, public properties: PropertiesCollection, public tags: Tags) {
    }

    abstract getType():string;

    cleanExport() {
        let rv: any = {}
        rv.name = this.name
        if (this.properties.array.length) {
            rv.props = {}
        }
        for (let prop of this.properties.array) {
            rv.props[prop.name] = prop.value
        }
        if (!this.tags.isEmpty()) {
            rv.tags = this.tags.toState()
        }
        return rv
    }

    serialize() {
        return {
            name: this.name,
            properties: this.properties.array,
            tags: this.tags.serialize()
        }
    }
    
    deserialize(obj: any) {
        this.name = obj.name
        this.properties.deserialize(obj.properties)
        this.tags.deserialize(obj.tags)
    }
}
