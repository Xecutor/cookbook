import * as React from "react";
import * as ReactDOM from "react-dom";

import {Grid, Form, Message} from "semantic-ui-react";

import { Model } from "../model/model";

interface ImportExportProps{
    model:Model
    onImport:(json:string)=>string
}

interface ImportExportState{
    mode:string
    exportMode:string
    importText:string
    importMessage:string
}

export class ImportExportPage extends React.Component<ImportExportProps, ImportExportState> {
    constructor(props:ImportExportProps) {
        super(props)
        this.state = {
            mode : "export",
            exportMode : "all",
            importText: "",
            importMessage: ""
        }
    }
    onModeChange(mode:string) {
        this.setState({mode})
    }
    onTextChanged(importText:string) {
        this.setState({importText})
    }
    onExportModeChanged(exportMode:string) {
        this.setState({exportMode})
    }

    onImport() {
        this.setState({importMessage:this.props.onImport(this.state.importText)})
    }
    render() {
        let txt;
        let button;
        let exportMode;
        let warning;
        let importMessage;
        if(this.state.mode=="export") {
            txt = this.state.exportMode === "all" ? this.props.model.serialize() : this.props.model.cleanExport()
            if(this.state.exportMode==="clean") {
                warning = <Message warning header="JSON exported in clean mode cannot be imported."/>
            }
            exportMode = <Form.Select 
                value={this.state.exportMode}
                label="Export mode"
                options={[{text:"All", value:"all"},{text:"Clean", value:"clean"}]}
                onChange={(e,{value})=>this.onExportModeChanged(value as string)}
                />
        }
        else {
            if (this.state.importMessage) {
                importMessage = <Message header={this.state.importMessage} />
            }
            txt = this.state.importText
            button = <Form.Button>Import</Form.Button>
        }
        return <Grid columns={3}>
            <Grid.Row columns={3} centered>
                <Grid.Column></Grid.Column>
                <Grid.Column>
                    {importMessage}
                    <Form warning={!!warning} onSubmit={()=>this.onImport()}>
                        <Form.Group>
                            <Form.Radio name="mode" value="export" checked={this.state.mode==="export"} label="Export" onChange={(e,{value})=>this.onModeChange(value as string)}/>
                            <Form.Radio name="mode" value="import" checked={this.state.mode==="import"} label="Import" onChange={(e,{value})=>this.onModeChange(value as string)}/>
                        </Form.Group>
                        {exportMode}
                        {warning}
                        <Form.TextArea rows={10} autoHeight onChange={(e,data)=>this.onTextChanged(data.value as string)} value={txt}/>
                        {button}
                    </Form>
                </Grid.Column>
                <Grid.Column></Grid.Column>
            </Grid.Row>
        </Grid>
    }
}
