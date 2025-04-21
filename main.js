require('dotenv').config();
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const OpenAI = require('openai');

let mainWindow;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false
    }
  });

  mainWindow.loadFile('index.html');
  mainWindow.on('closed', () => mainWindow = null);
}

ipcMain.handle('enviar-pergunta', async (_, pergunta) => {
  try {
    const { choices } = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Você é um assistente útil." },
        { role: "user", content: pergunta }
      ],
      temperature: 0.7,
    });
    return choices[0].message.content;
  } catch (error) {
    console.error('Erro:', error);
    return `Erro: ${error.message}`;
  }
});

app.on('ready', createWindow);
app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit());
app.on('activate', () => !mainWindow && createWindow());