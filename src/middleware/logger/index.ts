import log4js from 'log4js';
import Config from './config';

log4js.configure(Config);

const logger = (global.logger = log4js.getLogger());

export default function() {
    return (req, res, next) => {
        const headers = req.headers['user-agent'];
        logger.info(`headers:${JSON.stringify(headers)},timestamp:${Date.now()}`);
        next();
    };
}
