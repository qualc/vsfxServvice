import Request from '../../lib/request';

export default function(type: String | Array<string> = 'default') {
    if (typeof type === 'string') {
        type = [type];
    }
    const proxys: any = {};
    (<[]>type).map(t => {
        switch (t) {
            case 'wx':
                class WxProxy extends Request {
                    constructor(props) {
                        super(props);
                    }
                    fail(e, resolve) {
                        resolve({
                            errcode: -1,
                            errmsg: e.message
                        });
                    }
                }
                const wxproxy = new WxProxy({
                    type: 'json'
                });
                proxys.wxProxy = wxproxy.proxy.bind(wxproxy);
                proxys.wxProxyPost = wxproxy.proxyPost.bind(wxproxy);
            default:
                const proxy = new Request();
                proxys.proxy = proxy.proxy.bind(proxy);
                proxys.proxyPost = proxy.proxyPost.bind(proxy);
        }
    });
    return (req, res, next) => {
        if (!req.proxy) {
            Object.keys(proxys).forEach(item => {
                req[item] = proxys[item];
            });
        }
        next();
    };
}
