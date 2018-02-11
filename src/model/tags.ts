import { TrackableArray, Trackable } from './trackable';

export type Tag = string

export interface Tagged {
    tags:Tags
}

export class Tags extends TrackableArray<Tag>{
    tagsMap: { [key: string]: boolean } = {}
    add(tag: Tag) {
        if (!this.tagsMap[tag]) {
            this.push(tag)
            this.tagsMap[tag] = true
        }
    }
    isEmpty() {
        return this.array.length == 0
    }
    remove(tag: Tag) {
        if (this.tagsMap[tag]) {
            super.remove(tag, (a, b) => a == b)
            delete this.tagsMap[tag]
        }
    }
    contains(tag: Tag) {
        return this.tagsMap[tag]
    }
    toState() {
        return [...this.array]
    }
    cloneObject() {
        let rv = new Tags;
        for (let tag of this.array) {
            rv.add(tag)
        }
        return rv
    }
    deserialize(arr: Array<string>) {
        for (let tag of arr) {
            this.add(tag)
        }
    }
}
