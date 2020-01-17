import * as jwt from 'jsonwebtoken';

export default async function(req, res, next) {
    try {
        const status = await checkToken(req, res);
        if (status == 1) {
            next();
        } else if (req.opts?.needLogin === false) {
            return next();
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
                global.logger.error('token 解密失败:' + err.stack);
                resolve(false);
                return;
            }
            // 不用校验权限
            if (req.opts?.interceptors === false) {
                resolve(true);
                return;
            }
            req.users = users;

            resolve(true);
        });
    });
}
