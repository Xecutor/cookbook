import * as React from "react";
import * as ReactDOM from "react-dom";

import Grid, { GridProps } from "semantic-ui-react/dist/commonjs/collections/Grid/Grid";
import Input from "semantic-ui-react/dist/commonjs/elements/Input/Input";
import List from "semantic-ui-react/dist/commonjs/elements/List/List";
import Button from "semantic-ui-react/dist/commonjs/elements/Button/Button";

interface FilteredListProps<T>{
    list:Array<T>
    renderItem?:((val:T)=>string)|((val:T)=>JSX.Element)
    filter?:(val:T,filterText:string)=>boolean
    haveDelete? : boolean
    isButton? : boolean
    columns?:GridProps["columns"]
    onDelete?:(val:T)=>void
    onSelect?:(val:T)=>void
}

interface FilteredListState{
    filter:string;
}

export function simpleStringFilter(val:string, filterText:string)
{
    return val.indexOf(filterText) >= 0
}

export class FilteredList<T> extends React.Component<FilteredListProps<T>, any> {
    constructor(props:FilteredListProps<T>)
    {
        super(props)
        this.state={
            filter:''
        }
    }

    onFilterChange(newFilter:string)
    {
        this.setState({filter:newFilter})
    }

    render(){
        let colCount = 1;
        if (this.props.columns) {
            if (typeof this.props.columns === 'string') {
                colCount = parseInt(this.props.columns);
            }
            else {
                colCount = this.props.columns;
            }
        }

        let filteredList = this.props.list.filter(v=>this.props.filter(v,this.state.filter))

        let rowCount = (filteredList.length / colCount) | 0;
        if (filteredList.length % colCount) {
            ++rowCount;
        }

        let rows=[]
        let idx = 0
        let rend = this.props.renderItem
        for(let i=0;i<rowCount;++i) {
            let row = [];
            for(let j=0;j<colCount;++j) {
                if(idx<filteredList.length) {
                    let itemRaw = filteredList[idx]
                    let item = rend ? rend(itemRaw) : itemRaw
                    row.push(
                        <Grid.Column key={`${i}x${j}`}>
                            {this.props.isButton ? <Button onClick={()=>this.props.onSelect(itemRaw)}>{item}</Button> : item}
                            {this.props.haveDelete && <Button onClick={()=>this.props.onDelete(itemRaw)} color='red' icon='delete'></Button>}
                        </Grid.Column>)
                }
                else {
                    row.push(<Grid.Column key={`${i}x${j}`}></Grid.Column>)
                }
                ++idx
            }
            rows.push(<Grid.Row key={i}>{row}</Grid.Row>)
        }

        return (
            <Grid centered columns={this.props.columns}>
                <Grid.Row columnds={1}>
                    <Grid.Column><Input onChange={(e)=>this.onFilterChange(e.currentTarget.value)} placeholder="Search..."/></Grid.Column>
                </Grid.Row>
                {rows}
            </Grid>
        )
}
}