import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface DocumentTemplateEntity {
    readonly Id: number;
    Type?: number;
    Content: unknown;
}

export interface DocumentTemplateCreateEntity {
    readonly Type?: number;
    readonly Content: unknown;
}

export interface DocumentTemplateUpdateEntity extends DocumentTemplateCreateEntity {
    readonly Id: number;
}

export interface DocumentTemplateEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Type?: number | number[];
            Content?: unknown | unknown[];
        };
        notEquals?: {
            Id?: number | number[];
            Type?: number | number[];
            Content?: unknown | unknown[];
        };
        contains?: {
            Id?: number;
            Type?: number;
            Content?: unknown;
        };
        greaterThan?: {
            Id?: number;
            Type?: number;
            Content?: unknown;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Type?: number;
            Content?: unknown;
        };
        lessThan?: {
            Id?: number;
            Type?: number;
            Content?: unknown;
        };
        lessThanOrEqual?: {
            Id?: number;
            Type?: number;
            Content?: unknown;
        };
    },
    $select?: (keyof DocumentTemplateEntity)[],
    $sort?: string | (keyof DocumentTemplateEntity)[],
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
}

interface DocumentTemplateEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<DocumentTemplateEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface DocumentTemplateUpdateEntityEvent extends DocumentTemplateEntityEvent {
    readonly previousEntity: DocumentTemplateEntity;
}

export class DocumentTemplateRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_DOCUMENTTEMPLATE",
        properties: [
            {
                name: "Id",
                column: "DOCUMENTTEMPLATE_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Type",
                column: "DOCUMENTTEMPLATE_TYPE",
                type: "INTEGER",
            },
            {
                name: "Content",
                column: "DOCUMENTTEMPLATE_CONTENT",
                type: "CLOB",
                required: true
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(DocumentTemplateRepository.DEFINITION, undefined, dataSource);
    }

    public findAll(options?: DocumentTemplateEntityOptions): DocumentTemplateEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): DocumentTemplateEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: DocumentTemplateCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_DOCUMENTTEMPLATE",
            entity: entity,
            key: {
                name: "Id",
                column: "DOCUMENTTEMPLATE_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: DocumentTemplateUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_DOCUMENTTEMPLATE",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "DOCUMENTTEMPLATE_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: DocumentTemplateCreateEntity | DocumentTemplateUpdateEntity): number {
        const id = (entity as DocumentTemplateUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as DocumentTemplateUpdateEntity);
            return id;
        } else {
            return this.create(entity);
        }
    }

    public deleteById(id: number): void {
        const entity = this.dao.find(id);
        this.dao.remove(id);
        this.triggerEvent({
            operation: "delete",
            table: "CODBEX_DOCUMENTTEMPLATE",
            entity: entity,
            key: {
                name: "Id",
                column: "DOCUMENTTEMPLATE_ID",
                value: id
            }
        });
    }

    public count(options?: DocumentTemplateEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_DOCUMENTTEMPLATE"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: DocumentTemplateEntityEvent | DocumentTemplateUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-templates-Settings-DocumentTemplate", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-templates-Settings-DocumentTemplate").send(JSON.stringify(data));
    }
}
