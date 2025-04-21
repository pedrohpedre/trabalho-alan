const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  enviarPergunta: (pergunta) => ipcRenderer.invoke('enviar-pergunta', pergunta)
});