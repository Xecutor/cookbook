import * as React from "react";
import * as ReactDOM from "react-dom";

import { Tab } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';

import { Model, ModelState } from "../model/model";
import { TagsPage } from "./tags-page";
import { Tag } from "../model/tags";
import { PropertiesPage } from "./properties-page";
import { PropertyDecl, PropertyClass, PropertyType } from "../model/property";
import { ItemsPage } from "./items-page";
import { Item } from "../model/item";

require('offline-plugin/runtime').install();

interface CookBookAppState extends ModelState{
}

export class CookBookApp extends React.Component<any, CookBookAppState> {
    model = new Model()
    constructor(props:any)
    {
        super(props)

        window.onblur = ()=>this.saveModelToLocalstorage()
        window.onunload = ()=>this.saveModelToLocalstorage()
        this.loadModelFromLocalstorage()

        this.state=this.model.getStateUpdate()
    }
    saveModelToLocalstorage()
    {
        localStorage.setItem("cookbook-data", this.model.serialize())
    }
    loadModelFromLocalstorage()
    {
        let data = localStorage.getItem("cookbook-data")
        if(data) {
            this.model.deserialize(data)
        }
    }
    onAddTag(tag:Tag)
    {
        this.model.tags.add(tag)
        this.updateStateFromModel()
    }
    onDelTag(tag:Tag)
    {
        this.model.tags.remove(tag)
        this.updateStateFromModel()
    }
    onAddProp(newProp:PropertyDecl) {
        if(this.model.properties.find(newProp, (a,b)=>a.name==b.name && a.pclass==b.pclass)) {
            return;
        }
        this.model.properties.push(newProp)
        this.updateStateFromModel()
    }
    onUpdateProp(updatedProp:PropertyDecl) {
        for(let prop of this.model.properties.array) {
            if(prop.name == updatedProp.name && prop.pclass == updatedProp.pclass) {
                prop.type = updatedProp.type
                prop.isRequired = updatedProp.isRequired
                prop.defaultValue = updatedProp.defaultValue
                this.model.properties.mark()
                break;
            }
        }
        this.updateStateFromModel()
    }
    onDeleteProp(propToDel:PropertyDecl) {
        this.model.properties.remove(propToDel, (a,b)=>a.name==b.name && a.pclass==b.pclass);
        this.updateStateFromModel()
    }
    updateStateFromModel() {
        this.setState(this.model.getStateUpdate())
    }
    render()
    {
        const panes = [
            {menuItem:'Tags', render:()=><TagsPage tags={this.state.tags} onAddTag={(tag)=>this.onAddTag(tag)} onDelTag={tag=>this.onDelTag(tag)}/>},
            {menuItem:'Properties', render:()=><PropertiesPage 
                                                   declarations={this.state.properties} 
                                                   onAddProp={newProp=>this.onAddProp(newProp)}
                                                   onUpdateProp={updProp=>this.onUpdateProp(updProp)}
                                                   onDeleteProp={updProp=>this.onDeleteProp(updProp)}
                                                   />},
            {menuItem:'Items', render:()=><ItemsPage items={this.state.items} props={this.state.properties.filter(p=>p.pclass==PropertyClass.item)}/>},
            {menuItem:'Resources', render:()=><div>resources</div>},
            {menuItem:'Crafting Methods', render:()=><div>cmethods</div>},
            {menuItem:'Recipes', render:()=><div>recipes</div>},
        ]
        return <Tab panes={panes}></Tab>
    }
}
