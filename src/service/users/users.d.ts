
import { Users } from '../../entity/users';
export interface UsersOption {
    email?: string;
    phone?: number;
}
export interface UsersInterface {
    getUsersById(id: number);

    /**
     * 登录 根据email获取登录信息
     * 
     * @param {any} { email } 
     * @returns 
     * @memberof UsersService
     */
    getUsersLogin(obj: UsersOption);

    /**
     * 根据email、phone查询用户是否存在
     * 
     * @param {any} { email } 
     * @returns 
     * @memberof UsersService
     */
    getUsersExist(obj: UsersOption);

    /**
     * 查询所有用户
     * 
     * @param {number} [disabled] 
     * @returns {Promise<Array<Users>>} 
     * @memberof UsersInterface
     */
    findAllUsers(disabled?: number);

    /**
     *  查询所有用户|笔者
     * 
     * @memberOf UsersInterface
     */
    getAuthorList();
    /**
     * 根据identity查询作者信息
     * 
     * @param {string} identity 
     * 
     * @memberOf UsersInterface
     */
    getUsersByIdentity(identity: string);
    /**
     * 添加或修改用户
     * 
     * @param {Users} users 
     * @memberof UsersInterface
     */
    saveOrUpdateUser(users: Users);
}