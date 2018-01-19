import * as React from "react";
import * as ReactDOM from "react-dom";
import { Entity } from "../model/entity";
import { PropertyDecl } from "../model/property";
import { FilteredList } from "./filtered-list";

interface EntityEditorProps<T extends Entity>{
    entities: Array<T>
    props: Array<PropertyDecl>
    onAddEntity:(newEntity:T)=>void
    onUpdateEntity:(updateEntity:T)=>void
    onDeleteEntity:(enitityToDel:T)=>void
}

export class EntityEditor<T extends Entity> extends React.Component<EntityEditorProps<T>, any> {
    render() {
        return (
            <div>
                <FilteredList
                    list={this.props.entities}
                    filter={(e:Entity,str:string)=>e.name.indexOf(str)>=0}
                    renderItem={(val:Entity)=>val.name}
                    isButton={true}
                    haveDelete={true}
                    columns={4}
                />
            </div>
        )
    }
}