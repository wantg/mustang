var os = require('os');
var path = require('path');
const childProcess = require('child_process');
var NwBuilder = require('nw-builder');

var rootPath = __dirname+'/..';
var appTitle = 'Mustang';
var appVersion = '1.1';
var cleanUpSchemas = [];
var finishSchemas = [];
var buildPath = path.join(rootPath, 'build');
var binPath = path.join(buildPath, 'bin');
// console.log(os.platform());

var platforms = [];
if (os.platform() == 'darwin') {
    platforms = ['osx64'];
    cleanUpSchemas = [
        'rm -rf '+binPath+' '+buildPath+'/'+appTitle+'-'+appVersion+'-*'
    ];
    // hdiutil create -volname Mustang-$APP_VERSION -srcfolder $BASE_PATH/bin/$APPTITLE/osx64/$APPTITLE.app -ov -format UDZO $BASE_PATH/$APPTITLE-$APP_VERSION-osx.dmg
    finishSchemas  = [
        'hdiutil create -volname '+appTitle+'-'+appVersion+' -srcfolder '+binPath+'/'+appTitle+'/osx64/'+appTitle+'.app -ov -format UDZO '+buildPath+'/'+appTitle+'-'+appVersion+'-osx.dmg',
        'rm -rf '+binPath
    ];
} else if (os.platform() == 'win32') {
    platforms = ['win32'];
    cleanUpSchemas = [
        // 'rmdir /S /Q '+binPath,
        'del /S /Q '+buildPath+path.sep+appTitle+'-'+appVersion+'-*',
    ];
    finishSchemas  = [
        __dirname+'/7za a -t7z '+buildPath+path.sep+appTitle+'-'+appVersion+'-win32.7z '+binPath+'\\'+appTitle+'\\win32\\*',
        'rmdir /S /Q '+binPath
    ];
} else {
    process.exit();
}

for(var idx in cleanUpSchemas) {
    childProcess.execSync(cleanUpSchemas[idx]);
}

var nw = new NwBuilder({
    version: '0.12.3',
    cacheDir: rootPath+'/build/cache',
    files: rootPath+'/sources/**',
    buildDir: rootPath+'/build/bin',
    platforms: platforms,
    appName: appTitle,
    appVersion: appVersion,
    macIcns: rootPath+'/resources/icon.icns',
    winIco: rootPath+'/resources/icon.ico',
    zip:true
});

//Log stuff you want
nw.on('log',  console.log);

// Build returns a promise
nw.build().then(function () {
    console.log('wait...');
    for(var idx in finishSchemas) {
        childProcess.execSync(finishSchemas[idx]);
    }
    console.log('all done!');
}).catch(function (error) {
    console.error(error);
});