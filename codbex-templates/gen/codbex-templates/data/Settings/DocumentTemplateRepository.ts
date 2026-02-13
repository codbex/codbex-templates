import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { DocumentTemplateEntity } from './DocumentTemplateEntity'

@Component('DocumentTemplateRepository')
export class DocumentTemplateRepository extends Repository<DocumentTemplateEntity> {

    constructor() {
        super((DocumentTemplateEntity as EntityConstructor));
    }

    protected override async triggerEvent(data: EntityEvent<DocumentTemplateEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-templates-Settings-DocumentTemplate', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-templates-Settings-DocumentTemplate').send(JSON.stringify(data));
    }
}
