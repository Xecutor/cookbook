import * as React from "react";
import * as ReactDOM from "react-dom";
import { Entity, entityDefaultFilter } from "../model/entity";
import { PropertyDecl, PropertyType, PropertiesCollection } from "../model/property";
import { FilteredList } from "./filtered-list";
import Form from "semantic-ui-react/dist/commonjs/collections/Form/Form";
import Grid from "semantic-ui-react/dist/commonjs/collections/Grid/Grid";
import { Tags, Tag } from "../model/tags";
import { TagEditorPopup } from "./tag-editor";
import Label from "semantic-ui-react/dist/commonjs/elements/Label/Label";
import { FormButtonProps } from "semantic-ui-react/dist/commonjs/collections/Form/FormButton";

export interface EntityHandler{
    onAddEntity:(name:string, props:PropertiesCollection, tags:Tags, extra:any)=>void
    onUpdateEntity:(name:string, props:PropertiesCollection, tags:Tags, extra:any)=>void
    onDeleteEntity:(name:string)=>void
}

interface EntityEditorProps<T extends Entity>{
    tags:Tag[]
    entities: Array<T>
    props: Array<PropertyDecl>
    entityHandler:EntityHandler
}

interface EntityEditorState{
    name:string
    props:PropertiesCollection
    tags:Tags
    update:boolean
    cancel:boolean
    extra:any
}

export class EntityEditor<T extends Entity> extends React.Component<EntityEditorProps<T>, EntityEditorState> {
    constructor(prop:EntityEditorProps<T>) {
        super(prop)
        this.state = this.makeDefaultState()
    }

    makeDefaultState()
    {
        let state : EntityEditorState = {
            name:'',
            update:false,
            cancel:false,
            props:new PropertiesCollection(),
            tags:new Tags,
            extra:undefined
        }
        for(let prop of this.props.props) {
            if(prop.defaultValue !== undefined) {
                state.props.add(prop.name, prop.defaultValue)
            }
        }
        return state;
    }

    onSubmitForm() {
        console.log(`name=${this.state.name}`)
        for (let p of this.state.props.array) {
            console.log(`${p.name} = ${p.value}`)
        }
        if (!this.state.cancel) {
            if (this.state.update) {
                this.props.entityHandler.onUpdateEntity(this.state.name, this.state.props, this.state.tags, this.state.extra);
            } else {
                this.props.entityHandler.onAddEntity(this.state.name, this.state.props, this.state.tags, this.state.extra);
            }
        }
        this.setState(this.makeDefaultState())
    }

    onFormFieldUpdate(propDecl:PropertyDecl, value:string|number|boolean) {
        let name = propDecl.name;
        // if(propDecl.type==PropertyType.number) {
        //     let oldVal = value;
        //     value = value.toString().replace(/[^\d.+-]/, '')
        //     try{
        //         value = parseFloat(value)
        //     }catch(e) {
        //     }
        //     console.log(`oldval=${oldVal}, fixed val:${value}`)
        // }

        let updatedProps = this.state.props.clone()
        let prop = updatedProps.findByName(name)
        if(prop) {
            console.log(`upddate prop ${name}`)
            prop.value = value;
        }
        else {
            console.log(`add prop ${name}`)
            updatedProps.add(name, value)
        }
        this.setState({props:updatedProps})
    }

    onFormNameUpdate(newValue:string) {
        this.setState({name:newValue})
    }

    onAddTag(tag:Tag)
    {
        console.log("on add tag",tag)
        this.state.tags.add(tag)
        if (this.state.tags.modified) {
            let newTags = this.state.tags.cloneObject()
            newTags.ack()
            this.setState({ tags: newTags })
        }
    }

    onDeleteEntity(entity:Entity)
    {
        console.log("delete", entity.name)
        this.props.entityHandler.onDeleteEntity(entity.name)
    }

    onSelectEntity(entity:Entity)
    {
        this.setState({
            name:entity.name,
            props:entity.properties.clone(),
            tags:entity.tags.cloneObject(),
            update:true
        })
    }

    makePropControl(prop:PropertyDecl)
    {
        let propVal = this.state.props.findByName(prop.name)
        if (prop.type == PropertyType.boolean) {
            let cbValue: { [key: string]: boolean } = {}
            if (propVal) {
                cbValue["checked"] = !!propVal.value
            }
            else {
                cbValue["indeterminate"] = true
                if(prop.isRequired) {
                    cbValue["error"] = true
                }
            }
            return <Form.Checkbox key={prop.name} {...cbValue} label={prop.name} onChange={(e, { checked }) => this.onFormFieldUpdate(prop, checked)} />;
        }
        else if (prop.type == PropertyType.string || prop.type == PropertyType.number) {
            let inValue: { [key: string]: string | boolean } = {}
            if (propVal) {
                inValue["value"] = typeof (propVal.value) === "string" ? propVal.value as string : propVal.value.toString()
                if(prop.type == PropertyType.number) {
                    try{
                        if(isNaN(parseFloat(propVal.value as string))) {
                            console.log("parse error?")
                            inValue["error"] = true
                        }
                    }catch(e) {
                        console.log("parse error?")
                        inValue["error"] = true
                    }
                }
            }
            else {
                inValue["value"] = ""
                if(prop.isRequired) {
                    inValue["error"] = true
                }
            }
            return <Form.Input key={prop.name} {...inValue} label={prop.name} onChange={(e, { value }) => this.onFormFieldUpdate(prop, value)} />
        }
        else if (prop.type == PropertyType.text) {
            let inValue: { [key: string]: string | boolean } = {}
            if (propVal) {
                inValue["value"] = propVal.value as string
            }
            else {
                inValue["value"] = ""
                if(prop.isRequired) {
                    inValue["error"] = true
                }
            }
            return <Form.TextArea key={prop.name} {...inValue} label={prop.name} onChange={(e, { value }) => this.onFormFieldUpdate(prop, value)} />
        }
        return <Form.Field key={prop.name} label={prop.name}><Label>TODO</Label></Form.Field>
    }

    validateName() {
        return this.state.update || (this.state.name.length != 0 && !this.props.entities.find(e => e.name == this.state.name))
    }

    validateProps() {
        for(let prop of this.props.props) {
            if(prop.isRequired) {
                if(!this.state.props.findByName(prop.name)) {
                    console.log(`prop validation failed, required prop ${prop.name} not defined`)
                    return false
                }
            }
        }
        return true
    }

    render() {
        let itemForm=[]
        let nameOpts :{[key:string]:boolean}= {}
        if (this.state.update) {
            nameOpts["disabled"] = true
        }
        else {
            if(!this.state.name.length) {
                nameOpts["error"] = this.validateName()
            }
        }
        itemForm.push(<Form.Input 
                        key="item-name"
                        label="Name" 
                        placeholder="Name"
                        value={this.state.name}
                        {...nameOpts}
                        onChange={(e,{value})=>this.onFormNameUpdate(value)}>
                      </Form.Input>)
        for(let prop of this.props.props) {
            itemForm.push(this.makePropControl(prop))
        }
        let tags=[]
        for(let tag of this.state.tags.tags.array) {
            tags.push(<Label key={tag}>{tag}</Label>)
        }
        tags.push(<TagEditorPopup key="tageditor" tags={this.props.tags} onAddTag={(tag)=>this.onAddTag(tag)}/>)
        itemForm.push(<Form.Field key="item-tags">{tags}</Form.Field>)
        if(this.state.update) {
            itemForm.push(
                <Form.Group key="item-update-buttons">
                    <Form.Button>Update</Form.Button>
                    <Form.Button onClick={()=>this.setState({cancel:true})}>Cancel</Form.Button>
                </Form.Group>)
        }
        else {
            let disableAdd : FormButtonProps = {};
            if (!this.validateName() || !this.validateProps()) {
                disableAdd["disabled"] = true
            }
            itemForm.push(<Form.Button key="item-add-button" {...disableAdd}>Add</Form.Button>)
        }
        return (
            <div>
                <Grid centered columns={3}>
                    <Grid.Row key="form" centered>
                        <Grid.Column key="pad1"/>
                        <Grid.Column key="middle">
                            <Form size="tiny" onSubmit={()=>this.onSubmitForm()}>
                                {itemForm}
                            </Form>
                        </Grid.Column>
                        <Grid.Column key="pad2"/>
                    </Grid.Row>
                </Grid>
                <FilteredList
                    list={this.props.entities}
                    filter={(e:Entity,str:string)=>entityDefaultFilter(e,str)}
                    renderItem={(val:Entity)=>val.name}
                    isButton={true}
                    haveDelete={true}
                    columns={4}
                    onSelect={ent=>this.onSelectEntity(ent as Entity)}
                    onDelete={ent=>this.onDeleteEntity(ent as Entity)}
                />
            </div>
        )
    }
}