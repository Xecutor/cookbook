import * as React from "react";
import * as ReactDOM from "react-dom";

import { Tab } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';

import { Model, ModelState } from "../model/model";
import { TagsPage } from "./tags-page";
import { Tag } from "../model/tags";
import { PropertiesPage } from "./properties-page";
import { PropertyDecl, PropertyClass, PropertyType } from "../model/property";

interface CookBookAppState extends ModelState{
}

export class CookBookApp extends React.Component<any, CookBookAppState> {
    model = new Model()
    constructor(props:any)
    {
        super(props)
        for(let i=0;i<20;++i) {
            this.model.tags.add(`item${i}`)
        }
        this.model.properties.push(new PropertyDecl(PropertyClass.item, "Test", PropertyType.string))
        this.state=this.model.getStateUpdate()
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
        if(this.model.properties.find(newProp, (a,b)=>a.name==b.name && a.pclass==b.pclass) {
            return;
        }
        this.model.properties.push(newProp)
        this.updateStateFromModel()
    }
    onUpdateProp(updatedProp:PropertyDecl) {
        for(let prop of this.model.properties.array) {
            if(prop.name == updatedProp.name && prop.pclass==updatedProp.pclass) {
                prop.type = updatedProp.type
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
            {menuItem:'Items', render:()=><div>items</div>},
            {menuItem:'Resources', render:()=><div>resources</div>},
            {menuItem:'Crafting Methods', render:()=><div>cmethods</div>},
            {menuItem:'Recipes', render:()=><div>recipes</div>},
        ]
        return <Tab panes={panes}></Tab>
    }
}
