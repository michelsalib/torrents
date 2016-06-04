const Promise = require('bluebird');
const electron = require('electron');
const register = require('./libs/register');
const ipcMain = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

Promise.config({
    cancellation: true
});

var mainWindow = null;

var shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
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

register.register(
    'torrents',
    __dirname + '\\torrents "%1"',
    '.torrent',
    'application/x-bittorrent',
    {
        protocol: 'Magnet',
        name: 'Magnet URI',
        type: 'application/x-magnet'
    }
);

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false
    });
    mainWindow.setMenu(null);

    mainWindow.loadURL('file://' + __dirname + '/index.html');

    mainWindow.toggleDevTools();

    mainWindow.on('closed', () => mainWindow = null);

    ipcMain.on('ready', () => openTorrentsFromArgs(process.argv));
});

function openTorrentsFromArgs(args) {
    args.filter(arg => /^magnet:|\.torrent$/i.test(arg))
        .forEach(magnet => mainWindow.webContents.send('open', magnet));
}
