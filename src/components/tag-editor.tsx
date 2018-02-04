import * as React from "react";
import * as ReactDOM from "react-dom";

import { Button, Icon, Popup, Input, Grid, List } from 'semantic-ui-react';
import { Tag, Tags } from "../model/tags";
import Label from "semantic-ui-react/dist/commonjs/elements/Label/Label";

interface TagEditorProps {
    tags: Tags
    allTags: Array<Tag>
    onAddTag(name: Tag):void;
    onRemoveTag(name:Tag):void;
}

interface TagEditorState {
    filter:string
}

export class TagEditor extends React.Component<TagEditorProps, TagEditorState> {
    constructor(props: TagEditorProps) {
        super(props)
        this.state = {
            filter: ''
        }
    }

    onFilterChange(newFilter: string) {
        this.setState({ filter: newFilter });
    }

    render() {
        let lst = this.props.allTags.filter((item) => item.indexOf(this.state.filter) >= 0);
        let rv = this.props.tags.array.map(tag=><Label tag key={tag}>{tag}<Icon size="mini" circular name="delete" color="red" inverted onClick={()=>this.props.onRemoveTag(tag)}/></Label>)
        rv.push(
            <Popup
                trigger={<Icon circular bordered name='add' />}
                hoverable
                position={'bottom left'}
                size={'large'}
            >
                <Grid centered columns={1}>
                    <Grid.Row key="search">
                        <Input onChange={(e) => this.onFilterChange(e.currentTarget.value)} placeholder="Search..." />
                    </Grid.Row>
                    <Grid.Row key="list">
                        <List>
                            {
                                lst.map(
                                    (item, index) => <List.Item key={index}>
                                        <Button onClick={() => this.props.onAddTag(item)}>{item}</Button>
                                    </List.Item>
                                )
                            }
                        </List>
                    </Grid.Row>
                </Grid>
            </Popup>)
        return rv
    }
}