import * as React from "react";
import * as ReactDOM from "react-dom";
import { CraftingMethod } from "../model/crafting-method";
import { Tags, Tag } from "../model/tags";
import Grid from "semantic-ui-react/dist/commonjs/collections/Grid/Grid";
import { FilteredList } from "./filtered-list";
import { nameAndTagsDefaultFilter } from "../model/entity";
import Form from "semantic-ui-react/dist/commonjs/collections/Form/Form";
import { TagEditor } from "./tag-editor";

export interface CraftingMethodsHandler {
    onAddCraftingMethod(newCraftingMethod: CraftingMethod): void
    onUpdateCraftingMethod(updatedCraftingMethod: CraftingMethod): void
    onDeleteCraftingMethod(toDelete: CraftingMethod): void
}

interface CraftingMethodsPageProps {
    tags:Array<Tag>
    craftingMethods: Array<CraftingMethod>
    handler: CraftingMethodsHandler
}

enum FormState {
    new,
    update,
    cancel
}

interface CraftingMethodsPageState {
    name: string
    maxLevel: number
    tags: Tags
    formState: FormState
}

export class CraftingMethodsPage extends React.Component<CraftingMethodsPageProps, CraftingMethodsPageState> {
    constructor(props: CraftingMethodsPageProps) {
        super(props)

        this.state = this.makeClearState()
    }
    makeClearState() {
        return {
            name: '',
            maxLevel: 1,
            formState: FormState.new,
            tags: new Tags
        }
    }
    selectCraftingMethod(cm: CraftingMethod) {
        this.setState({
            name: cm.name,
            maxLevel: cm.level,
            tags: cm.tags,
            formState: FormState.update
        })
    }
    deleteCraftingMethod(cm: CraftingMethod) {
        this.props.handler.onDeleteCraftingMethod(cm)
    }
    onSubmitForm() {
        if (this.state.formState == FormState.new) {
            console.log(`add ${this.state.name}:${this.state.maxLevel}`)
            this.props.handler.onAddCraftingMethod(new CraftingMethod(this.state.name, this.state.maxLevel, this.state.tags))
        }
        else {
            this.props.handler.onUpdateCraftingMethod(new CraftingMethod(this.state.name, this.state.maxLevel, this.state.tags))
        }
        this.setState(this.makeClearState())
    }
    onNameChanged(newName: string) {
        this.setState({ name: newName })
    }
    onMaxLevelChanged(newMaxLevel: string) {
        let maxLevelInt = parseInt(newMaxLevel)
        this.setState({ maxLevel: maxLevelInt })
    }
    onAddTag(tag:Tag) {
        let updatedTags = this.state.tags.cloneObject()
        updatedTags.add(tag)
        this.setState({tags:updatedTags})
    }
    onRemoveTag(tag:Tag) {
        let updatedTags = this.state.tags.cloneObject()
        updatedTags.remove(tag)
        this.setState({tags:updatedTags})
    }
    render() {
        let cmForm = []
        cmForm.push(<Form.Input key="name" label="Name" value={this.state.name} onChange={(e, { value }) => this.onNameChanged(value)} />)
        cmForm.push(<Form.Input key="max-level" label="Max level" value={this.state.maxLevel} onChange={(e, { value }) => this.onMaxLevelChanged(value)} />)
        cmForm.push(<Form.Field key="tags-label" label="Tags"/>)
        cmForm.push(
            <Form.Field key="tags">
                <TagEditor tags={this.state.tags} allTags={this.props.tags} onAddTag={tag=>this.onAddTag(tag)} onRemoveTag={tag=>this.onRemoveTag(tag)}/>
            </Form.Field>)
        if (this.state.formState == FormState.new) {
            cmForm.push(<Form.Button key="add-button">Add</Form.Button>)
        }
        else {
            cmForm.push(<Form.Group key="update-cancel-buttons">
                <Form.Button>Update</Form.Button>
                <Form.Button onClick={() => this.setState(this.makeClearState())}>Cancel</Form.Button>
            </Form.Group>)
        }
        return (
            <div>
                <Grid centered columns={3}>
                    <Grid.Row key="form" centered>
                        <Grid.Column key="pad1" />
                        <Grid.Column key="middle">
                            <Form size="tiny" onSubmit={() => this.onSubmitForm()}>
                                {cmForm}
                            </Form>
                        </Grid.Column>
                        <Grid.Column key="pad2" />
                    </Grid.Row>
                </Grid>
                <FilteredList
                    key="f-list"
                    list={this.props.craftingMethods}
                    filter={nameAndTagsDefaultFilter}
                    renderItem={(cm: CraftingMethod) => cm.name}
                    columns={4}
                    isButton={true}
                    haveDelete={true}
                    onSelect={(cm: CraftingMethod) => this.selectCraftingMethod(cm)}
                    onDelete={(cm: CraftingMethod) => this.deleteCraftingMethod(cm)}
                />
            </div>
        )
    }
}