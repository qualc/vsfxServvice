type Structural = {
    userName: string;
    nickName: string;
    openid: string;
    phone: string;
    unionid: string;
    avatarUrl: string;
    gender: string;
    city: string;
    province: string;
    country: string;
    language: string;
    createDate: Date;
    disabled: number;
    updateDate: Date;
};
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
@Entity('wx_users')
export default class WXUsers extends BaseEntity {
    @Column('varchar', { length: 30, comment: '用户真实姓名', nullable: true })
    userName: string;

    @Column('varchar', { length: 20, comment: '用户昵称', nullable: true })
    nickName: string;

    @PrimaryColumn()
    openid: string;

    @Column('varchar', { length: 20, comment: '联系方式', nullable: true })
    phone: string;

    @Column('varchar', { length: 100, comment: 'unionid', nullable: true })
    unionid: string;

    @Column('varchar', { length: 225, comment: '头像', nullable: true })
    avatarUrl: string;

    @Column('varchar', { length: 225, comment: '性别', nullable: true })
    gender: string;

    @Column('varchar', { length: 225, comment: '用户所在城市', nullable: true })
    city: string;

    @Column('varchar', { length: 225, comment: '用户所在省份', nullable: true })
    province: string;

    @Column('varchar', { length: 225, comment: '用户所在国家', nullable: true })
    country: string;

    @Column('varchar', { length: 50, comment: '用户的语言，简体中文为zh_CN', nullable: true })
    language: string;

    @Column('datetime', { comment: '创建时间时间' })
    createDate: Date;
    @Column('int', { default: 1, comment: '1可用，0禁用' })
    disabled: number;
    @Column('timestamp', { comment: '修改时间' })
    updateDate: Date;
    constructor(props: Structural = <Structural>{}) {
        super();

        this.userName = props.userName;
        this.nickName = props.nickName;
        this.openid = props.openid;
        this.phone = props.phone;
        this.unionid = props.unionid;
        this.avatarUrl = props.avatarUrl;
        this.gender = props.gender;
        this.city = props.city;
        this.province = props.province;
        this.country = props.country;
        this.language = props.language;
        this.createDate = props.createDate;
        this.disabled = props.disabled;
        this.updateDate = props.updateDate;
    }
}
