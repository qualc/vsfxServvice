import { UsersInterface } from '../../entity/usersInterface';
export interface UsersInterfaceOption {
    interfaceName?: string,
    disabled?: number,
    menuId?: number
}

export interface UsersInterfaces {
    /**
     * 获取登录用户接口列表
     * 
     * @author 天冰
     * @param {number} roleId 
     * @memberof UsersInterfaces
     */
    getInterfaceListByRoleId(roleId: number);
    /**
     * 获取所有接口列表
     * 
     * @param {any} { interfaceName = null, disabled = null } 
     * @returns 
     * @memberof UsersInterfaceService
     */
    getUsersInterfaceList(obj: UsersInterfaceOption);
    getUsersInterfaceTypeList();
    /**
     * 添加或保存类型
     * 
     * @param {UsersRole} usersRole 
     * @memberof UsersInterfaces
     */
    saveOrUpdateUsersInterface(usersInterface: UsersInterface);
    /**
     * 物理删除
     * 
     * @param {(number | UsersRole)} any 
     * @memberof UsersInterfaces
     */
    deletedUsersUsersInterface(any: number | UsersInterface);
}