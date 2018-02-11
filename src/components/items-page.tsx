import * as React from "react";
import * as ReactDOM from "react-dom";

import { Entity } from "../model/entity";
import { PropertyDecl, PropertiesCollection, PropertyClass } from "../model/property";
import { FilteredList } from "./filtered-list";
import { Item } from "../model/item";
import { EntityEditor, EntityHandler } from "./entity-editor";
import { Tags, Tag } from "../model/tags";
import { ModelState } from "../model/model";

export interface ItemHandler {
    onAddItem(item: Item): void
    onUpdateItem(item: Item): void
    onDeleteItem(item: Item): void
}

interface ItemsPageProps {
    model:ModelState
    itemHandler: ItemHandler
}

export class ItemsPage extends React.Component<ItemsPageProps, any> implements EntityHandler {
    onAddEntity(name: string, props: PropertiesCollection, tags: Tags) {
        let newItem = new Item(name, props.clone(), tags.cloneObject())
        this.props.itemHandler.onAddItem(newItem)
    }
    onUpdateEntity(name: string, props: PropertiesCollection, tags: Tags) {
        let updatedItem = new Item(name, props.clone(), tags.cloneObject())
        this.props.itemHandler.onUpdateItem(updatedItem)
    }
    onDeleteEntity(name: string) {
        let itemToDel = this.props.model.items.find(item => item.name == name)
        if (itemToDel) {
            this.props.itemHandler.onDeleteItem(itemToDel)
        }
    }
    render() {
        return <EntityEditor
            model={this.props.model}
            entities={this.props.model.items}
            props={this.props.model.properties.filter(prop=>prop.pclass==PropertyClass.item)}
            entityHandler={this}
        />
    }
}
