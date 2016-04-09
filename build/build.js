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
    const appDir = util.format('%s%s%s-%s-%s', binPath,path.sep,appTitle,platform,arch);
    if (platform == 'darwin') {
        childProcess.execSync(util.format('hdiutil create -volname %s-%s -srcfolder %s/%s.app -ov -format UDZO %s/%s-%s-osx.dmg',
            appTitle,appVersion,
            appDir,appTitle,
            binPath,appTitle,appVersion));
        childProcess.execSync(util.format('rm -rf %s', appDir));
    } else if (platform == 'win32') {
        childProcess.execSync(util.format('del '+binPath+path.sep+appTitle+'-'+appVersion+'-win32.7z'));
        childProcess.execSync(util.format(__dirname+path.sep+'7za a -t7z '+binPath+path.sep+appTitle+'-'+appVersion+'-win32.7z '+appDir+path.sep+'*'));
        childProcess.execSync(util.format('rmdir /S /Q %s',appDir));
    }
});
