import * as React from "react";
import * as ReactDOM from "react-dom";
import { Entity } from "../model/entity";
import { PropertyDecl, PropertiesCollection, PropertyClass } from "../model/property";
import { FilteredList } from "./filtered-list";
import { Crafter } from "../model/crafter";
import { EntityEditor, EntityHandler } from "./entity-editor";
import { Tags, Tag } from "../model/tags";
import Label from "semantic-ui-react/dist/commonjs/elements/Label/Label";
import { NamedPicker } from "./named-picker";
import { CraftingMethod } from "../model/crafting-method";
import { TrackableArray } from "../model/trackable";
import Dropdown from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon/Icon";
import { ModelState } from "../model/model";
import Form from "semantic-ui-react/dist/commonjs/collections/Form/Form";
import { Named } from "../model/named";

export interface CrafterHandler {
    onAddCrafter(item: Crafter): void
    onUpdateCrafter(item: Crafter): void
    onDeleteCrafter(item: Crafter): void
}

interface CraftersPageProps {
    model:ModelState
    crafterHandler: CrafterHandler
}

interface CraftersPageState {
    craftingMethods:Array<CraftingMethod>
}

export class CraftersPage extends React.Component<CraftersPageProps, CraftersPageState> implements EntityHandler {
    constructor(props:CraftersPageProps) {
        super(props)
        
        this.state = {
            craftingMethods: []
        }
    }
    onAddEntity(name: string, props: PropertiesCollection, tags: Tags) {
        let newCrafter = new Crafter(name, props.clone(), tags.cloneObject())
        newCrafter.craftingMethods = [...this.state.craftingMethods]
        this.props.crafterHandler.onAddCrafter(newCrafter)
        this.setState({craftingMethods:[]})
    }
    onUpdateEntity(name: string, props: PropertiesCollection, tags: Tags) {
        let updatedCrafter = new Crafter(name, props.clone(), tags.cloneObject())
        updatedCrafter.craftingMethods = [...this.state.craftingMethods]
        this.props.crafterHandler.onUpdateCrafter(updatedCrafter)
        this.setState({craftingMethods:[]})
    }
    onDeleteEntity(name: string) {
        let itemToDel = this.props.model.crafters.find(crafter => crafter.name == name)
        if (itemToDel) {
            this.props.crafterHandler.onDeleteCrafter(itemToDel)
        }
    }
    onAddCraftingMethod(cm:CraftingMethod ) {
        console.log(`add cm name=${cm.name}`)
        if(!this.state.craftingMethods.some(val=>val.name==cm.name)) {
            console.log("added!")
            let craftingMethods = [...this.state.craftingMethods]
            craftingMethods.push(new CraftingMethod(cm.name, 1))
            this.setState({craftingMethods})
        }
    }
    onRemoveCraftingMethod(cm:CraftingMethod) {
        let craftingMethods = this.state.craftingMethods.filter(val=>val.name!=cm.name)
        this.setState({craftingMethods})
    }
    onSelectEntity(craft:Crafter) {
        console.log(`selected ${craft.name}`)
        this.setState({craftingMethods:craft.craftingMethods})
    }

    onLevelChanged(cm:CraftingMethod, newLevel:number) {
        let craftingMethods = this.state.craftingMethods.map(val=>{
            if(val.name==cm.name) {
                val.level = newLevel
            }
            return val
        })
        this.setState({craftingMethods})
    }

    createCraftingMethod(cm:CraftingMethod) {
        let maxLevel = this.props.model.craftingMethods.find(val=>val.name==cm.name).level
        console.log(`level=${cm.level}, maxLevel=${maxLevel}`)
        let lvlSelect = []
        for(let i=1;i<=maxLevel;++i) {
            lvlSelect.push({text:`Lvl:${i}`, value:i})
        }
        return <Label 
            key={cm.name}
            onClick={()=>this.onRemoveCraftingMethod(cm)}>
                {cm.name}&nbsp;&nbsp;
                <Dropdown 
                    value={cm.level}
                    options={lvlSelect}
                    onChange={(e,{value})=>this.onLevelChanged(cm,value as number)}
                />
                <Icon name="delete" inverted circular color="red"/>
        </Label>
    }
    render() {
        let labels = this.state.craftingMethods.map(cm=>this.createCraftingMethod(cm))
        let cmError : {[key:string]:boolean} = {}
        let iconProps : {[key:string]:boolean | string} = { bordered : true}
        if(!this.state.craftingMethods.length) {
            cmError["error"] = true
            iconProps["color"] = "red"
        }
        let xtra=<span key="picker">
            <Form.Field {...cmError} key="crafting-methods" label="Crafting methods"/>
            {labels}
            <NamedPicker 
                key="cm-picker"
                iconProps={iconProps}
                values={this.props.model.craftingMethods}
                onSelect={(cm:Named)=>this.onAddCraftingMethod(cm as CraftingMethod)}
            />
        </span>
        return <EntityEditor
            model={this.props.model}
            entities={this.props.model.crafters}
            props={this.props.model.properties.filter(prop=>prop.pclass==PropertyClass.crafter)}
            entityHandler={this}
            extraForm={xtra}
        />
    }
}
