import { app, BrowserWindow, ipcMain, screen } from 'electron';
import _ from 'lodash';

import robotjs from 'robotjs';
import midi from 'midi';
import settings from 'electron-settings';

import { checkOrCreateDefaultOptions } from './settings';

import { WINDOW_PLACEMENT, CURRENT_BUTTON_CONFIGURATION } from '../shared/constants/settings';
import { COLOR_DARKER } from '../shared/constants/uiColors';

require('events').EventEmitter.defaultMaxListeners = 255;
settings.setMaxListeners(255)

global.settings = settings;
global.midi = midi
global.robotjs = robotjs

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

if (module.hot) {
  module.hot.accept();
}


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

const updateMinimumSize = () => {
  const [ curWidth, curHeight] = mainWindow.getSize();
  const [ contWidth, contHeight ] = mainWindow.getContentSize();
  mainWindow.setMinimumSize(756 + (curWidth - contWidth), 756 + (curHeight - contHeight));
}

let mainWindow;
const createWindow = (placement) => {
  // Create the browser window.
  mainWindow = new BrowserWindow({...placement, 
    minHeight: 756,
    minWidth: 756,
    
    backgroundColor: COLOR_DARKER,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    },
  });

  mainWindow.setMenu(null)

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools({mode: "detach"});

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  
  // Save window location and size
  const updatePlacement =  (e, { width, height, x ,y}) => {
    updateMinimumSize();
    settings.set(WINDOW_PLACEMENT, {width, height, x, y})
  };
  mainWindow.on('will-resize', updatePlacement)
  mainWindow.on('will-move', updatePlacement)
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  console.log(settings.getAll())
  checkOrCreateDefaultOptions()

  const windowPlacement = settings.get(WINDOW_PLACEMENT)

  createWindow(windowPlacement);
  updateMinimumSize();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});