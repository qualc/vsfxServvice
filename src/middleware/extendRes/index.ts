export default function() {
    return (req, res, next) => {
        res.sendError = (errmsg = '接口返回异常', status = 0, results = {}) => {
            global.logger.error(errmsg);
            res.send({
                status,
                errmsg
            });
        };
        res.sendSuccess = (results = '操作成功', status = 1, errmsg = '') => {
            global.logger.info(JSON.stringify(results));
            res.send({
                errmsg,
                status,
                results
            });
        };
        next();
    };
}
