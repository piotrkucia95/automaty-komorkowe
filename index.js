const electron      = require('electron');
const url           = require('url');
const path          = require('path');

const {app, BrowserWindow, Menu, ipcMain, dialog} = electron;

const INITIAL_WIDTH = 800;
const INITIAL_HEIGHT = 320;

// SET ENV
// process.env.NODE_ENV = 'production';

let mainWindow;

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        width: INITIAL_WIDTH,
        height: INITIAL_HEIGHT,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('close', function() {
        app.quit();
    });

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Reload',
                accelerator: process.platform == 'darwin' ? 'Command+R' : 'Ctrl+R',
                click() {
                    app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) });
                    app.quit();
                }
            }, 
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

// Add developer tools items if not in production
if (process.env.NODE_ENV != 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
        ]
    });
}