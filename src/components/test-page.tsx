import * as React from "react";
import * as ReactDOM from "react-dom";

import { Icon, Label, Button, SemanticCOLORS } from "semantic-ui-react";

import { Model } from "../model/model";
import { NamedPicker } from "./named-picker";
import { Entity } from "../model/entity";
import { Recipe } from "../model/recipe";


interface TestPageProps{
    model:Model
}

interface CraftingTree{
    name:string
    type:string
    count?:number
    children:CraftingTree[]
}

interface TestPageState{
    tree:CraftingTree
}

export class TestPage extends React.Component<TestPageProps, TestPageState> {
    constructor(props:TestPageProps) {
        super(props)
        this.state = {
            tree:undefined
        }
    }
    recipesToChildren(recipes:Recipe[]) {
        let children : CraftingTree[]=[]
        if(recipes.length>1) {
            for(let r of recipes) {
                children.push({
                    name:r.name,
                    type:'recipe',
                    children:undefined
                })
            }
        }
        else if(recipes.length==1) {
            for(let i of recipes[0].input) {
                children.push({
                    ...i,
                    children:undefined
                })
            }
        }
        return children
    }
    expandChild(ct:CraftingTree) {
        let recipes = []
        if(ct.type=='recipe') {
            recipes.push(this.props.model.recipes.findByName(ct.name))
        }
        else {
            recipes = this.props.model.findRecipesByNameType(ct.name, ct.type)
            console.log(`found ${recipes.length} recipes for ${ct.name}/${ct.type}`)
        }
        ct.children = this.recipesToChildren(recipes)
        this.setState({tree:this.state.tree})
    }
    onCompressClick(parent:CraftingTree, child:CraftingTree) {
        console.log(`parent name=${parent.name}, type=${parent.type} count=${parent.count}`)
        console.log(`child name=${child.name}, count=${child.count}`)
    }
    renderTree(depth:number, parent:CraftingTree, tree:CraftingTree) {
        let children : JSX.Element[]= [];
        if(tree.children) {
            for(let c of tree.children) {
                if(c.children) {
                    children.push(this.renderTree(depth+1, tree, c))
                }
                else {
                    children.push(<Button onClick={()=>this.expandChild(c)}>{c.name}<Icon name="setting"/></Button>)
                }
            }
        }
        const colors : SemanticCOLORS[] = ["red","orange","yellow","olive","green","teal","blue","violet","purple","pink","brown","grey","black"]
        return <Label active color={colors[colors.length - 1 - (depth%colors.length)]}>
            {tree.name + (tree.count?` x ${tree.count}`:'')}{children}
            <Icon link name="compress" inverted circular color={colors[depth%colors.length]} onClick={()=>this.onCompressClick(parent, tree)} />
        </Label>
    }
    onSelectEntity(ent:Entity) {
        let recipes = this.props.model.findRecipesByNameType(ent.name, ent.getType())
        console.log(`recipes found: ${recipes.length}`)
        let children = this.recipesToChildren(recipes)
        this.setState({tree:{name:ent.name, type:ent.getType(), children}})
    }
    render() {
        let values = [...this.props.model.items.toState(), ...this.props.model.resources.toState(), ... this.props.model.crafters.toState()]
        let tree;
        if(this.state.tree) {
            tree = this.renderTree(0, undefined, this.state.tree)
        }
        return <span>
            <NamedPicker values={values} onSelect={(ent:Entity)=>this.onSelectEntity(ent)}/>
            {tree}
        </span>
    }
}
