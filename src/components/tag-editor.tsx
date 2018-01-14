import * as React from "react";
import * as ReactDOM from "react-dom";

import { Button, Icon, Popup, Input, Grid, List } from 'semantic-ui-react';

interface TagEditorProps {
    tags:Array<string>
    onAddTag:(name:string)=>void;
}

export class TagEditorPopup extends React.Component<TagEditorProps, any> {
    constructor(props:TagEditorProps)
    {
        super(props);
        this.state={
            filter:''
        }
    }

    onFilterChange(newFilter:string)
    {
        this.setState({filter:newFilter});
    }

    render() {
        let lst = this.props.tags.filter((item)=>item.indexOf(this.state.filter)>=0);
        return (
            <Popup 
                trigger ={<Button icon='add'/>}
                hoverable
                position={'bottom left'}
                size={'large'}
                >
                <Grid centered columns={1}>
                <Grid.Row>
                    <Input onChange={(e)=>this.onFilterChange(e.currentTarget.value)} placeholder="Search..."/>
                </Grid.Row>
                <Grid.Row>
                    <List>
                        {
                            lst.map(
                                (item)=><List.Item>
                                    <Button>{item}</Button>
                                    <Button color='red' icon='delete'></Button>
                                </List.Item>
                            )
                        }
                    </List>
                </Grid.Row>
                </Grid>
            </Popup>
        )
    }
}