export interface Trackable<T> {
    modified : boolean
    ack():void
    mark():void
    clone():Array<T>
}

export class TrackableArray<T> implements Trackable<T>{
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
}