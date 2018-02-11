import * as React from "react";
import * as ReactDOM from "react-dom";
import {Grid, Form, Label, Input, Icon, Dropdown} from "semantic-ui-react";

import { Recipe, Ingredient, Output, IngredientType, OutputType } from "../model/recipe";
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

type OutputNameType = {
    name:string
    type:OutputType
}

export class RecipesPage extends React.Component<RecipePageProps, RecipePageState> {
    constructor(props: RecipePageProps) {
        super(props)

        this.state = this.makeClearState()
    }
    makeClearState():RecipePageState {
        return {
            name:'',
            formState : FormState.new,
            input:new Array<Ingredient>(),
            output:new Array<Output>(),
            tags:new Tags(),
            craftingMethod: undefined
        }
    }
    selectRecipe(recipe: Recipe) {
        this.setState({
            name:recipe.name,
            input:[...recipe.input],
            output:[...recipe.output],
            tags:recipe.tags.cloneObject(),
            craftingMethod:new CraftingMethod(recipe.craftingMethod.name, recipe.craftingMethod.level),
            formState:FormState.update
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
    onDeleteInput(inp:Ingredient) {
        let input = this.state.input.filter(val=>val!=inp);
        this.setState({input})
    }
    onSelectOutput(obj:OutputNameType) {
        let output = [...this.state.output]
        output.push(new Output(obj.type as OutputType, obj.name, 1));
        this.setState({output})
    }
    onOutputCountChange(out:Output, value:string) {
        let output = [...this.state.output]
        out.count = parseFloat(value)
        this.setState({output})
    }
    onDeleteOutput(out:Output) {
        let output = this.state.output.filter(val=>val!=out);
        this.setState({output})
    }
    makeIO(types:string[], objects:(Ingredient|Output)[], 
        onCountChange:(obj:Ingredient|Output, value:string)=>void,
        onSelect:(obj:IngredientNameType|OutputNameType)=>void,
        onDelete:(obj:Ingredient|Output)=>void) {
        let header:string[] = [];
        let columns = []
        for(let itype of types) {
            let column = []
            header.push(itype)
            let colValues = objects.filter(inp=>inp.type==itype).map((obj, idx)=>(
                <Label size="mini" key={`${itype}-${idx}`}>
                    {obj.name}
                    <Input size="mini" width={1} value={obj.count} type="number" onChange={(e,{value})=>onCountChange(obj, value)}/>
                    <Icon name="delete" size="mini" color="red" circular inverted onClick={()=>onDelete(obj)}/>
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
            colValues.push(<NamedPicker key={`${itype}-picker`} iconProps={{bordered:true}} values={values} onSelect={(obj:IngredientNameType)=>onSelect(obj)}/>)
            columns.push(colValues)
        }
        return {header, columns}
    }

    onSelectCraftingMethod(cm:CraftingMethod) {
        let craftingMethod = new CraftingMethod(cm.name, 1)
        this.setState({craftingMethod})
    }

    onRemoveCraftingMethod(cm:CraftingMethod) {
        this.setState({craftingMethod:undefined})
    }
    
    onCraftingMethodLevelChange(lvl:number) {
        let craftingMethod = new CraftingMethod(this.state.craftingMethod.name, lvl)
        this.setState({craftingMethod})
    }

    createCraftingMethod() {
        let cm = this.state.craftingMethod
        let cmDef = this.props.model.craftingMethods.find(val=>val.name==cm.name)
        let maxLevel = cmDef ? cmDef.level : 1
        let lvlSelect = []
        for(let i=1;i<=maxLevel;++i) {
            lvlSelect.push({text:`Lvl:${i}`, value:i})
        }
        return <Label 
            key={cm.name}
            onClick={()=>this.onRemoveCraftingMethod(cm)}>
                {cm.name}&nbsp;&nbsp;
                <Dropdown 
                    value={cm.level}
                    options={lvlSelect}
                    onChange={(e,{value})=>this.onCraftingMethodLevelChange(value as number)}
                />
                <Icon name="delete" inverted circular color="red"/>
        </Label>
    }

    validate() {
        return this.state.name.length && this.state.craftingMethod && this.state.output.length && !this.props.model.recipes.find(r=>r.name==this.state.name)
    }

    render() {
        let cmForm = []
        cmForm.push(<Form.Input 
                        label="Name"
                        key="name"
                        error={this.state.name.length==0}
                        required={true}
                        value={this.state.name}
                        onChange={(e, { value }) => this.onNameChanged(value)}
                    />)

        const inputTypes = ["Item", "Resource", "Crafter", "Tag"]
        let {header:inputsHeader, columns:inputsColumns} = this.makeIO(inputTypes, this.state.input,
            (obj:Ingredient, value:string)=>this.onInputCountChange(obj, value),
            (obj:IngredientNameType)=>this.onSelectInput(obj),
            (obj:Ingredient)=>this.onDeleteInput(obj)
        )

        cmForm.push(<Form.Field key="inputs-label" label="Inputs"/>)
        cmForm.push(<Form.Field key="inputs" inline>
            <Grid centered>
                <Grid.Row columns={4}>
                      {inputsHeader.map((col,idx)=><Grid.Column key={`h${idx}`}><Label color="olive">{col}</Label></Grid.Column>)}
                </Grid.Row>
                <Grid.Row columns={4}>
                    {inputsColumns.map((col, idx)=><Grid.Column key={`c${idx}`}>{col}</Grid.Column>)}
                </Grid.Row>
            </Grid>
            </Form.Field>)

        const outputTypes = ["Item", "Resource", "Crafter"]
        let {header:outputsHeader, columns: outputsColumns} = this.makeIO(outputTypes, this.state.output,
            (obj:Output, value:string)=>this.onOutputCountChange(obj, value),
            (obj:OutputNameType)=>this.onSelectOutput(obj),
            (obj:Output)=>this.onDeleteOutput(obj)
        );

        cmForm.push(<Form.Field key="outputs-label" required={true} error={!this.state.output.length} label="Outputs"/>)
        cmForm.push(<Form.Field key="outputs" inline>
            <Grid centered>
                <Grid.Row columns={3}>
                      {outputsHeader.map((col,idx)=><Grid.Column key={`h${idx}`}><Label color="olive">{col}</Label></Grid.Column>)}
                </Grid.Row>
                <Grid.Row columns={3}>
                    {outputsColumns.map((col,idx)=><Grid.Column key={`c${idx}`}>{col}</Grid.Column>)}
                </Grid.Row>
            </Grid>
            </Form.Field>)
        cmForm.push(<Form.Field required={true} error={!this.state.craftingMethod} key="crafting-method-label" label="Crafting method"/>)
        if(this.state.craftingMethod) {
            cmForm.push(this.createCraftingMethod())
        }
        else {
            cmForm.push(<NamedPicker
                key="crafting-method-picker"
                values={this.props.model.craftingMethods}
                iconProps={{name:"search"}}
                onSelect={(cm:CraftingMethod)=>this.onSelectCraftingMethod(cm)}
            />)
        }

        cmForm.push(<Form.Field key="tags-label" label="Tags"/>)
        cmForm.push(
            <Form.Field key="tags">
                <TagEditor tags={this.state.tags} allTags={this.props.model.tags} onAddTag={tag=>this.onAddTag(tag)} onRemoveTag={tag=>this.onRemoveTag(tag)}/>
            </Form.Field>)
        if (this.state.formState == FormState.new) {
            cmForm.push(<Form.Button disabled={!this.validate()} key="add">Add</Form.Button>)
        }
        else {
            cmForm.push(<Form.Group key="update-cancel">
                <Form.Button key="update">Update</Form.Button>
                <Form.Button key="cancel" onClick={() => this.setState(this.makeClearState())}>Cancel</Form.Button>
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