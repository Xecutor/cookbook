import * as React from "react";
import * as ReactDOM from "react-dom";
import { Entity } from "../model/entity";
import { PropertyDecl, PropertyType, PropertiesCollection } from "../model/property";
import { FilteredList } from "./filtered-list";
import Form from "semantic-ui-react/dist/commonjs/collections/Form/Form";
import Grid from "semantic-ui-react/dist/commonjs/collections/Grid/Grid";

interface EntityEditorProps<T extends Entity>{
    entities: Array<T>
    props: Array<PropertyDecl>
    onAddEntity:(newEntity:T)=>void
    onUpdateEntity:(updateEntity:T)=>void
    onDeleteEntity:(enitityToDel:T)=>void
}

interface EntityEditorState{
    name:string
    props:PropertiesCollection
}

export class EntityEditor<T extends Entity> extends React.Component<EntityEditorProps<T>, EntityEditorState> {
    constructor(prop:EntityEditorProps<T>) {
        super(prop)
        this.state = {
            name:'',
            props:new PropertiesCollection()
        }
    }
    onSubmitForm() {
        for(let p of this.state.props.array) {
            console.log(`${p.name} = ${p.value}`)
        }
    }

    onFormFieldUpdate(name:string, value:string|number|boolean) {
        let updatedProps = this.state.props.clone()
        let prop = updatedProps.findByName(name)
        if(prop) {
            prop.value = value;
        }
        else {
            updatedProps.add(name, value)
        }
        this.setState({props:updatedProps})
    }

    onFormNameUpdate(newValue:string) {
        this.setState({name:newValue})
    }

    render() {
        let itemForm=[]
        itemForm.push(<Form.Input label="Name" placeholder="Name" onChange={(e,{value})=>this.onFormNameUpdate(value)}></Form.Input>)
        for(let prop of this.props.props) {
            let propVal = this.state.props.findByName(prop.name)
            if(prop.type==PropertyType.boolean) {
                let cbValue : {[key:string] : boolean} = {}
                if(propVal && propVal.value) {
                    cbValue["checked"] = true
                }
                itemForm.push(<Form.Checkbox {...cbValue} label={prop.name} onChange={(e,{checked})=>this.onFormFieldUpdate(prop.name, checked)}/>)
            }
            else if(prop.type==PropertyType.string) {
                let inValue : {[key:string] : string} = {}
                if(propVal) {
                    inValue["value"] = propVal.value as string
                }
                itemForm.push(<Form.Input {...inValue} label={prop.name} onChange={(e,{value})=>this.onFormFieldUpdate(prop.name, value)}/>)
            }
        }
        itemForm.push(<Form.Button>Add</Form.Button>)
        return (
            <div>
                <Grid centered columns={3}>
                    <Grid.Row centered>
                        <Grid.Column/>
                        <Grid.Column>
                            <Form size="tiny" onSubmit={()=>this.onSubmitForm()}>
                                {itemForm}
                            </Form>
                        </Grid.Column>
                        <Grid.Column/>
                    </Grid.Row>
                </Grid>
                <FilteredList
                    list={this.props.entities}
                    filter={(e:Entity,str:string)=>e.name.indexOf(str)>=0}
                    renderItem={(val:Entity)=>val.name}
                    isButton={true}
                    haveDelete={true}
                    columns={4}
                />
            </div>
        )
    }
}