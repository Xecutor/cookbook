import * as React from "react";
import * as ReactDOM from "react-dom";

import { Tab } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';

import { Model, ModelState } from "../model/model";
import { TagsPage } from "./tags-page";
import { Tag } from "../model/tags";
import { PropertiesPage, PropertiesHandler } from "./properties-page";
import { PropertyDecl, PropertyClass, PropertyType } from "../model/property";
import { ItemsPage, ItemHandler } from "./items-page";
import { Item } from "../model/item";
import { entityEqByName } from "../model/entity";

//require('offline-plugin/runtime').install();

interface CookBookAppState extends ModelState{
}

export class CookBookApp extends React.Component<any, CookBookAppState> implements ItemHandler, PropertiesHandler {
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

    onMovePropUp(idx: number) {
        let p = this.model.properties;
        let pclass = p.at(idx).pclass
        let prevIdx = -1;
        console.log(`move up idx=${idx}, type=${pclass}`)
        for (let i = idx - 1; i >= 0; --i) {
            console.log(`type at ${i} = ${p.at(i).pclass}`)
            if (p.at(i).pclass == pclass) {
                console.log(`found at ${i}`)
                prevIdx = i;
                break;
            }
        }
        if (prevIdx != -1) {
            p.swap(idx, prevIdx)
            this.updateStateFromModel()
        }
    }

    onMovePropDown(idx: number) {
        let p = this.model.properties;
        let pclass = p.at(idx).pclass
        let nextIdx = -1;
        console.log(`move down idx=${idx}, type=${pclass}`)
        for (let i = idx + 1; i < p.size(); ++i) {
            console.log(`type at ${i} = ${p.at(i).type}`)
            if (p.at(i).pclass == pclass) {
                console.log(`found at ${i}`)
                nextIdx = i;
                break;
            }
        }
        if (nextIdx != -1) {
            p.swap(idx, nextIdx)
            this.updateStateFromModel()
        }
    }

    updateStateFromModel() {
        this.setState(this.model.getStateUpdate())
    }

    onAddItem(item:Item) {
        this.model.items.push(item)
        this.updateStateFromModel()
    }
    onUpdateItem(item:Item) {
        let upItem = this.model.items.find(item, entityEqByName)
        upItem.properties = item.properties
        upItem.tags = item.tags
        this.model.items.mark()
        this.updateStateFromModel()
    }

    onDeleteItem(item:Item) {
        this.model.items.remove(item, entityEqByName)
        this.updateStateFromModel()
    }

    render()
    {
        const panes = [
            {menuItem:'Tags', render:()=><TagsPage tags={this.state.tags} onAddTag={(tag)=>this.onAddTag(tag)} onDelTag={tag=>this.onDelTag(tag)}/>},
            {menuItem:'Properties', render:()=><PropertiesPage 
                                                   declarations={this.state.properties} 
                                                   handler={this}
                                                   />},
            {menuItem:'Items', render:()=><ItemsPage 
                                            tags={this.state.tags}
                                            items={this.state.items} 
                                            props={this.state.properties.filter(p=>p.pclass==PropertyClass.item)}
                                            itemHandler={this}
                                            />},
            {menuItem:'Resources', render:()=><div>resources</div>},
            {menuItem:'Crafting Methods', render:()=><div>cmethods</div>},
            {menuItem:'Recipes', render:()=><div>recipes</div>},
        ]
        return <Tab panes={panes}></Tab>
    }
}
