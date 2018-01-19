import * as React from "react";
import * as ReactDOM from "react-dom";
import { Entity } from "../model/entity";
import { PropertyDecl } from "../model/property";
import { FilteredList } from "./filtered-list";
import { Item } from "../model/item";
import { EntityEditor } from "./entity-editor";


interface ItemsPageProps{
    items:Array<Item>
    props:Array<PropertyDecl>
}

export class ItemsPage extends React.Component<ItemsPageProps, any> {
    render() {
        return <EntityEditor 
            entities={this.props.items} props={this.props.props} 
            onAddEntity={e=>1}
            onDeleteEntity={e=>1}
            onUpdateEntity={e=>1}
        />
    }
}
