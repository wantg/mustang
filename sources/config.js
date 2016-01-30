var moment = require('moment');
var winston = require('winston');

var logger = new (winston.Logger)({
    level: 'debug',
    transports: [
        // new (winston.transports.Console)({ json: false, timestamp: true }),
        new winston.transports.File({
            timestamp: function() {
                return '['+moment().format('YYYY-MM-DD HH:mm:ss')+']';
            },
            filename: __dirname + '/logs/runtime-'+moment().format('YYYY-MM-DD')+'.log',
            json: false
        })
    ],
    exceptionHandlers: [
        // new (winston.transports.Console)({ json: false, timestamp: true }),
        new winston.transports.File({
            timestamp: function() {
                return '['+moment().format('YYYY-MM-DD HH:mm:ss')+']';
            },
            filename: __dirname + '/logs/exceptions-'+moment().format('YYYY-MM-DD')+'.log',
            json: false
        })
    ],
    exitOnError: false
});

module.exports = {
    logger: logger,
    port: 8084,
};
