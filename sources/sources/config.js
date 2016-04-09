'use strict';

var os      = require('os');
var path    = require('path');
var fs      = require('fs');
var moment  = require('moment');
var winston = require('winston');

var logPath = __dirname+path.sep+'logs';
if (os.platform() != 'darwin') {
    logPath = path.dirname(process.execPath)+path.sep+'logs';
}

if(!fs.existsSync(logPath)){
    fs.mkdirSync(logPath);
}

var logger = new (winston.Logger)({
    level: 'debug',
    transports: [
        // new (winston.transports.Console)({ json: false, timestamp: true }),
        new winston.transports.File({
            timestamp: function() {
                return '['+moment().format('YYYY-MM-DD HH:mm:ss')+']';
            },
            filename: logPath+path.sep+'runtime-'+moment().format('YYYY-MM-DD')+'.log',
            json: false
        })
    ],
    exceptionHandlers: [
        // new (winston.transports.Console)({ json: false, timestamp: true }),
        new winston.transports.File({
            timestamp: function() {
                return '['+moment().format('YYYY-MM-DD HH:mm:ss')+']';
            },
            filename: logPath+path.sep+'exceptions-'+moment().format('YYYY-MM-DD')+'.log',
            json: false
        })
    ],
    exitOnError: false
});

module.exports = {
    logger: logger,
    logPath: logPath,
    port: 8084,
};
