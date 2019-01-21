const {app, BrowserWindow, ipcMain, Tray, nativeImage, globalShortcut, remote, clipboard, systemPreferences, Menu} = require('electron');
const {autoUpdater} = require("electron-updater");
require('electron-debug')();
const path = require('path');

let tray = undefined
let window = undefined

// Don't show the app in the doc
//app.dock.hide()

app.on('ready', () => {
  createTray()
  createWindow()
  Menu.setApplicationMenu(menu)
  autoUpdater.checkForUpdates();
})


const createTray = () => {
  const iconPath = systemPreferences.isDarkMode() ? path.join(__dirname, 'ss.png') : path.join(__dirname, 'ss-light.png');
  let trayIcon = nativeImage.createFromPath(iconPath);
  trayIcon = trayIcon.resize({ width: 16, height: 12 });
  tray = new Tray(trayIcon)
  tray.on('click', function (event) {
    toggleWindow()
  });
  tray.setHighlightMode('never')
}

const getWindowPosition = () => {
  const windowBounds = window.getBounds();
  const trayBounds = tray.getBounds();

  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));
  const y = Math.round(trayBounds.y + trayBounds.height + 15);

  return {x: x, y: y};
}

const createWindow = () => {
  window = new BrowserWindow({
    width: 380,
    height: 184,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: false,
    webPreferences: {
      backgroundThrottling: false
    },
     icon: path.join(__dirname, 'assets/icons/png/AppIcon-128px-128pt@1x.png')
  })
  window.loadURL(`file://${path.join(__dirname, 'index.html')}`)

  // Hide the window when it loses focus
  window.on('blur', () => {
    if (!window.webContents.isDevToolsOpened()) {
      window.hide()
    }
  })
}

const createTemplateMenu = [
  {
    label: app.getName(),
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { require('electron').shell.openExternal('https://github.com/ForgeCreative/shiftcase') }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(createTemplateMenu)

const toggleWindow = () => {
  window.isVisible() ? window.hide() : showWindow();
}

const showWindow = () => {
  const position = getWindowPosition();
  window.setPosition(position.x, position.y, false);
  window.show();
}

autoUpdater.on('update-downloaded', (info) => {
    win.webContents.send('updateReady')
});

ipcMain.on("quitAndInstall", (event, arg) => {
    autoUpdater.quitAndInstall();
})

//app.dock.hide();

ipcMain.on('show-window', () => {
  showWindow()
})

ipcMain.on('close-main-window', function () {
    app.quit();
});