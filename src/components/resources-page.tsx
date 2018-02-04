
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Entity } from "../model/entity";
import { PropertyDecl, PropertiesCollection, PropertyClass } from "../model/property";
import { FilteredList } from "./filtered-list";
import { Resource } from "../model/resource";
import { EntityEditor, EntityHandler } from "./entity-editor";
import { Tags, Tag } from "../model/tags";
import { Item } from "../model/item";
import { ModelState } from "../model/model";

export interface ResourceHandler {
    onAddResource(resource: Resource): void
    onUpdateResource(resource: Resource): void
    onDeleteResource(resource: Resource): void
}

interface ResourcesPageProps {
    model:ModelState
    resourceHandler: ResourceHandler
}

export class ResourcesPage extends React.Component<ResourcesPageProps, any> implements EntityHandler {
    onAddEntity(name: string, props: PropertiesCollection, tags: Tags) {
        let newResource = new Resource(name, props.clone(), tags.cloneObject())
        this.props.resourceHandler.onAddResource(newResource)
    }
    onUpdateEntity(name: string, props: PropertiesCollection, tags: Tags) {
        let updatedResource = new Resource(name, props.clone(), tags.cloneObject())
        this.props.resourceHandler.onUpdateResource(updatedResource)
    }
    onDeleteEntity(name: string) {
        let ResourceToDel = this.props.model.resources.find(resource => resource.name == name)
        if (ResourceToDel) {
            this.props.resourceHandler.onDeleteResource(ResourceToDel)
        }
    }
    render() {
        return <EntityEditor
            model={this.props.model}
            entities={this.props.model.resources}
            props={this.props.model.properties.filter(prop=>prop.pclass==PropertyClass.resource)}
            entityHandler={this}
        />
    }
}
