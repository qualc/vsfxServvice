type Structural = {
    id: number;
    disabled: number;
    updateDate: Date;
    createDate: Date;
};

import { Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';
export class BaseEntity {
    constructor(props: Structural = <Structural>{}) {
        this.id = props.id;
        this.disabled = props.disabled;
        this.updateDate = props.updateDate;
        this.createDate = props.createDate;
    }
    @PrimaryGeneratedColumn()
    id: number;
    @Column('int', { default: 1, comment: '1可用，0禁用' })
    disabled: number;
    @Column('timestamp', { comment: '修改时间' })
    updateDate: Date;
    @Column('datetime', { comment: '创建时间时间' })
    createDate: Date;
}
