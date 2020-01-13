import { Service } from 'vsfx';
import { BaseService } from '../BaseService';
import { UsersRoleInterface } from './usersRole.d';
import { UsersRole } from '../../entity/usersRole';
@Service()
export class UsersRoleService extends BaseService implements UsersRoleInterface {
    /**
     * 获取所有分类列表
     *
     * @param {number} disabled
     * @memberof UsersRoleService
     */
    async findAllUsersRole(disabled: number): Promise<Array<UsersRole>> {
        let usersRole = this.getRepository(UsersRole).find() || [];
        return usersRole;
    }
    /**
     * 根据roleId查询菜单权限
     * @param roleId
     * @memberof UsersRoleService
     */
    async findUsersRoleEmpoMenuByRoleId(roleId: number): Promise<string> {
        let { menuIds } = await this.getRepository(UsersRole)
            .createQueryBuilder('ur')
            .select(['ur.menuIds menuIds'])
            .where('ur.id=:roleId', { roleId })
            .getRawOne();
        return menuIds;
    }
    /**
     * 根据roleId查询接口权限
     *
     * @author 天冰
     * @param {number} roleId
     * @returns {Promise<string>}
     * @memberof UsersRoleService
     */
    async findUsersRoleEmpoInterfaceByRoleId(roleId: number): Promise<string> {
        let { interfaceIds } = await this.getRepository(UsersRole)
            .createQueryBuilder('ur')
            .select(['ur.interfaceIds interfaceIds'])
            .where('ur.id=:roleId', { roleId })
            .getRawOne();
        return interfaceIds;
    }
    /**
     * 添加或保存文章
     *
     * @param {Article} article
     * @memberof UsersRoleService
     */
    async saveOrUpdateUsersRole(usersRole: UsersRole): Promise<string> {
        // let exe = await this.getRepository(UsersRole).save(usersRole);
        // return exe ? '操作成功' : '操作失败';
        return await super.saveOrUpdateAny(UsersRole, usersRole);
    }

    /**
     * 逻辑删除
     *
     * @param {(number | Article)}
     * @memberof UsersRoleService
     */
    async disabledUsersRole(id: number) {
        // let exe = await this.getRepository(UsersRole).updateById(id, { disabled: 0 });
        // return exe ? '禁用成功' : '禁用失败';
        return await super.disabledAny(UsersRole, id);
    }
    /**
     * 恢复逻辑删除
     *
     * @param {(number | Article)}
     * @memberof UsersRoleService
     */
    async publishUsersRole(id: number) {
        // let exe = await this.getRepository(UsersRole).updateById(id, { disabled: 1 });
        // return exe ? '发布成功' : '发布失败';
        return await super.publishAny(UsersRole, id);
    }

    /**
     * 物理删除
     *
     * @param {(number | Article)} any
     * @memberof UsersRoleService
     */
    async deletedUsersRole(id: number) {
        // let exe = await this.getRepository(UsersRole).removeById(id);
        // return exe ? '删除成功' : '删除失败';
        return await super.deletedAny(UsersRole, id);
    }
    /**
     * 赋值菜单权限
     *
     * @memberof UsersRoleService
     */
    async updateUsersGroupMenu(menuIds, roleId) {
        return await this.getRepository(UsersRole).query(`update users_role set menuIds='${menuIds}' where id=${roleId}`);
        // return await this.getRepository(UsersRole).update(roleId, { menuIds });
    }

    /**
     * 赋值接口权限
     *
     * @author 天冰
     * @param {any} interfaceIds
     * @param {any} roleId
     * @returns
     * @memberof UsersRoleService
     */
    async updateUsersGroupInterface(interfaceIds, roleId) {
        return await this.getRepository(UsersRole).query(`update users_role set interfaceIds='${interfaceIds}' where id=${roleId}`);
        // return await this.getRepository(UsersRole).update(roleId, { interfaceIds });
    }
}
