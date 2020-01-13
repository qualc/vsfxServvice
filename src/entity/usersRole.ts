type Structural = {
    id: number;
    name: string;
    menuIds: string;
    interfaceIds: string;
    disabled: number;
};

import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from 'typeorm';
import { Users } from './users';
@Entity('users_role')
export class UsersRole {
    constructor(props: Structural = <Structural>{}) {
        this.id = props.id;
        this.name = props.name;
        this.menuIds = props.menuIds;
        this.interfaceIds = props.interfaceIds;
        this.disabled = props.disabled;
    }
    @PrimaryGeneratedColumn()
    id: number;
    @Column('varchar', { length: 12 })
    name: string;
    @Column('varchar', { length: 500, default: '' })
    menuIds: string;
    @Column('varchar', { length: 500, default: '' })
    interfaceIds: string;
    @Column('int', { default: 1, comment: '1可用，0禁用' })
    disabled: number;
}
