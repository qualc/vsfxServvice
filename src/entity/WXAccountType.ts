type Structural = {
    name: string;
    id: number;
    disabled: number;
    iconUrl: string;
};
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('wx_account_type')
export default class WXAccountType {
    constructor(props: Structural = <Structural>{}) {
        this.name = props.name;
        this.disabled = props.disabled;
        this.iconUrl = props.iconUrl;
        this.id = props.id;
    }
    @PrimaryColumn()
    id: number;
    @Column('varchar', { length: 100, comment: '描述', nullable: true })
    name: string;
    @Column('int', { default: 1, comment: '1可用，0禁用' })
    disabled: number;
    @Column('varchar', { length: 225, comment: '默认icon', default: '' })
    iconUrl: string;
}
