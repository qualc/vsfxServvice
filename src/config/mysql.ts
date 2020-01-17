const config = {
    mysql: {
        host: '127.0.0.1',
        user: 'data',
        password: '123456',
        database: 'sf',
        port: 3306,
        acquireTimeout: 60 * 60 * 1000,
        synchronize: false,
        logging: true,
        entities: ['../entity/**/*.js']
    },
    jwt: {
        secret: 'tb_blog_secret_asdafadqwegasdcsada',
        expiresIn: 1000 * 60 * 5
    }
};
