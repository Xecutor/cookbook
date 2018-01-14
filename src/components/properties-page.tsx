import * as React from "react";
import * as ReactDOM from "react-dom";
import { PropertyDecl, PropertyClass, PropertyType } from "../model/property";
import Grid from "semantic-ui-react/dist/commonjs/collections/Grid/Grid";
import Dropdown from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";
import Label from "semantic-ui-react/dist/commonjs/elements/Label/Label";

interface PropertiesPageProps{
    declarations : Array<PropertyDecl>
}

export class PropertiesPage extends React.Component<PropertiesPageProps, any> {
    propToComp(prop:PropertyDecl) {
        let options=[]
        for(let t in PropertyType) {
            let v = PropertyType[t]
            if(typeof v === "number") {
                options.push({
                    text:t,
                    value:v,
                })
            }
        }
        return (
                <Label>{prop.name}&nbsp;:&nbsp;<Dropdown options={options} value={prop.type}/>
                </Label>
            )
    }

    render()
    {
        let itemProps = this.props.declarations.filter(item => item.pclass == PropertyClass.item)
        let resProps = this.props.declarations.filter(item => item.pclass == PropertyClass.resource)
        let craftProps = this.props.declarations.filter(item => item.pclass == PropertyClass.crafter)

        let rows=[]
        for (let idx = 0; idx < itemProps.length || idx < resProps.length || idx < craftProps.length; ++idx) {
            let row = []
            if (idx < itemProps.length) {
                row.push(<Grid.Column>{this.propToComp(itemProps[idx])}</Grid.Column>)
            }
            else {
                row.push(<Grid.Column></Grid.Column>)
            }
            if (idx < resProps.length) {
                row.push(<Grid.Column>{this.propToComp(resProps[idx])}</Grid.Column>)
            }
            else {
                row.push(<Grid.Column></Grid.Column>)
            }
            if (idx < craftProps.length) {
                row.push(<Grid.Column>{this.propToComp(craftProps[idx])}</Grid.Column>)
            }
            else {
                row.push(<Grid.Column></Grid.Column>)
            }
            rows.push(row)
        }

        return (
            <Grid centered columns={3}>
                <Grid.Row>
                    <Grid.Column>Items</Grid.Column>
                    <Grid.Column>Resources</Grid.Column>
                    <Grid.Column>Crafters</Grid.Column>
                </Grid.Row>
                {
                    rows
                }
            </Grid>
        )
    }
}