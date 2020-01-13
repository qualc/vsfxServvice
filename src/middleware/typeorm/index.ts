const _config = (global['config'] || {}).mysql;
require('reflect-metadata');

const typeorm = require('typeorm');
const path = require('path');

export default function() {
    const optTypeOrm = {
        type: 'mysql',
        host: _config.host,
        username: _config.user,
        password: _config.password,
        database: _config.database,
        port: _config.port,
        acquireTimeout: _config.acquireTimeout,
        synchronize: _config.synchronize,
        logging: _config.logging,
        entities: [path.join(__dirname, '../../entity/*.js')]
    };
    let connection = null;
    typeorm
        .createConnection(optTypeOrm)
        .then(connec => {
            connection = connec;
        })
        .catch(e => {
            console.log(e);
        });
    return async (req, res, next) => {
        if (!connection) {
            try {
                connection = await typeorm.createConnection(optTypeOrm);
            } catch (err) {
                console.log(err);
            }
        }
        req.connection = connection;
        next();
    };
}
