import { Controller, Get, Post } from 'vsfx';
import { isEmpty, isNotEmpty, isFalse, isNotInteger } from '../../../lib/validate';
import { formatMenuMap } from '../../../lib/formatArray';
import { UsersMenuService } from '../../../service/users/usersMenu';

import { UsersMenu } from 'entity/usersMenu';

const usersMenuService = new UsersMenuService();
@Controller('/usersmenu')
export class usersController {
    /**
     * 获取登录用户列表
     * @param {*} req
     * @param {*} res
     */
    @Get('/getMenuList')
    async getMenuListByRoleId(req, res) {
        let roleId = (req.users || {}).usersRoleId;
        if (!roleId) {
            return res.sendError('获取用户信息异常，请重新登录', 998);
        }
        let results = formatMenuMap(await usersMenuService.getMenuListByRoleId(roleId));
        res.sendSuccess(results);
    }

    /**
     * 获取所有列表
     * @param {*} param0
     * @param {*} res
     * @param {*} next
     */
    @Get('/list')
    async getUsersMenuList({ query }, res, next) {
        let { menuName, format = 0, isMenu = null, parentId = null, disabled = 1 } = query;
        if (isNotEmpty(parentId) && isNotInteger(parentId)) {
            return res.sendError('parentId入参类型错误');
        }
        if (isNotInteger(disabled)) {
            return res.sendError('入参类型错误');
        }
        let menuList = await usersMenuService.getUsersMenuList({ menuName, parentId, isMenu, disabled });
        if (format) {
            menuList = formatMenuMap(menuList);
        }
        return res.sendSuccess(menuList);
    }
    @Get('/parentList')
    async getUsersMenuListByParentId({ query }, res, next) {
        let { parentId = 0 } = query;
        if (isNotInteger(parentId)) {
            return res.sendError('parentId入参类型错误');
        }
        let menuList = await usersMenuService.getUsersMenuListByParentId(parentId);
        return res.sendSuccess(menuList);
    }
    /**
     * 添加或者是修改菜单
     */
    @Post('/saveOrUpdate')
    async saveOrUpdateUsersMenu({ body, __loginUM }, res, next) {
        let { id, parentId, menuKey, menuName, menuUri, isShow = 1, descriptor } = body;

        if (isEmpty(parentId)) {
            return res.sendError('请关联父级菜单');
        }
        if (isNotInteger(parentId) || isNotInteger(isShow)) {
            return res.sendError('入参类型错误');
        }
        if (isEmpty(menuName)) {
            return res.sendError('请输入菜单名称');
        }
        if (parentId != 0 && parentId == id) {
            return res.sendError('不能选自身作为父级菜单');
        }
        // if (menuUri && isNotHttp(menuUri)) {
        //     return res.sendError('菜单地址格式不正确,https?://xxx.xxx');
        // }
        let uMenu = <UsersMenu>{};
        uMenu.parentId = parentId;
        uMenu.menuName = menuName;
        uMenu.menuUri = menuUri;
        uMenu.isShow = isShow;
        uMenu.descriptor = descriptor;
        if (id) {
            uMenu.id = id;
        }
        let results = await usersMenuService.saveOrUpdateUsersMenu(uMenu);
        return res.sendSuccess(results);
    }

    /**
     * 发布  未用
     * 回复逻辑删除，修改publishDate为当前时间
     *
     * @param {any} req
     * @param {any} res
     * @param {any} next
     * @returns
     * @memberof SoftDownController
     */
    @Get('/publish/:id')
    async publishUsersMenu({ __loginUM, params }, res, next) {
        let { id } = params;
        if (isNotInteger(+id)) {
            return res.sendError('入参类型错误');
        }

        if (isFalse(id)) {
            return res.sendError('id不能为空');
        }
        let results = await usersMenuService.publishAny(__loginUM, id);
        return res.sendSuccess(results);
    }

    /**
     * 逻辑删除
     * id 详情id
     *
     * @param {any} req
     * @param {any} res
     * @param {any} next
     * @returns
     * @memberof SoftDownController
     */
    @Get('/disabled/:id')
    async disabledUsersMenu({ params, __loginUM }, res, next) {
        let { id } = params;
        if (isNotInteger(+id)) {
            return res.sendError('入参类型错误');
        }
        if (isFalse(id)) {
            return res.sendError('id不能为空');
        }
        let usersMenus = await usersMenuService.getUsersMenuList({ parentId: id });
        if (usersMenus.length > 0) {
            return res.sendError('当前菜单项存在子菜单，请先重新为子菜单分配菜单项后在删除');
        }
        let results = await usersMenuService.disabledAny(__loginUM, id);
        return res.sendSuccess(results);
    }

    /**
     * 物理删除  未用
     * id 详情id
     *
     * @param {any} req
     * @param {any} res
     * @param {any} next
     * @returns
     * @memberof SoftDownController
     */
    @Get('/delete/:id')
    async deleteUsersMenu({ params }, res, next) {
        let { id } = params;
        if (isNotInteger(+id)) {
            return res.sendError('入参类型错误');
        }
        if (isFalse(id)) {
            return res.sendError('id不能为空');
        }
        let usersMenus = await usersMenuService.getUsersMenuList({ parentId: +id });
        if (usersMenus.length > 0) {
            return res.sendError('当前菜单项存在子菜单，请先重新为子菜单分配菜单项后在删除');
        }
        let results = await usersMenuService.deleteUsersMenu(id);
        return res.sendSuccess(results);
    }

    /**
     * 菜单排序
     *
     * @param {any} { body, __loginUM }
     * @param {any} res
     * @param {any} next
     * @memberof UserMenuController
     */
    @Post('/savesort')
    async saveSortUsersMenu({ body, __loginUM }, res, next) {
        let { arr } = body;
        if (!Array.isArray(arr)) {
            return res.sendError('入参arr类型错误');
        }
        if (!/^\d+\,\d+(\|\d+\,\d+)?/.test(arr.join('|'))) {
            return res.sendError('入参格式错误,[[int]]');
        }
        let results = await usersMenuService.saveSortUsersMenu(arr);
        return res.sendSuccess(results);
    }
}
