import * as React from "react";
import * as ReactDOM from "react-dom";
import { Entity } from "../model/entity";
import { PropertyDecl, PropertiesCollection } from "../model/property";
import { FilteredList } from "./filtered-list";
import { Item } from "../model/item";
import { EntityEditor, EntityHandler } from "./entity-editor";
import { Tags, Tag } from "../model/tags";

export interface ItemHandler{
    onAddItem(item:Item):void
    onUpdateItem(item:Item):void
    onDeleteItem(item:Item):void
}

interface ItemsPageProps{
    tags:Tag[]
    items:Array<Item>
    props:Array<PropertyDecl>
    itemHandler:ItemHandler
}

export class ItemsPage extends React.Component<ItemsPageProps, any> implements EntityHandler{
    onAddEntity(name:string, props:PropertiesCollection, tags:Tags) {
        let newItem = new Item(name, props.clone(), tags.cloneObject())
        this.props.itemHandler.onAddItem(newItem)
    }
    onUpdateEntity(name:string, props:PropertiesCollection, tags:Tags) 
    {
        let updatedItem = new Item(name, props.clone(), tags.cloneObject())
        this.props.itemHandler.onUpdateItem(updatedItem)
    }
    onDeleteEntity(name:string)
    {
        let itemToDel = this.props.items.find(item=>item.name==name)
        if(itemToDel) {
            this.props.itemHandler.onDeleteItem(itemToDel)
        }
    }
    render() {
        return <EntityEditor 
            tags={this.props.tags}
            entities={this.props.items}
            props={this.props.props} 
            entityHandler={this}
        />
    }
}
