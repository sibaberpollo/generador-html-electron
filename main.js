const electron = require('electron');

const url = require('url');

const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;

app.on('ready', function(){
	mainWindow = new BrowserWindow({});

	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'mainWindow.html'),
		protocol:'file:',
		slashes: true
	}));

	//Cerrar toda la aplicacion al cerrar la ventana principal
	mainWindow.on('closed', function(){
		app.quit();
	});

	//Construir el menu del template

	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	Menu.setApplicationMenu(mainMenu);

});

//Manejo de ventana para agregar elementos


function createAddWindow() {
	addWindow = new BrowserWindow({
		width: 300,
		height: 200,
		title: 'Agregar elemento a la lista'
	});

	addWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'addWindow.html'),
		protocol:'file:',
		slashes: true
	}));

	//vaciar las variables al cerrar
	addWindow.on('close', function(){
		addWindow = null;
	});
}


//Tomar los valores que vienen desde el form

ipcMain.on('item:add', function(e, itemvar) {	
	/*
	var fs = require('fs');
	try { fs.writeFileSync('outputhtml/test.html', itemvar, 'utf-8'); }
	catch(e) { alert('Failed to save the file !'); }
	*/
	mainWindow.webContents.send('item:add', itemvar);
	addWindow.close();

});


//Template de los menus

const mainMenuTemplate = [
	{
		label: 'File',
		submenu: [		
			{
				label: 'Agregar Elemento',
				click() {
					createAddWindow();
				}
			},
			{
				label: 'Clear'
			},		
			{
				label:'Cerrar',
                click: _ =>{
                    app.quit()                    
                },
                accelerator:'CmdOrCtrl+Q'	
			}
		]
	}
];

// Eliminar menu por defecto en MAC agregando objeto vacio

if(process.platform == 'darwin') {
	mainMenuTemplate.unshift({});
}

//Activar las developer tools en DEV

if(process.env.NODE_ENV !== 'production') {
	mainMenuTemplate.push({
		label: 'Developer Tools',
		submenu: [
			{
				label: 'Toggle DevTols',
				accelerator:'CmdOrCtrl+I',
				click(item, focusedWindow){
					focusedWindow.toggleDevTools();
				}
			},
			{
				role: 'reload'
			}
		]
	});
}

