const {app, BrowserWindow, ipcMain} = require('electron');
const fs = require('fs');
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900, height: 680, webPreferences: {
      nodeIntegration: false, contextIsolation: true, preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL(isDev ? 'http://localhost:5173' : url.format({
    pathname: path.join(__dirname, 'build/index.html'), protocol: 'file:', slashes: true,
  }));

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  ipcMain.handle('read-file', async (event, filePath) => {
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (err) {
      console.error('Error reading file:', err);
      throw err;
    }
  });

  ipcMain.handle('write-file', async (event, {filePath, data}) => {
    try {
      fs.writeFileSync(filePath, data);
    } catch (err) {
      console.error('Error writing file:', err);
      throw err;
    }
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

if (isDev) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    forceHardReset: true,
    hardResetMethod: 'exit',
    ignored: /.*\.mkwrite$/
  });
}
