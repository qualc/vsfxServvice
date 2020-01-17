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
    errmsg: string;
    results: any;
}

const _globalRequestOpt = {
    protocol: 'http',
    path: '',
    port: 80,
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};
export default {
    _request: function request(options: Options, data?: any): Promise<any> {
        return new Promise(resolve => {
            try {
                let protocol = options.protocol || 'http',
                    formData = options.formData ? options.formData : null,
                    _protocolObj = protocol == 'http' ? http : https;
                delete options.protocol;
                delete options.formData;

                let req = _protocolObj.request(options, (res: any) => {
                    let { statusCode } = res,
                        contentType = res.headers['content-type'],
                        error: Error | null = null;
                    if (statusCode !== 200) {
                        error = new Error('请求失败。' + `状态码: ${statusCode} options:${JSON.stringify(options)}`);
                    }
                    if (error) {
                        res.resume();
                        resolve({
                            status: 10301,
                            errmsg: `request callback err: ${error.message}`,
                            results: {}
                        });
                        return;
                    }
                    let rawData = '';
                    res.setEncoding('utf8');
                    res.on('data', (chunk: string) => {
                        rawData += chunk;
                    });
                    res.on('end', () => {
                        try {
                            let parsedData = rawData;
                            if (/^(text|application)\/json/.test(contentType)) {
                                parsedData = JSON.parse(rawData);
                            }
                            resolve({
                                status: 1,
                                results: parsedData
                            });
                        } catch (e) {
                            resolve({
                                status: 1,
                                results: rawData
                            });
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
                    req.on('error', (e: Error) => {
                        req.abort();
                        resolve({
                            status: 10302,
                            errmsg: `request err: ${e.message}`
                        });
                    });
                }
            } catch (e) {
                resolve({
                    status: 10303,
                    errmsg: `promise err: ${JSON.stringify(e)}`
                });
            }
        });
    },
    proxy: async function get(interfaceUrl: string, opt: Options = {}) {
        let { hostname, port = 80, path } = url.parse(interfaceUrl);
        let _options = Object.assign({}, { hostname, port, path }, opt);
        return await this._request(_options);
    },
    proxyPost: async function post(interfaceUrl: string, data: Object, opt?: Options): Promise<RESULT> {
        try {
            let { hostname, port = 80, path } = url.parse(interfaceUrl);
            opt = opt || {};
            data = data || {};
            let postData = JSON.stringify(data);
            if (opt && opt.formData) {
                opt.headers = opt.formData.getHeaders();
            }
            let _options = Object.assign(
                {},
                _globalRequestOpt,
                {
                    hostname,
                    port,
                    path,
                    json: true,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                },
                opt
            );
            return await this._request(_options, postData);
        } catch (e) {
            return { errmsg: e.message, status: 0, results: {} };
        }
    }
};
