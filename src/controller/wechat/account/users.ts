import { Controller, Get, Post } from 'vsfx';
import { isNotInteger, isEmpty, isFalse, isNotEmpty, isInteger } from '../../../lib/validate';

import { WXUsersService } from '../../../service/wechat/users';
import * as RedisHelper from '../../../lib/redis';
import WXUsers from '../../../entity/WXUsers';

const wxUsersService = new WXUsersService();

@Controller('/users')
export class ArticleTypeController {
    @Get('/info')
    async getUsersInfo(req, res, next) {
        let users: WXUsers = await RedisHelper.getItem('wx:users');
        if (users) {
            return res.sendSuccess(users);
        }
        users = await wxUsersService.getUsersByOpenId(req.users.openid);
        RedisHelper.setItem('wx:users', users, 1000 * 60 * 60 * 48);
        return res.sendSuccess(users);
    }
}
