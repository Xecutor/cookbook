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
import { Named } from "../model/named";

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

type IngredientNameType = {
    name:string
    type:IngredientType
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
    onSelectInput(obj:IngredientNameType) {
        let input = [...this.state.input]
        input.push(new Ingredient(obj.type as IngredientType, obj.name, 1));
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

        const inputTypes = ["Item", "Resource", "Crafter", "Tag"]
        let inputColumns : JSX.Element[][] = []
        let inputsHeader = []
        for(let itype of inputTypes) {
            inputsHeader.push(itype)
            let inputs = this.state.input.filter(inp=>inp.type==itype).map(inp=>(
                <Label size="mini">
                    {inp.name}
                    <Input size="mini" width={1} value={inp.count} type="number" onChange={(e,{value})=>this.onInputCountChange(inp, value)}/>
                    <Icon name="delete" size="mini" color="red" circular inverted/>
                </Label>)
            )
            let values;
            switch(itype) {
                case "Item": values = this.props.model.items;break;
                case "Resource": values = this.props.model.resources;break;
                case "Crafter": values = this.props.model.crafters; break;
                case "Tag": values = this.props.model.tags;break;
            }
            if(itype=="Tag") {
                values = (values as string[]).map(tag=>({name:tag, type:"Tag"}))
            }
            else {
                values = (values as Entity[]).map((ent:Entity)=>({name:ent.name, type:ent.getType()}))
            }
            inputs.push(<NamedPicker iconProps={{bordered:true}} values={values} onSelect={(obj:IngredientNameType)=>this.onSelectInput(obj)}/>)
            inputColumns.push(inputs)
        }

        cmForm.push(<Form.Field label="Inputs"/>)
        cmForm.push(<Form.Field inline>
            <Grid centered>
                <Grid.Row columns={4}>
                      {inputsHeader.map(col=><Grid.Column><Label color="olive">{col}</Label></Grid.Column>)}
                </Grid.Row>
                <Grid.Row columns={4}>
                    {inputColumns.map(col=><Grid.Column>{col}</Grid.Column>)}
                </Grid.Row>
            </Grid>
            </Form.Field>)

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
                        <Grid.Column key="pad1" width={1}/>
                        <Grid.Column key="middle" width={9}>
                            <Form size="tiny" onSubmit={() => this.onSubmitForm()}>
                                {cmForm}
                            </Form>
                        </Grid.Column>
                        <Grid.Column key="pad2" width={1}/>
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