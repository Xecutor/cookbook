import * as React from "react";
import * as ReactDOM from "react-dom";
import { Entity } from "../model/entity";
import { PropertyDecl } from "../model/property";

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
            <div>hello</div>
        )
    }
}