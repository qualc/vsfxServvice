import querystring from 'querystring';
import * as jwt from 'jsonwebtoken';
import { Controller, Get, Post } from 'vsfx';
import { WXUsersService } from '../../service/wechat/users';
import * as RedisHelper from '../../lib/redis';

const wxUsersService = new WXUsersService();

@Controller()
export class WeChatController {
    @Post('/login', {
        needLogin: false
    })
    async wxUsersLogin(req, res, next) {
        try {
            const { appid, secret } = global.config.wx,
                { code: js_code } = req.body,
                grant_type = 'authorization_code';

            let key = '',
                token = '',
                expiresIn = 1000 * 60 * 60 * 48;
            if (req.users?.openid) {
                key = `wx:session_key:${req.users?.openid}`;
            }
            if (key) {
                token = await RedisHelper.getItem(key);
            } else {
                const results = await req.wxProxy(`${global.config.wxApi.code2Session}?${querystring.stringify({ appid, secret, js_code, grant_type })}`);

                const jwtConfig = global['config'].jwt;
                token = jwt.sign(JSON.parse(JSON.stringify(results)), jwtConfig.secret, {
                    expiresIn
                });
                RedisHelper.setItem(key, token, expiresIn);
                wxUsersService.insertWXUsers(results);
            }

            res.sendSuccess({ token });
        } catch (e) {
            res.sendError(e.stack);
        }
    }
}
