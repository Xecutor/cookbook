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

interface PropertiesPageProps{
    declarations : Array<PropertyDecl>
    onAddProp:(newProp:PropertyDecl)=>void
    onUpdateProp:(updatedProp:PropertyDecl)=>void
    onDeleteProp:(deletedProp:PropertyDecl)=>void
}

interface NewPropInfo{
    name:string
    type:number
    req:boolean
}

interface PropertiesPageState{
    newProp:Array<NewPropInfo>
}

function makePropertyTypeOptions()
{
    let options = []
    for(let t in PropertyType) {
        let v = PropertyType[t]
        if(typeof v === "number") {
            options.push({
                text:t,
                value:v,
            })
        }
    }
    return options;
}

export class PropertiesPage extends React.Component<PropertiesPageProps, PropertiesPageState> {
    constructor(prop:PropertiesPageProps) {
        super(prop)
        let newProp = []
        for(let i=0;i<3;++i) {
            newProp.push({
                name:'',
                type:-1,
                req:undefined
            })
        }
        this.state = {
            newProp:newProp
        }
    }
    onPropTypeChange(prop:PropertyDecl, newType:PropertyType) {
        let updatedProp = new PropertyDecl(prop.pclass, prop.name, newType, prop.isRequired);
        this.props.onUpdateProp(updatedProp)
    }

    onPropReqChange(prop:PropertyDecl, newReq:boolean) {
        let updatedProp = new PropertyDecl(prop.pclass, prop.name, prop.type, newReq)
        this.props.onUpdateProp(updatedProp)
    }

    onPropDefaultValueChange(prop:PropertyDecl, defValue:any)
    {
        let updatedProp = new PropertyDecl(prop.pclass, prop.name, prop.type, prop.isRequired)
        updatedProp.defaultValue = defValue;
        this.props.onUpdateProp(updatedProp)
    }

    propToComp(prop:PropertyDecl) {
        let options = makePropertyTypeOptions()
        let defaultValue;
        if (prop.type == PropertyType.boolean) {
            let checked = {}
            if (prop.defaultValue) {
                checked = { checked: true }
            }
            defaultValue = <Checkbox fitted {...checked} onChange={(e, { checked }) => this.onPropDefaultValueChange(prop, checked)} />
        }
        else if (prop.type == PropertyType.string) {
            let val = prop.defaultValue || "";
            defaultValue = <Input value={val} onChange={(e, { value }) => this.onPropDefaultValueChange(prop, value)} />
        }
        return (
                <Label>
                    {prop.name}&nbsp;:&nbsp;
                    <Dropdown
                        floating options={options} value={prop.type} 
                        onChange={(e,d)=>this.onPropTypeChange(prop, d.value as number)}/>
                    <Dropdown
                        floating options={[{text:"req", value:1}, {text:"opt", value:0}]}
                        value={prop.isRequired?1:0}
                        onChange={(e,d)=>this.onPropReqChange(prop, !!(d.value as number))}/>
                    {defaultValue}
                    <Button size="mini" icon="delete" color="red" onClick={()=>this.props.onDeleteProp(prop)}/>
                </Label>
            )
    }

    onAddProp(pclass:PropertyClass) {
        let name = this.state.newProp[pclass].name
        let type = this.state.newProp[pclass].type
        let isReq = this.state.newProp[pclass].req
        let stateProp = [...this.state.newProp]
        stateProp[pclass].name=''
        stateProp[pclass].type = -1
        stateProp[pclass].req = undefined
        this.setState({newProp:stateProp})
        let newProp = new PropertyDecl(pclass, name, type, isReq);
        this.props.onAddProp(newProp)
    }

    onUpdateNewName(idx:number, newName:string) {
        let stateProp = [...this.state.newProp]
        stateProp[idx].name = newName
        this.setState({newProp:stateProp})
    }

    onUpdateNewType(idx:number, newType:number) {
        let stateProp = [...this.state.newProp]
        stateProp[idx].type = newType
        this.setState({newProp:stateProp})
    }

    onUpdateNewReq(idx:number, newReq:number) {
        let stateProp = [...this.state.newProp]
        stateProp[idx].req = !!newReq
        this.setState({newProp:stateProp})
    }

    render() {
        let itemCols : Array<JSX.Element> = [];
        let resCols : Array<JSX.Element> = [];
        let craftCols : Array<JSX.Element> = [];
        let rowsArr=[itemCols, resCols, craftCols]

        let idx = 0;
        for(let prop of this.props.declarations) {
            rowsArr[prop.pclass].push(<Grid.Column key={`${prop.pclass}x${idx++}`}>{this.propToComp(prop)}</Grid.Column>)
        }

        for (let i of [PropertyClass.item, PropertyClass.resource, PropertyClass.crafter]) {
            let reqValue : {[key:string]:number} = {}
            if(typeof this.state.newProp[i].req === "boolean") {
                reqValue["value"] = this.state.newProp[i].req ? 1 : 0
            }
            let typeValue : {[key:string]:number} = {}
            if (this.state.newProp[i].type != -1) {
                typeValue["value"] = this.state.newProp[i].type
            }
            rowsArr[i].push(
                <Grid.Column key={`f${i}`}>
                    <Input onChange={e => this.onUpdateNewName(i, e.currentTarget.value)} value={this.state.newProp[i].name} placeholder="New property" action>
                        <input />
                        <Select
                            onChange={(e, d) => this.onUpdateNewType(i, d.value as number)}
                            options={makePropertyTypeOptions()}
                            {...typeValue}
                            placeholder="Select type" />
                        <Select
                            onChange={(e, d) => this.onUpdateNewReq(i, d.value as number)}
                            options={[{text:"req",value:1}, {"text":"opt",value:0}]}
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
                                this.props.declarations.some(val => val.name == this.state.newProp[i].name && val.pclass == i)} />
                    </Input>
                </Grid.Column>)
        }

        let rows=[]
        let maxCol = 0;
        for (let a of rowsArr) {
            if (a.length > maxCol) {
                maxCol = a.length
            }
        }
        for (let idx = 0; idx < maxCol; ++idx) {
            let row = []
            let i=0
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