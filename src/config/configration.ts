import wxApi from './wechat';

const config = {
    mysql: {
        host: '127.0.0.1',
        user: 'data',
        password: '123456',
        database: 'sf',
        port: 3306,
        acquireTimeout: 60 * 60 * 1000,
        synchronize: true,
        logging: true,
        entities: ['../entity/**/*.js']
    },
    jwt: {
        secret: 'tb_blog_secret_asdafadqwegasdcsada',
        expiresIn: 1000 * 60 * 5
    },
    wx: { appid: 'wx802cd44ddd552068', secret: '37eb38c3646474f649bfd4bc0ca10d7a' },
    wxApi
};

global.config = config;

export default config;
