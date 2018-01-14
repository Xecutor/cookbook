
export type Tag = string

export class Tags{
    tags:Array<Tag> = new Array<Tag>()
    tagsMap:{[key:string]:boolean} = {}
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
            this.tags=this.tags.filter(val=>val!=tag)
            delete this.tagsMap[tag]
        }
    }
    contains(tag:Tag)
    {
        return this.tagsMap[tag]
    }
}
