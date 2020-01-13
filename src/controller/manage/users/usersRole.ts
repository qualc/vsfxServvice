import { Controller, Get, Post } from 'vsfx';
import { isNotInteger, isEmpty, isFalse, isInteger, isNotEmpty } from '../../../lib/validate';
import { UsersRoleService } from '../../../service/users/usersRole';
import { UsersRole } from '../../../entity/usersRole';

/**
 * 文章controller
 *
 * @export
 * @class ArticleController
 */
const usersRoleService = new UsersRoleService();
@Controller('/usersrole')
export class UsersRoleController {
    /**
     * 获取role列表
     *
     * @param {any} { query }
     * @param {any} res
     * @memberof UsersRoleController
     */
    @Get('/findAll')
    async findAllUsersRole({ body }, res) {
        let { desabled = 1 } = body;
        if (isNotInteger(desabled)) {
            return res.sendError('入参类型异常');
        }
        res.sendSuccess(await usersRoleService.findAllUsersRole(desabled));
    }
    @Get('/getMenuIdsByRoleId')
    async findUsersRoleEmpoMenuByRoleId(req, res) {
        let { roleId } = req.query;
        if (isNotInteger(roleId)) {
            return res.sendError('入参类型异常');
        }
        if (!roleId) {
            return res.sendError('roleId不能为空');
        }
        let menuIdStr = await usersRoleService.findUsersRoleEmpoMenuByRoleId(roleId);
        let menuIds = <Array<number>>[];
        (menuIdStr || '').split(',').forEach(item => {
            if (/^\d+$/.test(item)) {
                menuIds.push(+item);
            }
        });
        res.sendSuccess(menuIds);
    }
    @Get('/getInterfaceIdsByRoleId')
    async findUsersRoleEmpoInterfaceByRoleId(req, res) {
        let { roleId } = req.query;
        if (isNotInteger(roleId)) {
            return res.sendError('入参类型异常');
        }
        if (!roleId) {
            return res.sendError('roleId不能为空');
        }
        let interfaceIdsStr = await usersRoleService.findUsersRoleEmpoInterfaceByRoleId(roleId);
        let interfaceIds = <Array<number>>[];
        (interfaceIdsStr || '').split(',').forEach(item => {
            if (/^\d+$/.test(item)) {
                interfaceIds.push(+item);
            }
        });
        res.sendSuccess(interfaceIds);
    }
    @Post('/saveOrUpdate')
    // @Validation(ArticleCreateDto)
    async saveUsersRoleInfo({ body, users }, res) {
        var usersRole = <UsersRole>{};
        if (isNotEmpty(body.id)) {
            if (isInteger(body.id)) {
                usersRole.id = body.id;
            } else {
                return res.sendError('id入参类型异常');
            }
        }
        if (isEmpty(body.name) || body.name.length > 25) {
            return res.sendError('标题长度必须为1-25个字符');
        }
        usersRole.name = body.name;
        usersRole.interfaceIds = '';
        usersRole.menuIds = '';
        res.sendSuccess(await usersRoleService.saveOrUpdateUsersRole(usersRole));
    }

    @Get('/delete')
    async deleteUsersRole({ query }, res) {
        let { id } = query;
        if (isNotInteger(id)) {
            return res.sendError('入参类型错误');
        }
        if (isFalse(id)) {
            return res.sendError('id不能为空');
        }
        res.sendSuccess(await usersRoleService.deletedUsersRole(id));
    }

    /**
     * 赋值菜单权限
     *
     * @param {any} req
     * @param {any} res
     * @param {any} next
     * @memberof UsersRoleController
     */
    @Post('/updateMenu')
    async updateMenuByUsersRoleId({ body, __loginUM }, res, next) {
        let { id, ids: menuIds = '' } = body;
        if (isFalse(id)) {
            return res.sendError('id不能为空');
        }
        if (isNotInteger(id)) {
            return res.sendError('入参类型错误');
        }
        menuIds = menuIds.join(',');
        if (menuIds && !/^\d+(?=)(,\d+)*$/.test(menuIds)) {
            return res.sendError('menuIds格式不正确，id只能是int');
        }
        let results = await usersRoleService.updateUsersGroupMenu(menuIds, id);
        return res.sendSuccess(results);
    }
    @Post('/updateInterface')
    async updateInterfaceByUsersRoleId({ body, __loginUM }, res, next) {
        let { id, ids: interfaceIds = '' } = body;
        if (isFalse(id)) {
            return res.sendError('id不能为空');
        }
        if (isNotInteger(id)) {
            return res.sendError('入参类型错误');
        }
        interfaceIds = interfaceIds.join(',');
        if (interfaceIds && !/^\d+(?=)(,\d+)*$/.test(interfaceIds)) {
            return res.sendError('interfaceIds格式不正确，id只能是int');
        }
        let results = await usersRoleService.updateUsersGroupInterface(interfaceIds, id);
        return res.sendSuccess(results);
    }
}
