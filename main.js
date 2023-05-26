// Modules to control application life and create native browser window
const {app, BrowserWindow, remote, ipcMain } = require('electron')
const path = require('path')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: 1920,
    height: 760,
    // Отключение рамки окна
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  const mainColor = '#000'

  // and load the index.html of the app.
  // mainWindow.loadFile('index.html')
  // mainWindow.loadFile('index_1_plus_1.html')
  // mainWindow.loadFile('index_3d_shym.html')
  // mainWindow.loadFile('index_trc.html')
  // mainWindow.loadFile('index_trc_h.html')
  mainWindow.loadFile('index_2led.html')
  // mainWindow.loadFile('index_medeo_f.html')
  // mainWindow.loadFile('index_shym_res.html')
  // mainWindow.loadFile('index_medeo_flag.html')
  mainWindow.setBackgroundColor(mainColor)
  // mainWindow.setFullScreen(true)
  // Включение режима поверх всех окон
  // mainWindow.setAlwaysOnTop(true)


  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.disableHardwareAcceleration()
app.commandLine.appendSwitch('ignore-certificate-errors', true);

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const relaunchApplication = () => {
  app.exit()
  app.relaunch()
}

ipcMain.on('reload-me', (evt, arg) => {
  relaunchApplication()
})

setTimeout(() => {
  relaunchApplication()
}, 21600000)
