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
    inCount?:number
    outCount?:number
    children:CraftingTree[]
}

interface TestPageState{
    tree:CraftingTree
}

function canRecursivelyExpand(ct:CraftingTree) {
    if(ct.type==='recipe' || ct.children===undefined) {
        return false
    }
    if(ct.children) {
        for(let c of ct.children) {
            if(!canRecursivelyExpand(c)) {
                return false
            }
        }
    }
    return true
}

function recursivelyExpand(outCount:number, ct:CraftingTree) {
    outCount = outCount?outCount:1;
    if(!ct.children || !ct.children.length) {
        return [{name:ct.name, type:ct.type, inCount: ct.inCount / outCount, children:[]}]
    }
    let rv : CraftingTree[] = []
    for(let c of ct.children) {
        rv.push(...recursivelyExpand( ct.outCount, c))
    }
    return rv
}

function collectTogether(ctArr:CraftingTree[]) {
    let ctMap : {[key:string]:CraftingTree} = {}
    for(let c of ctArr) {
        let key = `${c.name} x ${c.type}`
        if(ctMap[key]) {
            ctMap[key].inCount+=c.inCount
        }
        else {
            ctMap[key] = {...c}
        }
    }
    let rv = []
    for( let c in ctMap) {
        rv.push(ctMap[c])
    }
    return rv
}

function getOutCount(ent:{name:string, type:string}, recipe:Recipe) {
    let count = 1
    for (let o of recipe.output) {
        if (o.name == ent.name && o.type == ent.type) {
            count = o.count
            break
        }
    }
    return count
}

function expandRecipesToChildren(tree:CraftingTree, recipes:Recipe[]) {
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
                name:i.name,
                type:i.type,
                inCount:i.count,
                children:undefined
            })
        }
        tree.outCount = getOutCount(tree, recipes[0])
    }
    tree.children = children
}

export class TestPage extends React.Component<TestPageProps, TestPageState> {
    constructor(props:TestPageProps) {
        super(props)
        this.state = {
            tree:undefined
        }
    }
    updateState() {
        this.setState({tree:this.state.tree})
    }
    expandChild(parent:CraftingTree, ct:CraftingTree) {
        let recipes = []
        if(ct.type=='recipe') {
            //recipes.push(this.props.model.recipes.findByName(ct.name))
            //let idx = parent.children.findIndex(val=>val===ct)
            let recipe = this.props.model.recipes.findByName(ct.name)
            expandRecipesToChildren(parent, [this.props.model.recipes.findByName(ct.name)])
        }
        else {
            recipes = this.props.model.findRecipesByNameType(ct.name, ct.type)
            console.log(`found ${recipes.length} recipes for ${ct.name}/${ct.type}`)
            expandRecipesToChildren(ct, recipes)
        }
        this.updateState()
    }

    onCompressClick(parent:CraftingTree, child:CraftingTree) {
        //console.log(`parent name=${parent.name}, type=${parent.type} count=${parent.count}`)
        //console.log(`child name=${child.name}, count=${child.count}`)
        if(canRecursivelyExpand(child)) {
            let expanded = recursivelyExpand(child.outCount, child)
            expanded = collectTogether(expanded)
            if(parent) {
                let idx = parent.children.findIndex(val=>val===child)
                parent.children.splice(idx, 1, ...expanded)
            }
            else {
                child.outCount = 1
                child.children = expanded;
            }
            this.updateState()
        }
    }
    renderTree(depth:number, parent:CraftingTree, tree:CraftingTree) {
        let children : JSX.Element[]= [];
        if(tree.children) {
            for(let c of tree.children) {
                if(c.children) {
                    children.push(this.renderTree(depth+1, tree, c))
                }
                else {
                    let recipeIcon;
                    if(c.type==='recipe') {
                        recipeIcon = <Icon name="setting"/>;
                    }
                    children.push(<Button onClick={()=>this.expandChild(tree, c)}>{`${c.name} x ${c.inCount ? c.inCount : ''}`}{recipeIcon}</Button>)
                }
            }
        }
        const colors : SemanticCOLORS[] = ["red","orange","yellow","olive","green","teal","blue","violet","purple","pink","brown","grey","black"]
        let icon;
        if (tree.children && tree.children.length) {
            icon = <Icon link name="compress" inverted circular color={colors[depth%colors.length]} onClick={()=>this.onCompressClick(parent, tree)} />
        }
        let text = tree.name;
        if(children && children.length) {
            if(tree.outCount) {
                text += ` x ${tree.outCount}`
            }
            if(children.length) {
                text += '='
            }
        }
        else {
            if(tree.inCount) {
                text += ` x ${tree.inCount}`
            }
        }
        return <Label active color={colors[colors.length - 1 - (depth%colors.length)]}>
            {text}{children}
            {icon}
        </Label>
    }
    onSelectEntity(ent:Entity) {
        let recipes = this.props.model.findRecipesByNameType(ent.name, ent.getType())
        console.log(`recipes found: ${recipes.length}`)
        let tree: CraftingTree = { name: ent.name, type: ent.getType(), children:undefined }
        expandRecipesToChildren(tree, recipes)
        this.setState({tree})
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
