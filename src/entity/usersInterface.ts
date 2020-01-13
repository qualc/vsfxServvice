type Structural = {
    id: number;
    interfaceName: string;
    interfaceType: string;
    interfaceUri: string;
    menuIds: string;
    descriptor: string;
    disabled: number;
};

import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from 'typeorm';
import { Users } from './users';
@Entity('users_interface')
export class UsersInterface {
    constructor(props: Structural = <Structural>{}) {
        this.id = props.id;
        this.interfaceName = props.interfaceName;
        this.interfaceType = props.interfaceType;
        this.interfaceUri = props.interfaceUri;
        this.menuIds = props.menuIds;
        this.descriptor = props.descriptor;
        this.disabled = props.disabled;
    }
    @PrimaryGeneratedColumn()
    id: number;
    @Column('varchar', { length: 12 })
    interfaceName: string;
    @Column('varchar', { length: 12, comment: '模块', nullable: true })
    interfaceType: string;
    @Column('varchar', { length: 100 })
    interfaceUri: string;
    @Column('varchar', { length: 100, comment: '所属菜单列表', nullable: true })
    menuIds: string;
    @Column('varchar', { length: 100, comment: '描述', nullable: true })
    descriptor: string;
    @Column('int', { default: 1 })
    disabled: number;
}
