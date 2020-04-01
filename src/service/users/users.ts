import { Service } from 'vsfx';
import { BaseService } from '../BaseService';
import { UsersInterface, UsersOption } from './users.d';
import { Users } from '../../entity/users';

@Service()
export class UsersService extends BaseService implements UsersInterface {
    /**
     * 根据id获取用户信息   不带邮箱、密码等信息
     *
     * @param {any} id
     * @returns
     * @memberof UsersService
     */
    async getUsersById(id: number): Promise<Users> {
        let users = <Users>{};
        if (!id || id == 0) return users;
        let query = this.getRepository(Users)
            .createQueryBuilder('users')
            .leftJoinAndSelect('users.usersRole', 'usersRole')
            .select(['users.id id', 'users.nickName nickName', 'users.userName userName', 'users.password password', 'users.email email', 'users.phone phone', 'users.motto metto', 'users.headimg headimg', 'usersRole.id roleId', 'usersRole.name roleName'])
            .where('users.id=:id', { id });
        users = await query.printSql().getRawOne();
        return users || {};
        // let users: Users = await this.getRepository(Users).query('select id, usersRoleId,email, nickName, motto from users where id=' + id);
        // return users[0] || {};
    }

    /**
     * 登录 根据email获取登录信息
     *
     * @param {any} { email }
     * @returns
     * @memberof UsersService
     */
    async getUsersLogin({ email }: UsersOption): Promise<any> {
        // let sql = `select * from users where disabled = 1 and  email = "${email}"`;
        // let users = await this.execute(sql);
        // return users[0] || {};
        // let users: Users = await this.getRepository(Users).query(`select id, email, password,usersRoleId from users where email="${email}"`);
        let sql = `select u.id, u.nickName, u.password, u.email, u.phone, u.motto, u.headimg, ur.id as usersRoleId, ur.name as roleName from users u left join users_role ur on u.usersRoleId = ur.id where 1=1 `;
        // let query = this.getRepository(Users)
        //     .createQueryBuilder('users')
        //     // .leftJoinAndSelect('users.usersRole', 'usersRole')
        //     .select([
        //         'users.id id',
        //         'users.nickName nickName',
        //         // 'users.userName userName',
        //         'users.password password',
        //         'users.email email',
        //         'users.phone phone',
        //         'users.motto metto',
        //         'users.headimg headimg',
        //         'users.id usersRoleId',
        //         'usersRole.name roleName'
        //     ])
        //     .where('1=1');
        if (email) {
            // query = query.andWhere('users.email=:email', { email });
            sql += ` and u.email = '${email}'`;
        }

        // let users = await query.printSql().getRawOne();
        let users = await this.getRepository(Users).query(sql);
        return users[0] || {};
    }

    /**
     * 根据email、phone查询用户是否存在
     *
     * @param {any} { email }
     * @returns
     * @memberof UsersService
     */
    async getUsersExist({ email, phone }: UsersOption): Promise<Array<Users>> {
        let sql = `select * from users where phone='${phone}' or email='${email}'`;
        let users = await this.getRepository(Users).query(sql);
        // let users = await this.execute(sql);
        return users || [];
    }

    /**
     * 获取所有用户列表
     *
     * @memberof UsersService
     */
    async findAllUsers(disabled?: number): Promise<Array<Users>> {
        let query = this.getRepository(Users)
            .createQueryBuilder('users')
            .leftJoinAndSelect('users.usersRole', 'usersRole')
            .select([
                'users.id id',
                'users.nickName nickName',
                // 'users.userName userName',
                'users.email email',
                'users.phone phone',
                'users.motto metto',
                'users.headimg headimg',
                'usersRole.id roleId',
                'usersRole.name roleName'
            ])
            .where('1=1');
        if (disabled || disabled == 0) {
            query = query.andWhere('disabled=:disabled', { disabled });
        }
        let usersList: Array<Users> = await query
            .skip(0)
            .take(100)
            .printSql()
            .getRawMany();
        return usersList;
    }
    async getAuthorList(): Promise<Array<Users>> {
        let usersList: Array<Users> = await this.getRepository(Users).query('select count(u.id) count, u.identity, u.nickName, u.motto, u.headimg,u.juejin, u.zhihu, u.github, u.jianshu from users u, article at where u.disabled = 1 and `at`.disabled = 1 and u.id = `at`.usersId group by u.id');
        return usersList;
    }
    async getUsersByIdentity(identity: string): Promise<Users> {
        let users: Users = await this.getRepository(Users)
            .createQueryBuilder('users')
            .leftJoinAndSelect('users.usersRole', 'usersRole')
            .select([
                'users.id id',
                'users.nickName nickName',
                // 'users.userName userName',
                'users.password password',
                'users.email email',
                'users.phone phone',
                'users.motto metto',
                'users.headimg headimg',
                'usersRole.id roleId',
                'usersRole.name roleName'
            ])
            .where('users.identity=:identity', { identity })
            .getRawOne();
        return users || {};
    }
    /**
     * 添加或修改用户
     *
     * @param {Users} users
     * @returns {Promise<string>}
     * @memberof UsersService
     */
    async saveOrUpdateUser(users: Users): Promise<string> {
        // let exe = await this.getRepository(Users).save(users);
        // return exe ? '操作成功' : '操作失败';
        return await super.saveOrUpdateAny(Users, users);
    }

    /**
     * 逻辑删除
     *
     * @param {(number | Users)}
     * @memberof UsersInterface
     */
    async disabledUsers(id: number) {
        // let exe = await this.getRepository(Users).updateById(id, { disabled: 0 });
        // return exe ? '禁用成功' : '禁用失败';
        return await super.disabledAny(Users, id);
    }
    /**
     * 恢复逻辑删除
     *
     * @param {(number | Users)}
     * @memberof UsersInterface
     */
    async publishUsers(id: number) {
        // let exe = await this.getRepository(Users).updateById(id, { disabled: 1 });
        // return exe ? '发布成功' : '发布失败';
        return await super.publishAny(Users, id);
    }

    /**
     * 物理删除
     *
     * @param {(number | Users)} any
     * @memberof UsersInterface
     */
    async deletedUsers(id: number) {
        // let exe = await this.getRepository(Users).removeById(id);
        // return exe ? '删除成功' : '删除失败';
        return await super.deletedAny(Users, id);
    }
}
