type Structural = {
    desc: string;
    price: string;
    date: string;
    consumptionType: string;
};
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
@Entity('wx_account')
export default class WXAccount extends BaseEntity {
    constructor(props: Structural = <Structural>{}) {
        super();

        this.desc = props.desc;
        this.price = props.price;
        this.date = props.date;
        this.consumptionType = props.consumptionType;
    }
    @Column('varchar', { length: 100, comment: '描述', nullable: true })
    desc: string;

    @Column('float', { comment: '金额', nullable: true })
    price: string;

    @Column('datetime', { comment: '时间', nullable: true })
    date: string;

    @Column('int', { comment: '消费类型', nullable: true })
    consumptionType: string;
}
