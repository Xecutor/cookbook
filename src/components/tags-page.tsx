import * as React from "react";
import * as ReactDOM from "react-dom";
import { Tags, Tag } from "../model/tags";
import { simpleStringFilter, FilteredList } from "./filtered-list";
import Input from "semantic-ui-react/dist/commonjs/elements/Input/Input";
import Button from "semantic-ui-react/dist/commonjs/elements/Button/Button";

interface TagsPageProps{
    tags:string[]
    onAddTag:(tag:Tag)=>void
    onDelTag:(tag:Tag)=>void
}

interface TagsPageState{
    newTagName:string
}

export class TagsPage extends React.Component<TagsPageProps, TagsPageState> {
    constructor(props:TagsPageProps) {
        super(props)
        this.state={
            newTagName:''
        }
    }
    onAddTag() {
        this.props.onAddTag(this.state.newTagName)
        this.setState({newTagName:''})
    }
    render() {
        return (
            <div>
                <Input 
                    onChange={(e)=>this.setState({newTagName:e.currentTarget.value})}
                    placeholder="New tag" value={this.state.newTagName}
                    action={{icon:"add", onClick:()=>this.onAddTag()}}
                    />
                <FilteredList 
                    columns={4} 
                    filter={simpleStringFilter} 
                    haveDelete={true} 
                    onDelete={this.props.onDelTag}
                    isButton={true} 
                    list={this.props.tags}
                    />
            </div>
        )
    }
}