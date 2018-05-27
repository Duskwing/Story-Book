const {
  Menu
} = require('electron')
const electron = require('electron')
const ipcMain = require('electron').ipcMain
const {ipcRenderer} = require('electron')

// Module to control application life.
const app = electron.app

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
var pathKinda;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

const menuTemplate = [
  {
  label: 'File',
  submenu: [{
    label: 'Create new entry',
    accelerator: process.platform === 'darwin' ? 'Command+E' : 'Ctrl+E',
    click(){
      pathKinda="createStory";
      mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'createStory.html'),
        protocol: 'file:',
        slashes: true
      }))

    }

  }, {
    label: 'Quit',
    accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q'
      /*accelerator:(() => {
        if(process.platform === 'darwin'){
          return 'Command+Q';
        }else{
          return 'Ctrl+Q';
        }


      })()*/
    ,

    click() {
      app.quit();
    }
  }]
},{
  label:'Library',
  click(){
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'library.html'),
      protocol: 'file:',
      slashes: true
    }))

}}
]

if (process.platform === 'darwin') {
  menuTemplate.unshift({});
}

const menu = Menu.buildFromTemplate(menuTemplate)
Menu.setApplicationMenu(menu)

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false
  })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'library.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)


// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
/*
if(process.env.NODE_ENV !== 'production'){

menuTemplate.push({
  label: 'View',
  submenu: [
    {
      label: 'Toggle Developer Tools', 
      click(item, focusedWindow){
        focusedWindow.toggleDevTools();

      }
    }

  ]

});

}*/
var mainID;
ipcMain.on('jumpToMainFromLibrary',function (event,id){
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainID=id;  
  })

  ipcMain.on('jumpToMainFromLibrary2',function (event,id){
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'editStory.html'),
      protocol: 'file:',
      slashes: true
    }));
    mainID=id;  
    })
    
    ipcMain.on('jumpToMainFromEditStory', function(event, arg) {
      event.sender.send('jumpToEditStoryFromMain', mainID);
    });

ipcMain.on('jumpToMainFromIndex', function(event, arg) {
  event.sender.send('jumpToIndexFromMain', mainID);
});
/*
ipcMain.on('downloadThisImage', function(event, arg) {

  var ba64 = require("ba64"),
  data_url = arg[0] ;

// Or save the image asynchronously.
ba64.writeImage(arg[1], data_url, function(err){
  if (err) throw err;

  console.log("Image saved successfully");
});

});*/

ipcMain.on('jumpToMainFromCreateStory',function (event){
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'library.html'),
    protocol: 'file:',
    slashes: true
  }));
  })

  ipcMain.on('jumpToMainFromEditStory2',function (event){
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'library.html'),
      protocol: 'file:',
      slashes: true
    }));
    })
