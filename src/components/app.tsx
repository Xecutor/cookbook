import * as React from "react";
import * as ReactDOM from "react-dom";

import { Tab } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';

import { Model } from "../model/model";
import { TagsPage } from "./tags-page";
import { Tag } from "../model/tags";
import { PropertiesPage } from "./properties-page";
import { PropertyDecl, PropertyClass, PropertyType } from "../model/property";

interface CookBookAppState{
    model:Model
}

export class CookBookApp extends React.Component<any, CookBookAppState> {
    constructor(props:any)
    {
        super(props)
        this.state={
            model:new Model()
        }
        for(let i=0;i<20;++i) {
            this.state.model.tags.add(`item${i}`)
        }
        this.state.model.properties.push(new PropertyDecl(PropertyClass.item, "test", PropertyType.string))
    }
    onAddTag(tag:Tag)
    {
        this.state.model.tags.add(tag)
        this.forceUpdate()
    }
    onDelTag(tag:Tag)
    {
        this.state.model.tags.remove(tag)
        this.forceUpdate()
    }
    render()
    {
        const panes = [
            {menuItem:'Tags', render:()=><TagsPage tags={this.state.model.tags} onAddTag={(tag)=>this.onAddTag(tag)} onDelTag={tag=>this.onDelTag(tag)}/>},
            {menuItem:'Properties', render:()=><PropertiesPage declarations={this.state.model.properties}/>},
            {menuItem:'Items', render:()=><div>items</div>},
            {menuItem:'Resources', render:()=><div>resources</div>},
            {menuItem:'Crafting Methods', render:()=><div>cmethods</div>},
            {menuItem:'Recipes', render:()=><div>recipes</div>},
        ]
        return <Tab panes={panes}></Tab>
    }
}
