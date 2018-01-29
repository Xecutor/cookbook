import { Serializable } from './serializable';
import Tab from "semantic-ui-react/dist/commonjs/modules/Tab/Tab";

export interface Trackable<T> {
    modified : boolean
    ack():void
    mark():void
    clone():Array<T>
}

export class TrackableArray<T extends (Serializable|string)> implements Trackable<T>{
    array = new Array<T>()
    modified = true
    push(val:T)
    {
        this.array.push(val)
        this.modified = true
    }
    find(val:T, eq:(a:T, b:T)=>boolean)
    {
        for(let v of this.array) {
            if(eq(v,val)) {
                return v
            }
        }
        return null
    }
    remove(val:T, eq:(a:T, b:T)=>boolean)
    {
        this.array = this.array.filter(item=>!eq(val,item))
        this.modified = true
    }
    mark()
    {
        this.modified = true
    }
    ack()
    {
        this.modified = false
    }
    clone()
    {
        return [...this.array];
    }
    serialize()
    {
        let result = []
        for(let item of this.array) {
            if(typeof item==="string") {
                result.push(item)
            }
            else {
                result.push((item as Serializable).serialize())
            }
        }
        return result
    }
    deserialize(arr:Array<any>, ctor?:{new():T})
    {
        for(let obj of arr) {
            if(ctor) {
                let item = (new ctor()) as Serializable
                item.deserialize(obj)
                this.push(item as T)
            } else {
                this.push(obj);
            }
        }
    }
}