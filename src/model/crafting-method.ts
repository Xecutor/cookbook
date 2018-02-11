import { TagEditor } from './../components/tag-editor';
import { Named } from './named';
import { Tags } from './tags';
import { Serializable } from './serializable';

export class CraftingMethod implements Serializable, Named {
    name: string
    level: number
    tags: Tags
    constructor(name?: string, level?: number, tags?: Tags) {
        this.name = name
        this.level = level
        this.tags = tags ? tags : new Tags;
    }
    cleanExport() {
        let rv : any = {}
        rv.name = this.name
        rv.maxLevel = this.level
        if (!this.tags.isEmpty()) {
            rv.tags = this.tags.toState()
        }
        return rv
    }
    serialize() {
        return {
            name: this.name,
            level: this.level,
            tags: this.tags.toState()
        }
    }
    deserialize(json: any) {
        this.name = json.name
        this.level = json.level
        this.tags.deserialize(json.tags)
    }
}
