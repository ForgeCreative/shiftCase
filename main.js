const {app, BrowserWindow, ipcMain, Tray, globalShortcut, remote, clipboard} = require('electron');
require('electron-debug')();
const path = require('path');

let tray = undefined
let window = undefined

// Don't show the app in the doc
//app.dock.hide()

app.on('ready', () => {
  createTray()
  createWindow()

  /*
  globalShortcut.register('CommandOrControl+C', function(){
      console.log("test")
      const text = clipboard.readText();
      console.log(text);
      window.webContents.send("testBindicp" , text);
  });
  */
})

const createTray = () => {
  tray = new Tray(path.join('ss.png'))
  tray.on('click', function (event) {
    toggleWindow()
  });
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
    width: 320,
    height: 450,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: false,
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