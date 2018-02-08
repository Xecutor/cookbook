import * as React from "react";
import * as ReactDOM from "react-dom";
import { PropertyDecl, PropertyClass, PropertyType } from "../model/property";
import Grid from "semantic-ui-react/dist/commonjs/collections/Grid/Grid";
import Dropdown from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";
import Label from "semantic-ui-react/dist/commonjs/elements/Label/Label";
import Input from "semantic-ui-react/dist/commonjs/elements/Input/Input";
import Button from "semantic-ui-react/dist/commonjs/elements/Button/Button";
import Select from "semantic-ui-react/dist/commonjs/addons/Select/Select";
import Checkbox from "semantic-ui-react/dist/commonjs/modules/Checkbox/Checkbox";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon/Icon";
import { Item } from "../model/item";
import { NamedPicker } from "./named-picker";
import { ModelState } from "../model/model";
import { Entity } from "../model/entity";
import { Named } from "../model/named";

export interface PropertiesHandler {
    onAddProp(newProp: PropertyDecl): void
    onUpdateProp(updatedProp: PropertyDecl): void
    onDeleteProp(deletedProp: PropertyDecl): void
    onMovePropUp(idx: number): void
    onMovePropDown(idx: number): void
}

interface PropertiesPageProps {
    model: ModelState
    handler: PropertiesHandler
}

interface NewPropInfo {
    name: string
    type: number
    req: boolean
}

interface PropertiesPageState {
    newProp: Array<NewPropInfo>
}

function makePropertyTypeOptions() {
    let options = []
    for (let t in PropertyType) {
        let v = PropertyType[t]
        if (typeof v === "number") {
            options.push({
                text: t,
                value: v,
            })
        }
    }
    return options;
}

export class PropertiesPage extends React.Component<PropertiesPageProps, PropertiesPageState> {
    constructor(prop: PropertiesPageProps) {
        super(prop)
        let newProp = []
        for (let i = 0; i < 3; ++i) {
            newProp.push({
                name: '',
                type: -1,
                req: undefined
            })
        }
        this.state = {
            newProp: newProp
        }
    }
    onPropTypeChange(prop: PropertyDecl, newType: PropertyType) {
        let updatedProp = new PropertyDecl(prop.pclass, prop.name, newType, prop.isRequired);
        this.props.handler.onUpdateProp(updatedProp)
    }

    onPropReqChange(prop: PropertyDecl, newReq: boolean) {
        let updatedProp = new PropertyDecl(prop.pclass, prop.name, prop.type, newReq)
        this.props.handler.onUpdateProp(updatedProp)
    }

    onPropDefaultValueChange(prop: PropertyDecl, defValue: any) {
        // if(prop.type==PropertyType.number) {
        //     defValue = defValue.toString().replace(/[^\d.+\-]/,'');
        //     if(defValue.length===0) {
        //         defValue = 0;
        //     }
        //     else {
        //         try{
        //             defValue = parseFloat(defValue);
        //         }catch(e) {
        //         }
        //     }
        // }
        console.log(`set defValue=${defValue} for prop.name=${prop.name}`)
        let updatedProp = new PropertyDecl(prop.pclass, prop.name, prop.type, prop.isRequired)
        updatedProp.defaultValue = defValue;
        this.props.handler.onUpdateProp(updatedProp)
    }

    onMoveUp(idx: number) {
        this.props.handler.onMovePropUp(idx)
    }

    onMoveDown(idx: number) {
        this.props.handler.onMovePropDown(idx)
    }

    propToComp(idx: number, prop: PropertyDecl) {
        let options = makePropertyTypeOptions()
        let defaultValue;
        if (prop.type == PropertyType.boolean) {
            console.log(`prop.name=${prop.name}, defaultValue=${prop.defaultValue}`)
            let checked = {}
            if (prop.defaultValue !== undefined) {
                checked = { checked: prop.defaultValue }
            }
            else {
                checked = { indeterminate: true }
            }
            defaultValue = <Label><Checkbox fitted {...checked} onChange={(e, { checked }) => this.onPropDefaultValueChange(prop, checked)} /></Label>
        }
        else if (prop.type == PropertyType.string || prop.type == PropertyType.text || prop.type == PropertyType.number) {
            console.log(`prop.name=${prop.name}, defaultValue=${prop.defaultValue}`)
            let val = prop.defaultValue || "";
            defaultValue = <Input
                icon={{
                    name: "remove",
                    circular: true,
                    link: true,
                    onClick: () => this.onPropDefaultValueChange(prop, undefined)
                }}
                value={val}
                onChange={(e, { value }) => this.onPropDefaultValueChange(prop, value)} />
        }
        else if(prop.type == PropertyType.item || prop.type == PropertyType.resource || prop.type == PropertyType.crafter ||
                prop.type == PropertyType.craftingMethod) {
            let val = prop.defaultValue;
            if(val) {
                defaultValue=<Label>{val}<Icon name="delete" circular inverted color="red" onClick={()=>this.onPropDefaultValueChange(prop, undefined)}/></Label>
            }
            else {
                let values;
                switch(prop.type) {
                    case PropertyType.item:values = this.props.model.items;break;
                    case PropertyType.resource:values = this.props.model.resources;break;
                    case PropertyType.crafter:values = this.props.model.crafters;break;
                    case PropertyType.craftingMethod:values = this.props.model.craftingMethods;break;
                }
                defaultValue=<NamedPicker 
                                iconProps={{name:"search", circular:true}} 
                                values={values} 
                                onSelect={(value:Named)=>this.onPropDefaultValueChange(prop, value.name)}/>
            }
        }
        return (
            <Label size="small">
                <Button size="mini" icon="arrow circle up" onClick={() => this.onMoveUp(idx)} />
                <Button size="mini" icon="arrow circle down" onClick={() => this.onMoveDown(idx)} />
                {prop.name}&nbsp;:&nbsp;
                <Dropdown
                    floating options={options} value={prop.type}
                    onChange={(e, d) => this.onPropTypeChange(prop, d.value as number)} />
                <Dropdown
                    floating options={[{ text: "req", value: 1 }, { text: "opt", value: 0 }]}
                    value={prop.isRequired ? 1 : 0}
                    onChange={(e, d) => this.onPropReqChange(prop, !!(d.value as number))} />
                {defaultValue}
                <Icon size="mini" name="delete" color="red" inverted bordered onClick={() => this.props.handler.onDeleteProp(prop)} />
            </Label>
        )
    }

    onAddProp(pclass: PropertyClass) {
        let name = this.state.newProp[pclass].name
        let type = this.state.newProp[pclass].type
        let isReq = this.state.newProp[pclass].req
        let stateProp = [...this.state.newProp]
        stateProp[pclass].name = ''
        stateProp[pclass].type = -1
        stateProp[pclass].req = undefined
        this.setState({ newProp: stateProp })
        let newProp = new PropertyDecl(pclass, name, type, isReq);
        this.props.handler.onAddProp(newProp)
    }

    onUpdateNewName(idx: number, newName: string) {
        let stateProp = [...this.state.newProp]
        stateProp[idx].name = newName
        this.setState({ newProp: stateProp })
    }

    onUpdateNewType(idx: number, newType: number) {
        let stateProp = [...this.state.newProp]
        stateProp[idx].type = newType
        this.setState({ newProp: stateProp })
    }

    onUpdateNewReq(idx: number, newReq: number) {
        let stateProp = [...this.state.newProp]
        stateProp[idx].req = !!newReq
        this.setState({ newProp: stateProp })
    }

    render() {
        let itemCols: Array<JSX.Element> = [];
        let resCols: Array<JSX.Element> = [];
        let craftCols: Array<JSX.Element> = [];
        let rowsArr = [itemCols, resCols, craftCols]

        let idx = 0;
        for (let prop of this.props.model.properties) {
            rowsArr[prop.pclass].push(<Grid.Column key={`${prop.pclass}x${idx}`}>{this.propToComp(idx, prop)}</Grid.Column>)
            ++idx
        }

        for (let i of [PropertyClass.item, PropertyClass.resource, PropertyClass.crafter]) {
            let reqValue: { [key: string]: number } = {}
            if (typeof this.state.newProp[i].req === "boolean") {
                reqValue["value"] = this.state.newProp[i].req ? 1 : 0
            }
            let typeValue: { [key: string]: number } = {}
            if (this.state.newProp[i].type != -1) {
                typeValue["value"] = this.state.newProp[i].type
            }
            rowsArr[i].push(
                <Grid.Column key={`f${i}`}>
                    <Input size="mini" onChange={e => this.onUpdateNewName(i, e.currentTarget.value)} value={this.state.newProp[i].name} placeholder="New property" action>
                        <input />
                        <Select
                            onChange={(e, d) => this.onUpdateNewType(i, d.value as number)}
                            options={makePropertyTypeOptions()}
                            {...typeValue}
                            placeholder="Select type" />
                        <Select
                            onChange={(e, d) => this.onUpdateNewReq(i, d.value as number)}
                            options={[{ text: "req", value: 1 }, { "text": "opt", value: 0 }]}
                            {...reqValue}
                            placeholder="Required or optional"
                        />
                        <Button
                            icon="add"
                            onClick={() => this.onAddProp(i)}
                            disabled={
                                !this.state.newProp[i].name.length ||
                                this.state.newProp[i].type == -1 ||
                                this.state.newProp[i].req === undefined ||
                                this.props.model.properties.some(val => val.name == this.state.newProp[i].name && val.pclass == i)} />
                    </Input>
                </Grid.Column>)
        }

        let rows = []
        let maxCol = 0;
        for (let a of rowsArr) {
            if (a.length > maxCol) {
                maxCol = a.length
            }
        }
        for (let idx = 0; idx < maxCol; ++idx) {
            let row = []
            let i = 0
            for (let a of rowsArr) {
                if (idx < a.length) {
                    row.push(a[idx])
                }
                else {
                    row.push(<Grid.Column key={`e${i++}x${idx}`}></Grid.Column>)
                }
            }
            rows.push(<Grid.Row key={`r${idx}`}>{row}</Grid.Row>)
        }

        return (
            <Grid centered columns={3}>
                <Grid.Row key="h">
                    <Grid.Column key="h1">Items</Grid.Column>
                    <Grid.Column key="h2">Resources</Grid.Column>
                    <Grid.Column key="h3">Crafters</Grid.Column>
                </Grid.Row>
                {
                    rows
                }
            </Grid>
        )
    }
}