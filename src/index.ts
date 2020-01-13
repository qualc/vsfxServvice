import log4js from 'log4js';
import bodyParser from 'body-parser';
import server from 'vsfx';
import './config/configration';

import Middleware from './middleware';

const app = server();
app.beforeUse(Middleware.logger());
app.beforeUse(Middleware.typeorm());
app.beforeUse(Middleware.extendRes());
app.useIntercept('/manage', function(req, res, next) {
    Middleware.auth(req, res, next);
});

app.static('/static');
app.beforeUse(bodyParser.json());
app.catch(function(err, req, res, next) {
    res.sendStatus(500);
});

app.listen(7779, function() {
    console.log('启动成功');
});

declare global {
    namespace NodeJS {
        interface Global {
            config: {
                [key: string]: any;
            };
            logger: log4js.Logger;
        }
    }
}
