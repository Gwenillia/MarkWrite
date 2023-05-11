const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  readFile: async (filePath) => ipcRenderer.invoke('read-file', filePath),
  writeFile: async (filePath, data) => ipcRenderer.invoke('write-file', { filePath, data }),
});
