'use strict';

const os = require('os');
const path = require('path');
const packager = require('electron-packager');

const opts = {
    "name":      "Mustang",
    "arch":      "x64",
    "dir":       path.join(__dirname, '../sources'),
    "platform":  os.platform(),
    "version":   "0.36.9",
    "asar":      true,
    "overwrite": true,
    "icon":      path.join(__dirname, "../resources/icon.icns")
};

if (os.platform() == 'win32') {
    opts['arch'] = "ia32";
}

console.log(opts);
packager(opts, function(err, appPath) {
    console.log(err||appPath);
})
