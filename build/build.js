/* jshint esversion: 6 */
/* jshint node: true */
'use strict';

const os = require('os');
const path = require('path');
const packager = require('electron-packager');

const platform = os.platform();

const opts = {
    'name': 'Mustang',
    'arch': 'x64',
    'dir': path.join(__dirname, '../sources'),
    'platform': platform,
    // 'version': '0.36.9',
    'asar': true,
    'overwrite': true,
    'icon': path.join(__dirname, '../resources/icon.icns'),
    'out': path.join(__dirname, './bin'),
};

if (platform == 'win32') {
    opts.arch = 'ia32';
}

console.log(opts);
packager(opts, function(err, appPath) {
    console.log(err || appPath);
});
