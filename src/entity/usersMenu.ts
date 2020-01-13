type Structural = {
    id: number;
    parentId: number;
    menuName: string;
    menuUri: string;
    isShow: number;
    descriptor: string;
    sort: number;
    disabled: number;
};

import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from 'typeorm';
import { Users } from './users';
@Entity('users_menu')
export class UsersMenu {
    constructor(props: Structural = <Structural>{}) {
        this.id = props.id;
        this.parentId = props.parentId;
        this.menuName = props.menuName;
        this.menuUri = props.menuUri;
        this.isShow = props.isShow;
        this.descriptor = props.descriptor;
        this.sort = props.sort;
        this.disabled = props.disabled;
    }
    @PrimaryGeneratedColumn()
    id: number;
    @Column('int', { default: 0 })
    parentId: number;
    @Column('varchar', { length: 12 })
    menuName: string;
    @Column('varchar', { length: 100 })
    menuUri: string;
    @Column('int', { comment: '是否显示在菜单', default: 1 })
    isShow: number;
    @Column('varchar', { length: 100, comment: '描述', nullable: true })
    descriptor: string;
    @Column('int', { comment: '排序', default: 0 })
    sort: number;
    @Column('int', { default: 1 })
    disabled: number;
}
