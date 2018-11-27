
var log4js = require('log4js');
log4js.configure({
    appenders: {
        console: { type: 'console' },        
        sync: { type: 'file', filename: './logs/sync.log', maxLogSize: 50485760, compress: true }
    },
    categories: {
        default: { appenders: ['console'], level: 'info' },       
        sync: { appenders: [ 'sync' ], level: 'info'}
    }
});

module.exports = log4js;