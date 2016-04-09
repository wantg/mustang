/* jshint esversion: 6 */
/* jshint node: true */
'use strict';

var url = require('url');
var http = require('http');
var fs = require('fs');
var proxy = require('proxy');
var config = require('./config');
var logger = config.logger;

console.log('log in ' + config.logPath);

const server = proxy(http.createServer());
var proxyRequestHandler = server._events.request;
delete(server._events.request);

server.localFiles = {};

function writeFile(filePath, position, response) {
    fs.stat(filePath, function(error, stats) {
        fs.open(filePath, 'r', function(error, fd) {
            var buffer = new Buffer(4096);

            fs.read(fd, buffer, 0, buffer.length, position, function(error, bytesRead, buffer) {
                response.write(buffer);
                // var data = buffer.toString('utf8', 0, buffer.length);

                console.log('load local file');
                fs.close(fd);
                if (bytesRead > 0) {
                    writeFile(filePath, position + 4096, response);
                }
            });
        });
    });
}

function fire(port, monitor, whenDownloadFromLocalFile, whenServerStart) {
    server.on('request', function(req, resp) {
        if ('range' in req.headers) {
            logger.info(req.headers.range);
            var filePath = this.localFiles[req.url];
            if (filePath) {
                fs.exists(filePath, function(exists) {
                    if (exists) {
                        var range = req.headers.range.split('=')[1];
                        var position = parseInt(range.split('-')[0]);

                        fs.stat(filePath, function(error, state) {
                            var fileSize = state.size;
                            resp.setHeader('Content-Range', 'bytes ' + position + '-' + (fileSize - 1) + '/' + fileSize);
                            resp.writeHead(206, 'Partial Content', {
                                'Content-Length': fileSize - position,
                                'Content-Type': 'application/octet-stream',
                            });
                            var fReadStream = fs.createReadStream(filePath, {
                                encoding: 'binary',
                                bufferSize: 1024 * 1024,
                                start: position,
                                end: fileSize
                            });
                            whenDownloadFromLocalFile('start', filePath);
                            fReadStream.on('data', function(chunk) {
                                resp.write(chunk, 'binary');
                            });
                            fReadStream.on('end', function() {
                                // resp.end();
                            });
                        });
                    } else {
                        console.info('not exists');
                    }
                });
            }
            monitor(req, true);
        } else {
            proxyRequestHandler(req, resp);
            monitor(req, false);
        }
    });
    server.listen(port, function() {
        logger.info('HTTP(s) proxy server listening on port %d', server.address().port);
        if (whenServerStart) {
            whenServerStart();
        }
    });
    return server;
}

function setLocalFile(url, filePath) {
    server.localFiles[url] = filePath;
}

module.exports = {
    'fire': fire,
    'setLocalFile': setLocalFile
};
