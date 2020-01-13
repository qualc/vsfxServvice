import * as jwt from 'jsonwebtoken';
import * as RedisHelper from '../../lib/redis';
import logger from 'middleware/logger';

export default async function(req, res, next) {
    // 不用校验权限
    if (req.opts?.needLogin === false) {
        return next();
    }
    try {
        const status = await checkToken(req, res);
        if (status == 1) {
            next();
        } else {
            res.send({
                status: 998,
                errmsg: '登录失效'
            });
        }
    } catch (err) {
        global.logger.error(err.stack);
        res.send({
            status: 999,
            errmsg: '登录态异常,请重新登录'
        });
    }
}

function checkToken(req, res) {
    return new Promise(resolve => {
        let { headers } = req;
        const jwtConfig = global['config'].jwt;
        if (!headers.authorization) {
            global.logger.error('headers.authorization not found');
            resolve(false);
            return;
        }
        jwt.verify(headers.authorization, jwtConfig.secret, function(err, users) {
            if (err) {
                console.log('###');
                global.logger.error('token 解密失败:' + err.stack);
                resolve(false);
                return;
            }
            // 不用校验权限
            if (req.opts?.interceptors === false) {
                resolve(true);
                return;
            }
            // console.log(decoded);  interfaceList   menuList
            Promise.all([RedisHelper.getItem(`token:cache:${users.id}:interface`), RedisHelper.getItem(`token:cache:${users.id}:menu`)]).then(([interfaceListStr, menuList]) => {
                const interfaceList = Array.from(JSON.parse(<string>interfaceListStr));
                let _interceptor = interfaceList.some((item: any) => req.route && req.route.reg.test(item.interfaceUri));
                // url不在menu列表中
                if (!_interceptor) {
                    res.send({
                        status: 996,
                        errmsg: '暂无访问权限:' + req.url
                    });
                    return;
                }
                req.users = users;
                resolve(true);
            });
        });
    });
}
