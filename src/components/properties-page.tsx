import * as React from "react";
import * as ReactDOM from "react-dom";
import { PropertyDecl, PropertyClass, PropertyType } from "../model/property";
import Grid from "semantic-ui-react/dist/commonjs/collections/Grid/Grid";
import Dropdown from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";
import Label from "semantic-ui-react/dist/commonjs/elements/Label/Label";
import Input from "semantic-ui-react/dist/commonjs/elements/Input/Input";
import Button from "semantic-ui-react/dist/commonjs/elements/Button/Button";
import Select from "semantic-ui-react/dist/commonjs/addons/Select/Select";

interface PropertiesPageProps{
    declarations : Array<PropertyDecl>
    onAddProp:(newProp:PropertyDecl)=>void
    onUpdateProp:(updatedProp:PropertyDecl)=>void
}

interface PropertiesPageState{
    itemPropNewName:string
    itemPropType:PropertyType
    resPropNewName:string
    resPropType:PropertyType
    craftPropNewName:string
    craftPropType:PropertyType
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
        this.state = {
            itemPropNewName :'',
            itemPropType:-1,
            resPropNewName : '',
            resPropType : -1,
            craftPropNewName : '',
            craftPropType : -1
        }
    }
    onPropTypeChange(prop:PropertyDecl, newType:PropertyType) {
        let updatedProp = new PropertyDecl(prop.pclass, prop.name, newType);
        this.props.onUpdateProp(updatedProp)
    }

    propToComp(prop:PropertyDecl) {
        let options = makePropertyTypeOptions()
        return (
                <Label>
                    {prop.name}&nbsp;:&nbsp;
                    <Dropdown 
                        floating options={options} value={prop.type} 
                        onChange={(e,d)=>this.onPropTypeChange(prop, d.value as number)}/>
                    <Button size="mini" icon="delete" color="red"/>
                </Label>
            )
    }

    onAddProp(pclass:PropertyClass) {
        let name : string;
        let type : PropertyType
        if(pclass == PropertyClass.item) {
            name = this.state.itemPropNewName
            type = this.state.itemPropType
            this.setState({itemPropNewName:'', itemPropType:-1})
        }
        else if(pclass == PropertyClass.resource) {
            name = this.state.resPropNewName
            type = this.state.resPropType
            this.setState({resPropNewName:'', resPropType:-1})
        } if(pclass == PropertyClass.crafter) {
            name = this.state.craftPropNewName
            type = this.state.craftPropType
            this.setState({craftPropNewName:'', craftPropType:-1})
        }
        let newProp = new PropertyDecl(pclass, name, type);
        this.props.onAddProp(newProp)
    }

    render()
    {
        let itemProps = this.props.declarations.filter(item => item.pclass == PropertyClass.item)
        let resProps = this.props.declarations.filter(item => item.pclass == PropertyClass.resource)
        let craftProps = this.props.declarations.filter(item => item.pclass == PropertyClass.crafter)

        let rows=[]
        for (let idx = 0; idx < itemProps.length || idx < resProps.length || idx < craftProps.length; ++idx) {
            let row = []
            if (idx < itemProps.length) {
                row.push(<Grid.Column>{this.propToComp(itemProps[idx])}</Grid.Column>)
            }
            else {
                row.push(<Grid.Column></Grid.Column>)
            }
            if (idx < resProps.length) {
                row.push(<Grid.Column>{this.propToComp(resProps[idx])}</Grid.Column>)
            }
            else {
                row.push(<Grid.Column></Grid.Column>)
            }
            if (idx < craftProps.length) {
                row.push(<Grid.Column>{this.propToComp(craftProps[idx])}</Grid.Column>)
            }
            else {
                row.push(<Grid.Column></Grid.Column>)
            }
            rows.push(row)
        }

        return (
            <Grid centered columns={3}>
                <Grid.Row>
                    <Grid.Column>Items</Grid.Column>
                    <Grid.Column>Resources</Grid.Column>
                    <Grid.Column>Crafters</Grid.Column>
                </Grid.Row>
                {
                    rows
                }
                <Grid.Row>
                    <Grid.Column>
                        <Input onChange={e=>this.setState({itemPropNewName:e.currentTarget.value})} placeholder="New property" action>
                            <input/>
                            <Select onChange={(e,d)=>this.setState({itemPropType:d.value as number})} options={makePropertyTypeOptions()} placeholder="Select type"/>
                            <Button icon="add" onClick={()=>this.onAddProp(PropertyClass.item)}/>
                        </Input>
                    </Grid.Column>
                    <Grid.Column>
                        <Input onChange={e=>this.setState({resPropNewName:e.currentTarget.value})} placeholder="New property" action>
                            <input/>
                            <Select onChange={(e,d)=>this.setState({resPropType:d.value as number})} options={makePropertyTypeOptions()} placeholder="Select type"/>
                            <Button icon="add" onClick={()=>this.onAddProp(PropertyClass.resource)}/>
                        </Input>
                    </Grid.Column>
                    <Grid.Column>
                        <Input onChange={e=>this.setState({craftPropNewName:e.currentTarget.value})} placeholder="New property" action>
                            <input/>
                            <Select onChange={(e,d)=>this.setState({craftPropType:d.value as number})} options={makePropertyTypeOptions()} placeholder="Select type"/>
                            <Button icon="add" onClick={()=>this.onAddProp(PropertyClass.crafter)}/>
                        </Input>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}