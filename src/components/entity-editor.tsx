import * as React from "react";
import * as ReactDOM from "react-dom";
import { Entity, nameAndTagsDefaultFilter } from "../model/entity";
import { PropertyDecl, PropertyType, PropertiesCollection } from "../model/property";
import { FilteredList } from "./filtered-list";
import Form from "semantic-ui-react/dist/commonjs/collections/Form/Form";
import Grid from "semantic-ui-react/dist/commonjs/collections/Grid/Grid";
import { Tags, Tag } from "../model/tags";
import { TagEditor } from "./tag-editor";
import Label from "semantic-ui-react/dist/commonjs/elements/Label/Label";
import { FormButtonProps } from "semantic-ui-react/dist/commonjs/collections/Form/FormButton";
import { Item } from "../model/item";
import { NamedPicker } from "./named-picker";
import { ModelState } from "../model/model";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon/Icon";
import { Resource } from "../model/resource";
import Dropdown from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";

export interface EntityHandler {
    onSelectEntity?: (ent:Entity)=>void
    onAddEntity: (name: string, props: PropertiesCollection, tags: Tags, extra: any) => void
    onUpdateEntity: (name: string, props: PropertiesCollection, tags: Tags, extra: any) => void
    onDeleteEntity: (name: string) => void
}

interface EntityEditorProps<T extends Entity> {
    model:ModelState
    entities: Array<T>
    props: Array<PropertyDecl>
    entityHandler: EntityHandler
    extraForm?:JSX.Element
}

interface EntityEditorState {
    name: string
    props: PropertiesCollection
    tags: Tags
    update: boolean
    cancel: boolean
    extra: any
}

export class EntityEditor<T extends Entity> extends React.Component<EntityEditorProps<T>, EntityEditorState> {
    constructor(prop: EntityEditorProps<T>) {
        super(prop)
        this.state = this.makeDefaultState()
    }

    makeDefaultState() {
        let state: EntityEditorState = {
            name: '',
            update: false,
            cancel: false,
            props: new PropertiesCollection(),
            tags: new Tags,
            extra: undefined
        }
        for (let prop of this.props.props) {
            if (prop.defaultValue !== undefined) {
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

    onFormFieldUpdate(propDecl: PropertyDecl, value: string | number | boolean | {name:string, level:number}) {
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
        if (prop) {
            console.log(`upddate prop ${name}`)
            prop.value = value;
        }
        else {
            console.log(`add prop ${name}`)
            updatedProps.add(name, value)
        }
        this.setState({ props: updatedProps })
    }

    onFormNameUpdate(newValue: string) {
        this.setState({ name: newValue })
    }

    onAddTag(tag: Tag) {
        console.log("on add tag", tag)
        this.state.tags.add(tag)
        if (this.state.tags.modified) {
            let newTags = this.state.tags.cloneObject()
            newTags.ack()
            this.setState({ tags: newTags })
        }
    }

    onRemoveTag(tag: Tag) {
        this.state.tags.remove(tag)
        if (this.state.tags.modified) {
            let newTags = this.state.tags.cloneObject()
            newTags.ack()
            this.setState({ tags: newTags })
        }
    }

    onDeleteEntity(entity: Entity) {
        console.log("delete", entity.name)
        this.props.entityHandler.onDeleteEntity(entity.name)
    }

    onSelectEntity(entity: Entity) {
        if (this.props.entityHandler.onSelectEntity) {
            this.props.entityHandler.onSelectEntity(entity)
        }
        this.setState({
            name: entity.name,
            props: entity.properties.clone(),
            tags: entity.tags.cloneObject(),
            update: true
        })
    }

    makePropControl(prop: PropertyDecl) {
        let propVal = this.state.props.findByName(prop.name)
        if (prop.type == PropertyType.boolean) {
            let cbValue: { [key: string]: boolean } = {}
            if (propVal) {
                cbValue["checked"] = !!propVal.value
            }
            else {
                cbValue["indeterminate"] = true
                if (prop.isRequired) {
                    cbValue["error"] = true
                }
            }
            return <Form.Checkbox key={prop.name} {...cbValue} label={prop.name} onChange={(e, { checked }) => this.onFormFieldUpdate(prop, checked)} />;
        }
        else if (prop.type == PropertyType.string || prop.type == PropertyType.number) {
            let inValue: { [key: string]: string | boolean } = {}
            if (propVal) {
                inValue["value"] = typeof (propVal.value) === "string" ? propVal.value as string : propVal.value.toString()
                if (prop.type == PropertyType.number) {
                    try {
                        if (isNaN(parseFloat(propVal.value as string))) {
                            console.log("parse error?")
                            inValue["error"] = true
                        }
                    } catch (e) {
                        console.log("parse error?")
                        inValue["error"] = true
                    }
                }
            }
            else {
                inValue["value"] = ""
                if (prop.isRequired) {
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
                if (prop.isRequired) {
                    inValue["error"] = true
                }
            }
            return <Form.TextArea key={prop.name} {...inValue} label={prop.name} onChange={(e, { value }) => this.onFormFieldUpdate(prop, value)} />
        }
        else if (prop.type == PropertyType.item || prop.type == PropertyType.resource || prop.type == PropertyType.crafter ) {
            if (propVal && propVal.value) {
                return [
                    <Form.Field label={prop.name}/>,
                    <Form.Field><Label>{propVal.value}<Icon name="delete" circular inverted color="red" onClick={()=>this.onFormFieldUpdate(prop, undefined)}/></Label></Form.Field>
                ]
            }
            else {
                let values;
                switch(prop.type) {
                    case PropertyType.item:values = this.props.model.items;break;
                    case PropertyType.resource:values = this.props.model.resources;break;
                    case PropertyType.crafter:values = this.props.model.crafters;break;
                }
                return [
                    <Form.Field key={prop.name} label={prop.name}/>,
                    <NamedPicker
                        key={`${prop.name}-picker`}
                        iconProps={{ name: "search", circular: true }}
                        values={values}
                        onSelect={({name}) => this.onFormFieldUpdate(prop, name)} />
                ]
            }
        }
        else if ( prop.type == PropertyType.craftingMethod ) {
            if (propVal && propVal.value) {
                if(typeof propVal.value==="string") {
                    propVal.value={
                        name:propVal.value,
                        level:1
                    }
                }
                let {name:cmname,level:cmlevel} = (propVal.value as {name:string, level:number})
                let cm = this.props.model.craftingMethods.find(cm=>cm.name==cmname)
                let maxLevel = cm ? cm.level : 1
                let options = []
                for(let i=1;i<=maxLevel;++i) {
                    options.push({text:i.toString(), value:i})
                }
                return [
                    <Form.Field label={prop.name}/>,
                    <Form.Field>
                        <Label>
                            {cmname}&nbsp;
                            <Dropdown options={options} value={cmlevel} onChange={(e, {value})=>this.onFormFieldUpdate(prop, {name:cmname, level:value as number})}/>
                            <Icon name="delete" circular inverted color="red" onClick={()=>this.onFormFieldUpdate(prop, undefined)}/>
                        </Label>
                    </Form.Field>
                ]
            }
            else {
                return [
                    <Form.Field key={prop.name} label={prop.name}/>,
                    <NamedPicker
                        key={`${prop.name}-picker`}
                        iconProps={{ name: "search", circular: true }}
                        values={this.props.model.craftingMethods}
                        onSelect={({name}) => this.onFormFieldUpdate(prop, {name, level:1})} />
                ]
            }
        }
        return <Form.Field key={prop.name} label={prop.name}><Label>TODO</Label></Form.Field>
    }

    validateName() {
        return this.state.update || (this.state.name.length != 0 && !this.props.entities.find(e => e.name == this.state.name))
    }

    validateProps() {
        for (let prop of this.props.props) {
            if (prop.isRequired) {
                if (!this.state.props.findByName(prop.name)) {
                    console.log(`prop validation failed, required prop ${prop.name} not defined`)
                    return false
                }
            }
        }
        return true
    }

    render() {
        let entityForm = []
        let nameOpts: { [key: string]: boolean } = {}
        if (this.state.update) {
            nameOpts["disabled"] = true
        }
        else {
            if (!this.state.name.length) {
                nameOpts["error"] = !this.validateName()
            }
        }
        entityForm.push(<Form.Input
            key="item-name"
            label="Name"
            placeholder="Name"
            value={this.state.name}
            {...nameOpts}
            onChange={(e, { value }) => this.onFormNameUpdate(value)}>
        </Form.Input>)
        for (let prop of this.props.props) {
            entityForm.push(this.makePropControl(prop))
        }
        entityForm.push(
            <Form.Field key="item-tags">
                <TagEditor key="tags-editor" tags={this.state.tags} allTags={this.props.model.tags} onAddTag={(tag)=>this.onAddTag(tag)} onRemoveTag={(tag)=>this.onRemoveTag(tag)}/>
            </Form.Field>)
        if (this.props.extraForm) {
            entityForm.push(<Form.Field>{this.props.extraForm}</Form.Field>)
        }
        if (this.state.update) {
            entityForm.push(
                <Form.Group key="item-update-buttons">
                    <Form.Button>Update</Form.Button>
                    <Form.Button onClick={() => this.setState({ cancel: true })}>Cancel</Form.Button>
                </Form.Group>)
        }
        else {
            let disableAdd: FormButtonProps = {};
            if (!this.validateName() || !this.validateProps()) {
                disableAdd["disabled"] = true
            }
            entityForm.push(<Form.Button key="item-add-button" {...disableAdd}>Add</Form.Button>)
        }
        return (
            <div>
                <Grid centered columns={3}>
                    <Grid.Row key="form" centered>
                        <Grid.Column key="pad1" />
                        <Grid.Column key="middle">
                            <Form size="tiny" onSubmit={() => this.onSubmitForm()}>
                                {entityForm}
                            </Form>
                        </Grid.Column>
                        <Grid.Column key="pad2" />
                    </Grid.Row>
                </Grid>
                <FilteredList
                    list={this.props.entities}
                    filter={(e: Entity, str: string) => nameAndTagsDefaultFilter(e, str)}
                    renderItem={(val: Entity) => val.name}
                    isButton={true}
                    haveDelete={true}
                    columns={4}
                    onSelect={ent => this.onSelectEntity(ent as Entity)}
                    onDelete={ent => this.onDeleteEntity(ent as Entity)}
                />
            </div>
        )
    }
}