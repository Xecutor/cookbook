import { TrackableArray, Trackable } from './trackable';

export type Tag = string

export class Tags implements Trackable<string>{
    tags = new TrackableArray<Tag>()
    tagsMap:{[key:string]:boolean} = {}
    get modified():boolean{
        return this.tags.modified
    }
    ack()
    {
        this.tags.ack()
    }
    add(tag:Tag)
    {
        if(!this.tagsMap[tag]) {
            this.tags.push(tag)
            this.tagsMap[tag] = true
        }
    }
    remove(tag:Tag)
    {
        if(this.tagsMap[tag]) {
            this.tags.remove(tag, (a,b)=>a==b)
            delete this.tagsMap[tag]
        }
    }
    contains(tag:Tag)
    {
        return this.tagsMap[tag]
    }
    mark()
    {
        this.tags.mark()
    }
    clone()
    {
        return this.tags.clone()
    }
    cloneObject()
    {
        let rv = new Tags;
        for(let tag of this.tags.array) {
            rv.add(tag)
        }
        return rv
    }
    serialize()
    {
        return this.tags.serialize()
    }
    deserialize(arr:Array<string>) {
        for(let tag of arr) {
            this.add(tag)
        }
    }
}
