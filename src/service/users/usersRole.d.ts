import { UsersRole } from '../../entity/usersRole';

export interface UsersRoleInterface {
    /**
     * 获取所有分类列表
     * 
     * @param {number} disabled 
     * @memberof UsersRoleInterface
     */
    findAllUsersRole(disabled: number);
    /**
     * 根据roleId查询菜单权限
     * @param roleId 
     */
    findUsersRoleEmpoMenuByRoleId(roleId: number);
    /**
     * 根据roleId查询接口权限
     * 
     * @author 493549174@qq.com
     * @param {number} roleId 
     * @memberof UsersRoleInterface
     */
    findUsersRoleEmpoInterfaceByRoleId(roleId: number);
    /**
     * 添加或保存类型
     * 
     * @param {UsersRole} usersRole 
     * @memberof UsersRoleInterface
     */
    saveOrUpdateUsersRole(usersRole: UsersRole);

    /**
     * 逻辑删除
     * 
     * @param {(number | UsersRole)} any 
     * @memberof UsersRoleInterface
     */
    disabledUsersRole(any: number | UsersRole);
    /**
     * 恢复逻辑删除
     * 
     * @param {(number | UsersRole)}
     * @memberof UsersRoleInterface
     */
    publishUsersRole(id: number | UsersRole);
    /**
     * 物理删除
     * 
     * @param {(number | UsersRole)} any 
     * @memberof UsersRoleInterface
     */
    deletedUsersRole(any: number | UsersRole);

    /**
     * 赋值菜单权限
     * 
     * @param {string} menuIds 
     * @param {number} roleId 
     * @memberof UsersRoleInterface
     */
    updateUsersGroupMenu(menuIds: string, roleId: number);

    /**
     * 赋值接口权限
     * 
     * @author 天冰
     * @param {string} interfaceIds 
     * @param {number} roleId 
     * @memberof UsersRoleInterface
     */
    updateUsersGroupInterface(interfaceIds: string, roleId: number);
}