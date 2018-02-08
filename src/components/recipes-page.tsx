import * as React from "react";
import * as ReactDOM from "react-dom";
import Grid from "semantic-ui-react/dist/commonjs/collections/Grid/Grid";
import Form from "semantic-ui-react/dist/commonjs/collections/Form/Form";
import Label from "semantic-ui-react/dist/commonjs/elements/Label/Label";
import Input from "semantic-ui-react/dist/commonjs/elements/Input/Input";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon/Icon";
import { Recipe, Ingredient, Output, IngredientType } from "../model/recipe";
import { Tags, Tag } from "../model/tags";
import { FilteredList } from "./filtered-list";
import { nameAndTagsDefaultFilter, Entity } from "../model/entity";
import { TagEditor } from "./tag-editor";
import { CraftingMethod } from "../model/crafting-method";
import { ModelState } from "../model/model";
import { NamedPicker } from "./named-picker";
import { EntityHandler } from "./entity-editor";

export interface RecipeHandler {
    onAddRecipe(newRecipe: Recipe): void
    onUpdateRecipe(updatedRecipe: Recipe): void
    onDeleteRecipe(toDelete: Recipe): void
}

interface RecipePageProps {
    model: ModelState
    handler: RecipeHandler
}

enum FormState {
    new,
    update,
    cancel
}

interface RecipePageState {
    name:string
    formState: FormState
    input:Array<Ingredient>
    output:Array<Output>
    tags:Tags
    craftingMethod: CraftingMethod
}

export class RecipesPage extends React.Component<RecipePageProps, RecipePageState> {
    constructor(props: RecipePageProps) {
        super(props)

        this.state = this.makeClearState()
    }
    makeClearState() {
        return {
            name:'',
            formState : FormState.new,
            input:new Array<Ingredient>(),
            output:new Array<Output>(),
            tags:new Tags(),
            craftingMethod: new CraftingMethod()
        }
    }
    selectRecipe(recipe: Recipe) {
        this.setState({
            name:recipe.name,
            input:[...recipe.input],
            output:[...recipe.output],
            tags:recipe.tags.cloneObject(),
            craftingMethod:new CraftingMethod(recipe.craftingMethod.name, 1)
        })
    }
    deleteRecipe(cm: Recipe) {
        this.props.handler.onDeleteRecipe(cm)
    }
    onSubmitForm() {
        if (this.state.formState == FormState.new) {
            this.props.handler.onAddRecipe(new Recipe(this.state.name, this.state.input, this.state.output, this.state.tags, this.state.craftingMethod))
        }
        else {
            this.props.handler.onUpdateRecipe(new Recipe(this.state.name, this.state.input, this.state.output, this.state.tags, this.state.craftingMethod))
        }
        this.setState(this.makeClearState())
    }
    onNameChanged(newName: string) {
        this.setState({name:newName})
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
    onSelectInput(obj:Entity) {
        let input = [...this.state.input]
        input.push(new Ingredient(obj.getType() as IngredientType, obj.name, 1));
        this.setState({input})
    }
    onInputCountChange(inp:Ingredient, value:string) {
        let input = [...this.state.input]
        inp.count = parseFloat(value)
        this.setState({input})
    }
    render() {
        let cmForm = []
        cmForm.push(<Form.Input label="Name" value={this.state.name} onChange={(e, { value }) => this.onNameChanged(value)} />)

        let inputs = this.state.input.map(inp=>(
            <Label>
                {inp.name}
                <Input size="mini" value={inp.count} type="number" onChange={(e,{value})=>this.onInputCountChange(inp, value)}/>
                <Icon name="delete" color="red" circular inverted/>
            </Label>)
        )

        inputs.push(<NamedPicker values={[...this.props.model.items, ...this.props.model.resources]} onSelect={(obj:Entity)=>this.onSelectInput(obj)}/>)

        cmForm.push(<Form.Field label="Inputs"/>)
        cmForm.push(<Form.Field inline>{inputs}</Form.Field>)

        cmForm.push(<Form.Field label="Tags"/>)
        cmForm.push(
            <Form.Field>
                <TagEditor tags={this.state.tags} allTags={this.props.model.tags} onAddTag={tag=>this.onAddTag(tag)} onRemoveTag={tag=>this.onRemoveTag(tag)}/>
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
                    list={this.props.model.recipes}
                    filter={nameAndTagsDefaultFilter}
                    renderItem={(cm: Recipe) => cm.name}
                    columns={4}
                    isButton={true}
                    haveDelete={true}
                    onSelect={(recipe: Recipe) => this.selectRecipe(recipe)}
                    onDelete={(recipe: Recipe) => this.deleteRecipe(recipe)}
                />
            </div>
        )
    }
}