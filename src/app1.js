/**
 * Created by JohnBae on 7/9/16.
 */

import { remote } from 'electron';
import jetpack from 'fs-jetpack';

var widgets = [],
    layouts = [],
    themes = [],
    afterLoad = [],
    manualUpdate = [];

var usrPath = remote.app.getPath('userData');
var widgetDir = usrPath+'/widgets',
    layoutDir = usrPath+'/layouts',
    themeDir = usrPath+'/themes',
    pluginDir = usrPath+'/plugins',
    settingDir = usrPath+'/settings';

function searchWidgets(){
    jetpack.dir(widgetDir);
    jetpack.list(__dirname+"/widgets").forEach(function(file){
        var filePath = __dirname + "/widgets/" + file;
        if(jetpack.inspect(filePath).type!='file') widgets.push(loadScript(filePath,"widget"));
    });
    jetpack.list(widgetDir).forEach(function(file){
        var filePath = __dirname + "/widgets/" + file;
        if(jetpack.inspect(filePath).type!='file') widgets.push(loadScript(filePath,"widget"));
    });
}

function searchLayouts(){
    jetpack.dir(layoutDir);
    jetpack.list(layoutDir).forEach(function(file){
        var filePath = layoutDir + "/" + file;
        if(jetpack.inspect(filePath).type=='file')layouts.push(loadScript(filePath));
    });
}

function searchThemes(){
    jetpack.dir(themeDir);
    jetpack.list(__dirname+"/themes").forEach(function(file){
        var filePath = __dirname + "/themes/" + file;
        if(jetpack.inspect(filePath).type!='file') themes.push(loadScript(filePath,"theme"));
    });
    jetpack.list(themeDir).forEach(function(file){
        var filePath = __dirname + "/themes/" + file;
        if(jetpack.inspect(filePath).type!='file') themes.push(loadScript(filePath,"widget"));
    });
}

/*function searchPlugins(){
 jetpack.dir(pluginDir);
 jetpack.list(__dirname+"/widgets").forEach(function(file){
 plugins.push(loadScript(__dirname+"/widgets/" + file,"widget"));
 });
 jetpack.list(widgetDir).forEach(function(file){
 plugins.push(loadScript(widgetDir + file,"widget"));
 });
 }*/

function loadScript(path, type){
    var returnData ={};
    console.log("Searching:",path);
    switch(type){
        case "widget":
            if(jetpack.find(path,{matching: '*main.js*', directories: false})) {
                //returnData.main = require(path+"/main.js");
            }
            if(jetpack.find(path,{matching: '*style.css*', directories: false})) {
                var css = document.createElement("link");
                css.setAttribute("rel", "stylesheet");
                css.setAttribute("type", "text/css");
                css.setAttribute("href", path +"/style.css");
                document.getElementsByTagName("head")[0].appendChild(css)
            }
            if(jetpack.find(path,{matching: '*package.json*', directories: false})) {
                returnData.json = require(path+"/package.json");
            }
            if(jetpack.find(path,{matching: '*icon.png*', directories: false})) {
                returnData.icon = path+"/icon.png";
            }
            break;
        case "theme":
            if(jetpack.find(path,{matching: '*theme.css*', directories: false})) {
                returnData.css = (path+"/theme.css");
            }
            if(jetpack.find(path,{matching: '*package.json*', directories: false})) {
                returnData.json = require(path+"/package.json");
            }
            if(jetpack.find(path,{matching: '*icon.png*', directories: false})) {
                returnData.icon = path+"/icon.png";
            }
            break;
        case "plugin":
            returnData = require(path);
            break;
    }
    return returnData;
}

searchWidgets();
searchLayouts();
searchThemes();
//searchPlugins();

console.log("Search Complete")

window.addEventListener('load', function() {
    for(var i = 0; i<afterLoad.length; i++){
        afterLoad[i]();
    }

}, false);

var time = require('./widgets/Dummy/main.js')("Time");
time.widget.setSize(2,1);
time.widget.column = 0;
time.widget.row = 0;
Layout.addWidget(time.widget);

var notes = require('./widgets/Dummy/main.js')("Notes");
notes.widget.setSize(2,2);
notes.widget.column = 0;
notes.widget.row = 1;
Layout.addWidget(notes.widget);

var sketch = require('./widgets/Dummy/main.js')("Sketch");
sketch.widget.setSize(2,2);
sketch.widget.column = 6;
sketch.widget.row = 0;
Layout.addWidget(sketch.widget);

var task = require('./widgets/Dummy/main.js')("Task");
task.widget.setSize(2,3);
task.widget.column = 6;
task.widget.row = 2;
Layout.addWidget(task.widget);

var media = require('./widgets/Dummy/main.js')("Media");
media.widget.setSize(2,2);
media.widget.column = 0;
media.widget.row = 3;
Layout.addWidget(media.widget);

var hub = require('./widgets/Hub/main.js');
hub.widget.setSize(4,5);
hub.widget.column = 2;
hub.widget.row = 0;
Layout.addWidget(hub.widget);

Layout.drawGrid(Layout.screenWidth, Layout.screenHeight);
Layout.makeLayout();
Layout.reset();
Layout.toggle(false);
Decor.setTheme(themes[0]);

console.log("module:",module.filename);

Decor.commit({themes: themes});

module.exports = {
    search:{
        searchWidgets,
        searchLayouts,
        searchThemes,
        //searchPlugins
    },
    themes
};
export default {
    search:{
        searchWidgets,
        searchLayouts,
        searchThemes,
        //searchPlugins
    },
    themes
};

