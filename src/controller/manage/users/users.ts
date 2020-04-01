import * as jwt from 'jsonwebtoken';
import { Controller, Get, Post, Interceptors } from 'vsfx';
import { isNotInteger, isEmpty, isFalse, isNotEmpty, isArray, isEmail, isPhone } from '../../../lib/validate';
import { Format } from '../../../lib/format';
import * as RedisHelper from '../../../lib/redis';
import Crypto from '../../../lib/crypto';
// import { randomBytes } from 'crypto';
import { UsersService } from '../../../service/users/users';
import { UsersRoleService } from '../../../service/users/usersRole';
import { UsersMenuService } from '../../../service/users/usersMenu';
import { UsersInterfaceService } from '../../../service/users/usersInterface';
import { ArticleService } from '../../../service/article/article';
import { Users } from '../../../entity/users';
import { UsersRole } from '../../../entity/usersRole';

let usersService = new UsersService();
let articleService = new ArticleService();
let usersRoleService = new UsersRoleService();
let usersMenuService = new UsersMenuService();
let usersInterfaceService = new UsersInterfaceService();

@Controller('/users')
export class UsersController {
    /**
     * 登录
     *
     * @param {any} req
     * @param {any} res
     * @returns
     * @memberof usersController
     */
    @Post('/login', { needLogin: false, interceptors: false })
    async login(req, res) {
        this.loginToAccount(req, res);
        return;
        var { email, password: upass } = req.body;
        if (isEmpty(email)) {
            return res.sendError('邮箱地址不能为空');
        }
        var users = await usersService.getUsersLogin({ email });
        if (users.id) {
            let { password } = users;
            password = Crypto.aesDecryptPipe(password);
            if (password != upass) {
                return res.sendError('用户名或密码不正确');
            }
            try {
                let [menuList = [], interfaceList] = await Promise.all([usersMenuService.getMenuListByRoleId(users.usersRoleId), usersInterfaceService.getInterfaceListByRoleId(users.usersRoleId)]);
                req.users = users;
                req.users.menuList = menuList;
                req.users.interfaceList = interfaceList;
            } catch (e) {
                console.log('登录获取权限失败:' + e.message);
            }
        } else {
            return res.sendError('用户名不存在');
        }
        console.log('登陆成功', JSON.stringify(req.users));
        res.sendSuccess({ nickName: users.nickName });
    }
    @Post('/loginToAccount', { needLogin: false, interceptors: false })
    // @Interceptors(false)
    async loginToAccount(req, res) {
        try {
            var { email, password: upass } = req.body;
            if (isEmpty(email)) {
                return res.sendError('邮箱地址不能为空');
            }
            var users = await usersService.getUsersLogin({ email });

            if (users.id) {
                let { password } = users;
                password = Crypto.aesDecryptPipe(password);
                if (password != upass) {
                    return res.sendError('用户名或密码不正确');
                }
                try {
                    const jwtConfig = global['config'].jwt;
                    const token = jwt.sign(JSON.parse(JSON.stringify(users)), jwtConfig.secret, {
                        expiresIn: jwtConfig.expiresIn
                    });
                    let [menuList = [], interfaceList] = await Promise.all([usersMenuService.getMenuListByRoleId(users.usersRoleId), usersInterfaceService.getInterfaceListByRoleId(users.usersRoleId)]);

                    // TODO: 临时处理
                    // interfaceList.forEach((item: any) => {
                    //     console.log(pathToRegexp(item.interfaceUri, [], { end: true }));
                    //     item.interfaceUriReg = pathToRegexp(item.interfaceUri, [], { end: true }).toString();
                    //     console.log(item);
                    // });
                    RedisHelper.setItem(`token:cache:${users.id}:interface`, interfaceList);
                    RedisHelper.setItem(`token:cache:${users.id}:menu`, menuList);

                    res.sendSuccess({ token });
                } catch (e) {
                    console.log('登录获取权限失败:  ' + e);
                    res.sendError('登录获取权限失败:' + e.message);
                }
            } else {
                return res.sendError('用户名不存在');
            }
        } catch (e) {
            console.log(e);
            res.sendError(e);
        }
        // res.sendSuccess({ nickName: users.nickName });
    }
    /**
     * 退出登录
     *
     * @author 天冰
     * @param {any} req
     * @param {any} res
     * @memberof UsersController
     */
    @Get('/quitLogin')
    async quitUsersLogin(req, res, next) {
        delete req.users;
        delete req.users.menuList;
        delete req.users.interfaceList;
        res.sendSuccess('退出成功');
    }

    /**
     * 获取所有用户
     *
     * @returns
     * @memberof usersController
     */
    @Get('/findAll')
    async findAllUsers(req, res) {
        res.sendSuccess(await usersService.findAllUsers());
    }

    /**
     * 根据ID获取
     *
     * @author 天冰
     * @param {any} { query }
     * @param {any} res
     * @returns
     * @memberof UsersController
     */
    @Get('/getOneById')
    async getOneById({ query }, res) {
        let { id } = query;
        if (isNotInteger(id)) {
            return res.sendError('入参格式不正确');
        }
        let users: Users = await usersService.getUsersById(id);
        if (users.password) {
            users.password = Crypto.aesDecryptPipe(users.password);
        }
        return res.sendSuccess(users);
    }

    /**
     * 获取登录用户信息
     *
     * @author 天冰
     * @param {any} req
     * @param {any} res
     * @param {any} next
     * @memberof UsersController
     */
    @Get('/getOneByLogin')
    async getOneByLogin(req, res, next) {
        let { id } = req.users;
        let users: Users = await usersService.getUsersById(id);
        if (users.password) {
            users.password = Crypto.aesDecryptPipe(users.password);
        }
        return res.sendSuccess(users);
    }

    /**
     * 保存用户
     *
     * @param {any} { modelData }
     * @returns
     * @memberof usersController
     */
    @Post('/saveOrUpdate')
    // @Validation(UsersCreateDto)
    async saveOrUpdate({ body }, res, next) {
        var { id = 0, email, phone = '', userName = '', password, nickName, roleId, headimg = '' } = body;
        if (isEmpty(email)) {
            return res.sendError('邮箱不能为空');
        }
        if (!isEmail(email)) {
            return res.sendError('邮箱格式不正确');
        }
        if (isEmpty(nickName)) {
            return res.sendError('昵称不能为空');
        }
        if (!/^[0-9a-zA-Z\.\s\u4e00-\u9fa5]{2,20}$/.test(nickName)) {
            return res.sendError('用户昵称为长度 2 到 20 个字符');
        }
        if (isEmpty(password)) {
            return res.sendError('密码不能为空');
        }
        if (!/^[\w\.\s\!\@\#\$\%\^\.\,\/\?\>\<\(\)\-\_\=\+\`\~]{6,26}$/.test(password)) {
            return res.sendError('密码必须为长度6 到 26 个字符');
        }
        if (isNotInteger(roleId)) {
            return res.sendError('请选择正确的用户组');
        }
        if (isNotEmpty(userName) && !/^[a-zA-Z\.\s\u4e00-\u9fa5]{2,20}$/.test(userName)) {
            return res.sendError('用户名为长度 2 到 20 个字符');
        }
        if (isNotEmpty(phone) && !/^1\d{10}$/.test(phone)) {
            return res.sendError('请填写11位长度的手机号码');
        }
        let usersList: Array<Users> = await usersService.getUsersExist({
            phone,
            email
        });

        let hasError = '';
        if (id) {
            let operUsers: Users = await usersService.getUsersById(id);
            // usersList.forEach(item => {
            //     if (hasError) return;
            //     console.log('###1')
            //     if (item.id !== operUsers.id) {
            //         console.log('###2')
            //         console.log(operUsers)
            //         console.log(item)
            //         if (operUsers.email == item.email) {
            //             console.log('##3')
            //             hasError = '邮箱已存在';
            //         } else if (operUsers.phone == item.email) {
            //             hasError = '联系方式已存在';
            //         }
            //     }
            // })
        }
        usersList.forEach(item => {
            if (hasError) return;
            if (id != item.id && email == item.email) {
                hasError = '邮箱已存在';
            } else if (id != item.id && phone == item.email) {
                hasError = '联系方式已存在';
            }
            // if (id && id == item.id && hasError) {
            //     hasError = ''
            // }
        });
        if (hasError) {
            return res.sendError(hasError);
        }
        let users = <Users>{};
        users.nickName = nickName || email;
        users.email = email;
        users.phone = phone;
        users.userName = userName;
        users.usersRoleId = roleId;
        users.createDate = Format.date(new Date(), 'yyyy-MM-dd hh:mm:ss');
        users.password = Crypto.aesEncryptPipe(password);
        users.headimg = headimg;
        // users.identity = randomBytes(15).toString('hex');
        users.identity = new Buffer(email).toString('base64');
        if (id) {
            users.id = id;
        }
        res.sendSuccess(await usersService.saveOrUpdateUser(users));
    }

    /**
     * 修改登录用户信息
     *
     * @author 天冰
     * @param {any} req
     * @param {any} res
     * @param {any} next
     * @memberof UsersController
     */
    @Post('/updateLoginUsers')
    async updateLoginUsers(req, res, next) {
        let { id } = req.users;
        req.body.id = id;
        return this.saveOrUpdate(req, res, next);
    }
    /**
     * 修改用户
     *
     * @param {any} { modelData }
     * @returns
     * @memberof usersController
     */
    @Post('/update')
    // @Validation(UsersUpdateDto)
    async updateUsers({ body }, res) {
        var users = new Users();
        Object.assign(users, body);
        res.sendSuccess(await usersService.saveOrUpdateUser(users));
    }

    /**
     * 禁用某用户
     *
     * @memberof usersController
     */
    @Get('/disabled/:id')
    async disabledUserById({ params: { id } }, res) {
        if (isFalse(id)) {
            return res.sendError('id不能为空');
        }
        if (isNotInteger(+id)) {
            return res.sendError('入参类型错误');
        }
        res.sendSuccess(await usersService.disabledUsers(id));
    }

    /**
     * 启用某用户
     *
     * @memberof usersController
     */
    @Get('/publish/:id')
    async publishUserById({ params: { id } }, res) {
        if (isFalse(id)) {
            return res.sendError('id不能为空');
        }
        if (isNotInteger(+id)) {
            return res.sendError('入参类型错误');
        }
        res.sendSuccess(await usersService.publishUsers(id));
    }

    /**
     * 删除某用户
     *
     * @param {any} { params: { id } }
     * @param {any} res
     * @returns
     * @memberof usersController
     */
    @Get('/delete/:id')
    async deleteUserById({ params: { id }, users }, res) {
        // try {
        //     if (users.usersRoleId != 1) {
        //         return res.sendError('没有权限', 997);
        //     }
        // } catch (e) {
        //     return res.sendError('没有权限', 997);
        // }
        if (isFalse(id)) {
            return res.sendError('id不能为空');
        }
        if (isNotInteger(+id)) {
            return res.sendError('入参类型错误');
        }
        await articleService.deletedArticlesByUsersId(id);
        res.sendSuccess(await usersService.deletedUsers(id));
    }
}
