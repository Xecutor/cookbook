import * as React from "react";
import * as ReactDOM from "react-dom";
import { Recipe } from "../model/recipe";
import { Tags, Tag } from "../model/tags";
import Grid from "semantic-ui-react/dist/commonjs/collections/Grid/Grid";
import { FilteredList } from "./filtered-list";
import { nameAndTagsDefaultFilter } from "../model/entity";
import Form from "semantic-ui-react/dist/commonjs/collections/Form/Form";
import { TagEditor } from "./tag-editor";

export interface RecipeHandler {
    onAddRecipe(newRecipe: Recipe): void
    onUpdateRecipe(updatedRecipe: Recipe): void
    onDeleteRecipe(toDelete: Recipe): void
}

interface RecipePageProps {
    tags:Array<Tag>
    recipes: Array<Recipe>
    handler: RecipeHandler
}

enum FormState {
    new,
    update,
    cancel
}

interface RecipePageState {
    name: string
    maxLevel: number
    tags: Tags
    formState: FormState
}

export class RecipePage extends React.Component<RecipePageProps, RecipePageState> {
    constructor(props: RecipePageProps) {
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
    selectRecipe(cm: Recipe) {
        this.setState({
            name: cm.name,
            maxLevel: cm.level,
            tags: cm.tags,
            formState: FormState.update
        })
    }
    deleteRecipe(cm: Recipe) {
        this.props.handler.onDeleteRecipe(cm)
    }
    onSubmitForm() {
        if (this.state.formState == FormState.new) {
            console.log(`add ${this.state.name}:${this.state.maxLevel}`)
            this.props.handler.onAddRecipe(new Recipe(this.state.name, this.state.maxLevel, this.state.tags))
        }
        else {
            this.props.handler.onUpdateRecipe(new Recipe(this.state.name, this.state.maxLevel, this.state.tags))
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
        cmForm.push(<Form.Input label="Name" value={this.state.name} onChange={(e, { value }) => this.onNameChanged(value)} />)
        cmForm.push(<Form.Input label="Max level" value={this.state.maxLevel} onChange={(e, { value }) => this.onMaxLevelChanged(value)} />)
        cmForm.push(
            <Form.Field>
                <TagEditor tags={this.state.tags} allTags={this.props.tags} onAddTag={tag=>this.onAddTag(tag)} onRemoveTag={tag=>this.onRemoveTag(tag)}/>
            </Form.Field>)
        if (this.state.formState == FormState.new) {
            cmForm.push(<Form.Button>Add</Form.Button>)
        }
        else {
            cmForm.push(<Form.Group>
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
                    list={this.props.recipe}
                    filter={nameAndTagsDefaultFilter}
                    renderItem={(cm: Recipe) => cm.name}
                    columns={4}
                    isButton={true}
                    haveDelete={true}
                    onSelect={(cm: Recipe) => this.selectRecipe(cm)}
                    onDelete={(cm: Recipe) => this.deleteRecipe(cm)}
                />
            </div>
        )
    }
}