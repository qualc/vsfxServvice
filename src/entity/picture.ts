type Structural = {
    id?: number;
    imgUrl: string;
    alt: string;
    name: string;
    used?: number;
};
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
@Entity('picture')
export class Picture {
    constructor(props: Structural = <Structural>{}) {
        this.id = props.id;
        this.imgUrl = props.imgUrl;
        this.alt = props.alt;
        this.name = props.name;
        this.used = props.used;
    }
    @PrimaryGeneratedColumn()
    id?: number;
    @Column('varchar', { length: 255 })
    imgUrl: string;
    @Column('varchar', { length: 30 })
    alt: string;
    @Column('varchar', { length: 25 })
    name: string;
    @Column('int', { comment: '是否常用', default: 0 })
    used?: number;
}
