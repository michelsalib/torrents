'use strict';

const Promise = require("bluebird");
const electron = require('electron');
const ipcMain = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

Promise.config({
    cancellation: true
});

var mainWindow = null;

var shouldQuit = app.makeSingleInstance(function (commandLine, workingDirectory) {
    if (mainWindow.isMinimized()) {
        mainWindow.restore();
    }

    mainWindow.focus();

    openTorrentsFromArgs(commandLine);
});

if (shouldQuit) {
    app.quit();
    return;
}

app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function () {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false
    });
    mainWindow.setMenu(null);

    mainWindow.loadURL('file://' + __dirname + '/index.html');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    ipcMain.on('ready', function() {
        openTorrentsFromArgs(process.argv);
    });
});

function openTorrentsFromArgs(args) {
    console.log(args);

    args.filter(function (arg) {
        return /^magnet:|\.torrent$/i.test(arg);
    }).forEach(function (magnet) {
        mainWindow.webContents.send('open', magnet);
    });
}