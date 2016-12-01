/**
 * Created by JohnBae on 8/10/16.
 */

var path = require('path'),
    jetpack = require('fs-jetpack'),
    currentTheme = null,
    currentCache = null,
    app = {},
    themeElements = [];

var setTheme = function(theme){
    document.getElementById('themeCss').href = theme.css;
    currentTheme = theme;
    currentCache = path.join(currentTheme.css, "../" , "/assets/");

    console.debug("Set theme:", currentTheme, currentCache)

    themeElements.forEach(function(item){
        var element = item.element,
            asset = currentCache + item.name,
            size = item.size,
            pos = item.position;

        element.style.backgroundImage = "url(" + asset + ")";
        element.style.backgroundRepeat = "no-repeat";
        element.style.backgroundSize = size;
        element.style.backgroundPosition = pos;
    })

    console.log("ELEMENTS:",themeElements);

    Layout.toggle(false);
}

var setIcon = function(element, name, options){

    //console.log("Setting Icon for",element,"with the name",name,"with options",options);

    if(!options) options = {};
    var size = (options.size||"80% 80%"),
        pos = (options.pos||'center'),
        asset = (currentCache + name);

    if(currentCache){

        //console.log("Cache:", currentCache);
        //console.log("Asset:",asset);

        element.style.backgroundImage = "url(" + asset+ ")";
        element.style.backgroundRepeat = "no-repeat";
        element.style.backgroundSize = size;
        element.style.backgroundPosition = pos;
    }
    themeElements.push({element: element, name: name, size: size, position: pos});
}

var commit = function(data){
    app = data;
}

var returnValue = {
    setTheme: setTheme,
    setIcon: setIcon,
    commit: commit,
    themes: function(){
        return app.themes
    }
}

module.exports = returnValue;
export default returnValue;
