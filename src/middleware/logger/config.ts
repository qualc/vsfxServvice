export default {
    appenders: {
        vsfx: {
            type: 'dateFile',
            filename: 'logs/vsfx',
            pattern: '-yyyy-MM-dd.log',
            alwaysIncludePattern: true,
            keepFileExt: true,
            category: 'vsfx',
            maxLogSize: 10485760,
            numBackups: 3
        },
        errorFile: {
            type: 'file',
            filename: 'logs/errors.log'
        },
        errors: {
            type: 'logLevelFilter',
            level: 'ERROR',
            appender: 'errorFile'
        }
    },
    categories: {
        default: {
            appenders: ['vsfx', 'errors'],
            level: 'DEBUG'
        },
        vsfx: {
            appenders: ['vsfx', 'errors'],
            level: 'DEBUG'
        }
    }
};
