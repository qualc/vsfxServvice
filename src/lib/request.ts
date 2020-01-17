import http from 'http';
import https from 'https';
import url from 'url';

// 默认主机最大的socket 数量
http.globalAgent.maxSockets = 1000;
https.globalAgent.maxSockets = 1000;

interface Options {
    protocol?: string;
    path?: string;
    port?: number;
    method?: string;
    headers?: any;
    hostname?: string;
    formData?: any;
}
interface RESULT {
    status: number;
    errmsg?: string;
    results?: any;
}

export default class Proxy {
    _globalRequestOpt = {};
    constructor(params = {}) {
        this._globalRequestOpt = Object.assign(
            {
                protocol: 'http',
                path: '',
                port: 80,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            },
            params
        );
    }
    fail(e, resolve) {
        resolve({
            status: 0,
            errmsg: e.message
        });
    }
    request(interfaceUrl: string, data?: any, opt?: any): Promise<RESULT> {
        return new Promise(resolve => {
            try {
                let { protocol = 'http:', hostname, port = 80, path } = url.parse(interfaceUrl);
                const options = Object.assign(this._globalRequestOpt, { protocol, hostname, port, path }, opt || {});
                global.logger.info(`begin request api: ${JSON.stringify(options)} ${JSON.stringify(data)}`);

                const { type, formData = null } = options,
                    _protocolObj = protocol == 'http:' ? http : https;

                delete options.protocol;
                delete options.formData;
                let req = _protocolObj.request(options, (res: any) => {
                    let { statusCode } = res,
                        contentType = res.headers['content-type'],
                        error: Error | null = null;
                    if (statusCode !== 200) {
                        error = new Error(`status code: ${statusCode} options:${JSON.stringify(options)}`);
                    }
                    if (error) {
                        res.resume();
                        throw error;
                    }
                    let rawData = '';
                    res.setEncoding('utf8');
                    res.on('data', (chunk: string) => {
                        rawData += chunk;
                    });
                    res.on('end', () => {
                        try {
                            let parsedData: any = rawData;
                            if (/^(text|application)\/json/.test(contentType) || type == 'json') {
                                parsedData = JSON.parse(rawData);
                            }
                            resolve(parsedData);
                        } catch (e) {
                            let parsedData: any = rawData;
                            resolve(parsedData);
                        }
                    });
                });
                if (formData) {
                    formData.pipe(req);
                } else {
                    if (data) {
                        req.write(data);
                    }
                    req.end();
                }
                req.on('error', (e: Error) => {
                    req.abort();
                    throw e;
                });
            } catch (e) {
                this.fail(e, resolve);
                global.logger.error(e.stack);
            }
        });
    }
    async proxy(interfaceUrl: string) {
        return await this.request(interfaceUrl);
    }
    async proxyPost(interfaceUrl: string, data: Object, opt?: Options): Promise<RESULT> {
        try {
            let { hostname, port = 80, path } = url.parse(interfaceUrl);
            opt = opt || {};
            data = data || {};
            let postData = JSON.stringify(data);
            if (opt && opt.formData) {
                opt.headers = opt.formData.getHeaders();
            }
            return await this.request(interfaceUrl, postData, opt);
        } catch (e) {
            return { errmsg: e.message, status: 0, results: {} };
        }
    }
}
