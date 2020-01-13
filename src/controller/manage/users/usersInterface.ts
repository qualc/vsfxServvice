import { Controller, Service, Get, Post } from 'vsfx';
import { isEmpty, isFalse, isNotInteger } from '../../../lib/validate';
import { formatInterfaceMap } from '../../../lib/formatArray';
import { UsersInterfaceService } from '../../../service/users/usersInterface';
import { UsersInterface } from '../../../entity/usersInterface';

let usersInterfaceService = new UsersInterfaceService();

@Controller('/usersinterface')
export class UsersInterfaceController {
    /**
     * 获取接口列表
     *
     * @param {any} { body }
     * @param {any} res
     * @returns
     * @memberof UsersInterfaceController
     */
    @Get('/list')
    async getUserInterfaceList({ query }, res) {
        let { interfaceName, menuId, format = 0, disabled = 1 } = query;
        if (isNotInteger(disabled)) {
            return res.sendError('入参类型错误');
        }
        // if (isNotInteger(menuId)) {
        //     return res.sendError('menuId必须是int类型');
        // }
        let interfaceList = await usersInterfaceService.getUsersInterfaceList({ disabled, interfaceName, menuId });
        if (format) {
            interfaceList = formatInterfaceMap(interfaceList);
        }
        // let interfaceObj = formatInterfaceMap(interfaceList);
        res.sendSuccess(interfaceList);
    }

    @Get('/interfacetype')
    async getInterfaceTypeList(req, res) {
        res.sendSuccess(await usersInterfaceService.getUsersInterfaceTypeList());
    }

    /**
     * 新增或者修改接口信息
     *
     * @param {any} req
     * @param {any} res
     * @param {any} next
     * @memberof UsersController
     */
    @Post('/saveOrUpdate')
    async saveOrUpdateUsers({ body }, res, next) {
        let { id = 0, menuIds = ['0'], interfaceName, interfaceUri, interfaceType, descriptor, disabled = 1 } = body;
        if (isNotInteger(id) || isNotInteger(disabled)) {
            return res.sendError('入参类型错误');
        }
        if (isEmpty(interfaceName)) {
            return res.sendError('接口名称不能为空');
        }
        if (interfaceName.length > 50) {
            return res.sendError('接口名称不能超过50个字符');
        }
        if (isEmpty(interfaceUri)) {
            return res.sendError('接口地址不能为空');
        }
        if (interfaceUri.length > 150) {
            return res.sendError('接口地址不能超过50个字符');
        }
        if (isEmpty(interfaceType)) {
            return res.sendError('所属模块不能为空');
        }
        if (interfaceType.length > 50) {
            return res.sendError('所属模块不能超过50个字符');
        }

        if (isEmpty(descriptor)) {
            descriptor = interfaceName;
        } else if (descriptor && descriptor > 100) {
            return res.sendError('接口描述不能超过100个字符');
        }
        if (!Array.isArray(menuIds)) menuIds = [menuIds];
        menuIds = menuIds.join(',');
        if (menuIds && !/^\d+(?=)(,\d+)*$/.test(menuIds)) {
            return res.sendError('menuIds格式不正确，id只能是int');
        }
        // let param = [menuIds, interfaceName, interfaceUri, interfaceType, descriptor, disabled, __loginUM]
        // if (!id || id == '0') {
        //     param.push(__loginUM);
        // }
        let uiface = <UsersInterface>{};
        uiface.id = id;
        uiface.interfaceName = interfaceName;
        uiface.interfaceType = interfaceType;
        uiface.menuIds = menuIds;
        uiface.interfaceUri = interfaceUri;
        uiface.descriptor = descriptor;
        uiface.disabled = disabled;
        let results = await usersInterfaceService.saveOrUpdateUsersInterface(uiface);
        return res.sendSuccess(results);
    }
    /**
     * 物理删除
     * id 详情id
     *
     * @param {any} req
     * @param {any} res
     * @param {any} next
     * @returns
     * @memberof SoftDownController
     */
    @Get('/delete/:id')
    async deleteUsersInterface({ params }, res, next) {
        let { id } = params;
        if (isNotInteger(+id)) {
            return res.sendError('入参类型错误');
        }

        if (isFalse(id)) {
            return res.sendError('id不能为空');
        }
        let results = await usersInterfaceService.deletedUsersUsersInterface(id);
        return res.sendSuccess(results);
    }
}
