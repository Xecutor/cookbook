import { CraftingMethod } from './crafting-method';
import { Item } from './item';

export class Crafter extends Item {
    craftingMethods = new Array<CraftingMethod>()
    isCrafter() {
        return true
    }
    getType() {
        return "Crafter"
    }
    serialize() {
        return {
            ...super.serialize(), 
            craftingMethods : this.craftingMethods.map(cm=>({name:cm.name, level:cm.level}))
        }
    }
    deserialize(obj:any) {
        super.deserialize(obj)
        let craftingMethods = obj.craftingMethods || []
        for(let cmObj of craftingMethods) {
            let cm = new CraftingMethod(cmObj.name, cmObj.level)
            this.craftingMethods.push(cm)
        }
    }
}
