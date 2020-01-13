import { UsersMenu } from '../../entity/usersMenu';
export interface UsersMenuOption {
    parentId?: number | null;
    menuName?: string | null;
    disabled?: number | null;
    isMenu?: number | null;
}

export interface UsersMenuInterface {
    getRepository: Function;
    /**
     * 获取菜单
     *
     * @param {any} {roleId}
     * @memberof UsersMenuService
     */
    getMenuListByRoleId(roleId: number);
    /**
     * 获取所有的菜单
     *
     * @param {any} operaUser
     * @returns
     * @memberof UserMenuService
     */
    getUsersMenuList(obj: UsersMenuOption);
    getUsersMenuListByParentId(parentId: number);
    /**
     * 菜单添加
     * @param {*} params
     */
    saveOrUpdateUsersMenu(userMenu: UsersMenu);

    /**
     * 菜单排序
     * @param {any} arr
     * @memberof UsersMenuService
     */
    saveSortUsersMenu(arr);
}
// userMenuAllList: `select id,parentId,menuKey,menuName,menuUri,menuKey,descriptor,isMenu from users_menu where 1=1`,
// anySave: `INSERT INTO users_menu(parentId, menuKey,menuName,menuUri,isMenu,descriptor,operaUser,operaType,createUser,createDate,sort) VALUES(?,?,?,?,?,?,?,'save',?,now(),last_insert_id()+1);`,
// anyUpdate: `UPDATE users_menu SET parentId = ?, menuKey=?,menuName = ?,menuUri = ?,isMenu=?,descriptor = ?,operaUser = ?,operaType='update' WHERE id = ?;`,
// anyDelete: `DELETE from users_menu WHERE id = ?;`,
// anyPublic: `update users_menu set disabled = 1,operaUser=?,operaType='publish',updateDate=now() where id=?`,
// anyDisabled: `update users_menu set disabled = 0,operaUser=?,operaType='disabled',updateDate=now() where id=?`,
// anyDelete: `delete from users_menu where id = ?`
