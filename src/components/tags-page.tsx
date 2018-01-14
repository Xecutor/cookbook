import * as React from "react";
import * as ReactDOM from "react-dom";
import { Tags, Tag } from "../model/tags";
import { simpleStringFilter, FilteredList } from "./filtered-list";
import Input from "semantic-ui-react/dist/commonjs/elements/Input/Input";
import Button from "semantic-ui-react/dist/commonjs/elements/Button/Button";

interface TagsPageProps{
    tags:Tags
    onAddTag:(tag:Tag)=>void
    onDelTag:(tag:Tag)=>void
}

export class TagsPage extends React.Component<TagsPageProps, any> {
    newTag:string
    onAddTag() {
        this.props.onAddTag(this.newTag)
    }
    render() {
        return (
            <div>
                <Input onChange={(e)=>this.newTag=e.currentTarget.value} placeholder="New tag"/><Button onClick={()=>this.onAddTag()} icon="add"/>
                <FilteredList 
                    columns={4} 
                    filter={simpleStringFilter} 
                    haveDelete={true} 
                    onDelete={this.props.onDelTag}
                    isButton={true} 
                    list={this.props.tags.tags}
                    />
            </div>
        )
    }
}