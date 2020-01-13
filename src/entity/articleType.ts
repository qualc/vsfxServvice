type Structural = {
    id: number;
    disabled: number;
    parentId: number;
    name: string;
    iconUrl: string;
};

import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
@Entity('article_type')
export class ArticleType {
    constructor(props: Structural = <Structural>{}) {
        this.id = props.id;
        this.disabled = props.disabled;
        this.parentId = props.parentId;
        this.name = props.name;
        this.iconUrl = props.iconUrl;
    }
    @PrimaryGeneratedColumn()
    id: number;
    @Column('int', { default: 1, comment: '1可用，0禁用' })
    disabled: number;
    @Column('int', { default: 0 })
    parentId: number;
    @Column('varchar', { length: 225, comment: '类型名称' })
    name: string;
    @Column('varchar', { length: 225, comment: '默认icon', default: '' })
    iconUrl: string;
}
