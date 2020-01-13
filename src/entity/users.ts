type Structural = {
    userName: string;
    email: string;
    password: string;
    usersRole: UsersRole;
    nickName: string;
    headimg: string;
    phone: string;
    motto: string;
    juejin: string;
    zhihu: string;
    github: string;
    jianshu: string;
    identity: string;
};

import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { UsersRole } from './usersRole';
@Entity('users')
export class Users extends BaseEntity {
    constructor(props: Structural = <Structural>{}) {
        super();

        this.userName = props.userName;
        this.email = props.email;
        this.password = props.password;
        this.usersRole = props.usersRole;
        this.nickName = props.nickName;
        this.headimg = props.headimg;
        this.phone = props.phone;
        this.motto = props.motto;
        this.juejin = props.juejin;
        this.zhihu = props.zhihu;
        this.github = props.github;
        this.jianshu = props.jianshu;
        this.identity = props.identity;
    }
    @Column('varchar', { length: 30, comment: '用户真实姓名', nullable: true })
    userName: string;

    @Column('varchar', { length: 100, comment: '电子邮箱' })
    email: string;

    @Column('varchar', { length: 200, comment: '密码' })
    password: string;

    @OneToOne(type => UsersRole, { nullable: true })
    @JoinColumn()
    usersRole: UsersRole;

    @Column('varchar', { length: 20, comment: '用户昵称' })
    nickName: string;

    @Column('varchar', { length: 255, comment: '用户头像', nullable: true })
    headimg: string;

    @Column('varchar', { length: 20, comment: '联系方式', nullable: true })
    phone: string;

    @Column('varchar', { length: 100, comment: '座右铭', nullable: true })
    motto: string;

    @Column('varchar', { length: 225, comment: '掘金主页', nullable: true })
    juejin: string;

    @Column('varchar', { length: 225, comment: '知乎主页', nullable: true })
    zhihu: string;

    @Column('varchar', { length: 225, comment: 'github主页', nullable: true })
    github: string;

    @Column('varchar', { length: 225, comment: '简书主页', nullable: true })
    jianshu: string;

    @Column('varchar', { length: 50, comment: '身份标识', nullable: true })
    identity: string;
}
