/* jshint esversion: 6 */
/* jshint node: true */
'use strict';

const os = require('os');
const path = require('path');
const util = require('util');
const childProcess = require('child_process');
const packager = require('electron-packager');

const appTitle = 'Mustang';
const appVersion = '1.1';
const binPath = path.join(__dirname, './bin');
const platform = os.platform();
var arch = 'x64';

if (platform == 'win32') {
    arch = 'ia32';
}

const opts = {
    'name': 'Mustang',
    'arch': arch,
    'dir': path.join(__dirname, '../sources'),
    'platform': platform,
    // 'version': '0.36.9',
    'asar': true,
    'overwrite': true,
    'icon': path.join(__dirname, '../resources/icon.icns'),
    'out': binPath,
};

console.log(opts);
packager(opts, function(err, appPath) {
    // console.log(err || appPath);
    if (platform == 'darwin') {
        childProcess.execSync(util.format('hdiutil create -volname %s-%s -srcfolder %s/%s-%s-%s/%s.app -ov -format UDZO %s/%s-%s-osx.dmg',
            appTitle,appVersion,
            binPath,appTitle,platform,arch,appTitle,
            binPath,appTitle,appVersion));
        childProcess.execSync(util.format('rm -rf %s/%s-%s-%s', binPath,appTitle,platform,arch));
    }
});
