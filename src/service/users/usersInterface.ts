import { Service } from 'vsfx';
import { isInteger } from '../../lib/validate';
import { BaseService } from '../BaseService';
import { UsersInterfaces, UsersInterfaceOption } from './usersInterface.d';
import { UsersInterface } from '../../entity/usersInterface';
import { UsersRole } from '../../entity/usersRole';

@Service()
export class UsersInterfaceService extends BaseService implements UsersInterfaces {
    /**
     * 获取登录用户接口列表
     *
     * @author 天冰
     * @param {number} roleId
     * @memberof UsersInterfaces
     */
    getInterfaceListByRoleId(roleId: number) {
        return this.getRepository(UsersInterface).query(`select ui.* from users_interface ui where find_in_set(ui.id, (select ur.interfaceIds from users_role ur where ur.id=${roleId}))`);
    }

    /**
     * 获取所有接口列表
     *
     * @param {any} { interfaceName = null, disabled = null }
     * @returns
     * @memberof UsersInterfaceService
     */
    async getUsersInterfaceList({ interfaceName, disabled, menuId }: UsersInterfaceOption) {
        let queryGroupByMenuName = `select ui.id,ui.interfaceType,ui.interfaceName, ui.interfaceName, ui.interfaceUri, ui.descriptor,ui.menuIds, concat(group_concat(um.menuName),",") menuName from users_interface ui, users_menu um where find_in_set(um.id, ui.menuIds)`,
            queryNotMenusIds = `select ui.id,ui.interfaceType,ui.interfaceName, ui.interfaceName, ui.interfaceUri, ui.descriptor,ui.menuIds ,(case when ui.menuIds =0 then '无' end) menuName from users_interface ui where (ui.menuIds is null or ui.menuIds = 0)`;
        if (isInteger(disabled)) {
            let disabledSql = ` and ui.disabled = ${disabled}`;
            queryGroupByMenuName += disabledSql;
            queryNotMenusIds += disabledSql;
        }
        if (interfaceName) {
            let interfaceNameSql = ` and ui.interfaceName like "%${interfaceName}%"`;
            queryGroupByMenuName += interfaceNameSql;
            queryNotMenusIds += interfaceNameSql;
        }
        if (menuId) {
            let interfaceNameSql = ` and find_in_set(${menuId}, ui.menuIds) `;
            queryGroupByMenuName += interfaceNameSql;
            queryNotMenusIds += interfaceNameSql;
        }
        queryGroupByMenuName += ' GROUP BY ui.id ';
        let uifaceList: Array<UsersInterface> = await this.getRepository(UsersInterface).query(`${queryGroupByMenuName} union all ${queryNotMenusIds}`);
        return uifaceList || [];
    }

    async getUsersInterfaceTypeList() {
        let uifaceList =
            (await this.getRepository(UsersInterface)
                .createQueryBuilder('usersInterface')
                .groupBy('usersInterface.interfaceType')) || <UsersInterface[]>[];
        return uifaceList || [];
    }

    async saveOrUpdateUsersInterface(usersInterface: UsersInterface) {
        return await super.saveOrUpdateAny(UsersInterface, usersInterface);
    }
    async deletedUsersUsersInterface(id: number) {
        return await super.deletedAny(UsersInterface, id);
    }
}
