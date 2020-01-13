type Structural = {
    IAE: String;
    price: Number;
    type: number;
    description: String;
};
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';
@Entity('account')
export class Account extends BaseEntity {
    constructor(props: Structural = <Structural>{}) {
        super();

        this.IAE = props.IAE;
        this.price = props.price;
        this.type = props.type;
        this.description = props.description;
    }
    @Column('varchar', { length: 255, comment: 'i 支出  e收入', default: 'n' })
    IAE: String;
    @Column('int', { comment: '金额' })
    price: Number;
    @Column('int', { comment: '消费类型' })
    type: number;
    @Column('varchar', { length: 255, comment: '说明', default: 'n' })
    description: String;
}
