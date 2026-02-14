import { Entity, Table, Id, Generated, Column, Documentation } from '@aerokit/sdk/db'

@Entity('DocumentTemplateEntity')
@Table('CODBEX_DOCUMENTTEMPLATE')
@Documentation('DocumentTemplate entity mapping')
export class DocumentTemplateEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'DOCUMENTTEMPLATE_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Type')
    @Column({
        name: 'DOCUMENTTEMPLATE_TYPE',
        type: 'integer',
        nullable: true,
    })
    public Type?: number;

    @Documentation('Content')
    @Column({
        name: 'DOCUMENTTEMPLATE_CONTENT',
        type: 'clob',
    })
    public Content!: unknown;

}

(new DocumentTemplateEntity());
