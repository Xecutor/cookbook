import * as React from "react";
import * as ReactDOM from "react-dom";
import { Entity } from "../model/entity";

interface EntityPickerProps{
    entities:Array<Entity>
    onPickedEntity:(entity:Entity)=>void
}

interface EntityPickerState{
    filter:string
}

export class EntityPicker extends React.Component<EntityPickerProps, EntityPickerState> {
    constructor(props:EntityPickerProps) {
        super(props)
        this.state = {
            filter:''
        }
    }
    render() {
        return (
        <div>
        </div>
        )
    }
}