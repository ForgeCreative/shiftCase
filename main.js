const {app, BrowserWindow, ipcMain, Tray, nativeImage, globalShortcut, remote, clipboard} = require('electron');
require('electron-debug')();
const path = require('path');

let tray = undefined
let window = undefined

// Don't show the app in the doc
//app.dock.hide()

app.on('ready', () => {
  createTray()
  createWindow()
})

const createTray = () => {
  const iconPath = path.join(__dirname, 'ss.png');
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

  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4);

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
    transparent: true,
    webPreferences: {
      backgroundThrottling: false
    }
  })
  window.loadURL(`file://${path.join(__dirname, 'index.html')}`)

  // Hide the window when it loses focus
  window.on('blur', () => {
    if (!window.webContents.isDevToolsOpened()) {
      window.hide()
    }
  })
}

const toggleWindow = () => {
  window.isVisible() ? window.hide() : showWindow();
}

const showWindow = () => {
  const position = getWindowPosition();
  window.setPosition(position.x, position.y, false);
  window.show();
}

ipcMain.on('show-window', () => {
  showWindow()
})

ipcMain.on('close-main-window', function () {
    app.quit();
});