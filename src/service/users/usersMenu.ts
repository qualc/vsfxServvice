import { Service } from 'vsfx';
import { isInteger } from '../../lib/validate';
import { BaseService } from '../BaseService';
import { UsersMenuInterface, UsersMenuOption } from './usersMenu.d';
import { UsersInterface } from '../../entity/usersInterface';
import { UsersMenu } from '../../entity/usersMenu';

@Service()
export class UsersMenuService extends BaseService implements UsersMenuInterface {
    /**
     * 获取登录用户菜单列表
     *
     * @param {any} {roleId}
     * @memberof UsersMenuService
     */
    getMenuListByRoleId(roleId) {
        return this.getRepository(UsersMenu).query(`select um.* from users_menu um where find_in_set(um.id, (select ur.menuIds from users_role ur where ur.id=${roleId}))`);
    }

    /**
     * 获取所有的菜单
     *
     * @param {any} operaUser
     * @returns
     * @memberof UserMenuService
     */
    async getUsersMenuList({ parentId = null, menuName = null, disabled = null, isMenu = null }: UsersMenuOption) {
        let query = this.getRepository(UsersMenu)
            .createQueryBuilder('UsersMenu')
            .where('1=1');
        if (isInteger(isMenu)) {
            query = query.andWhere('isMenu=:isMenu', { isMenu });
        }
        if (isInteger(disabled)) {
            query = query.andWhere('disabled=:disabled', { disabled });
        }
        if (isInteger(parentId)) {
            query = query.andWhere('parentId=:parentId', { parentId });
        }
        if (menuName) {
            query = query.andWhere('menuName like ":menuName"', { parentId });
        }
        query = query.orderBy('parentId');
        return await query.getMany();
    }

    async getUsersMenuListByParentId(parentId) {
        return await this.getRepository(UsersMenu)
            .createQueryBuilder('UsersMenu')
            .select(['id', 'menuName'])
            .where('parentId=:parentId', { parentId })
            .orderBy('parentId')
            .orderBy('sort', 'ASC')
            .getRawMany();
    }
    /**
     * 菜单添加
     * @param {*} params
     */
    async saveOrUpdateUsersMenu(usersMenu: UsersMenu) {
        // let query = `INSERT INTO users_menu(parentId, menuKey, menuName, menuUri, isMenu, descriptor, operaUser, createUser, operaType, createDate) VALUES( ${ param.join(',') }, 'save', now())`;
        // return this.execute(`call insertUsersMenu(${query})`);
        // let [parentId, menuKey, menuName, menuUri, isMenu, descriptor = '', operaUser, createUser] = param;
        // let exe = await this.execute(`call insertUsersMenu(${parentId},"${menuKey}","${menuName}","${menuUri}",${isMenu}, "${descriptor}","${operaUser}","${createUser}")`)
        // return exe ? '添加成功' : '添加失败';
        return super.saveOrUpdateAny(UsersMenu, usersMenu);
    }

    /**
     * 菜单排序
     * @param {any} arr
     * @memberof UsersMenuService
     */
    async saveSortUsersMenu(arr) {
        await this.getRepository(UsersMenu).query(`insert into users_menu(id, parentId, sort) values(${arr.join('),(')}) on duplicate key update parentId=VALUES(parentId),sort=VALUES(sort);`);
        return '操作成功';
    }

    async deleteUsersMenu(id) {
        return super.deletedAny(UsersMenu, id);
    }
}
// userMenuAllList: `select id,parentId,menuKey,menuName,menuUri,menuKey,descriptor,isMenu from users_menu where 1=1`,
// anySave: `INSERT INTO users_menu(parentId, menuKey,menuName,menuUri,isMenu,descriptor,operaUser,operaType,createUser,createDate,sort) VALUES(?,?,?,?,?,?,?,'save',?,now(),last_insert_id()+1);`,
// anyUpdate: `UPDATE users_menu SET parentId = ?, menuKey=?,menuName = ?,menuUri = ?,isMenu=?,descriptor = ?,operaUser = ?,operaType='update' WHERE id = ?;`,
// anyDelete: `DELETE from users_menu WHERE id = ?;`,
// anyPublic: `update users_menu set disabled = 1,operaUser=?,operaType='publish',updateDate=now() where id=?`,
// anyDisabled: `update users_menu set disabled = 0,operaUser=?,operaType='disabled',updateDate=now() where id=?`,
// anyDelete: `delete from users_menu where id = ?`
