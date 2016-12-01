function toolbar() {

    var Decor = require('../../core/decor');

    var buttons = [];

    //Toolbar Components
    var quitButton = document.createElement('button');
    quitButton.className = 'widgetToolbarButtons';
    Decor.setIcon(quitButton,"quitButton.png")
    quitButton.addEventListener("click", function(){
        window.close();
    });
    buttons.push(quitButton);

    var documentButton = document.createElement('button');
    documentButton.className = 'widgetToolbarButtons';
    Decor.setIcon(documentButton, "documentButton.png")
    buttons.push(documentButton);

    var displayButton = function(){

        var displayComp = require('./display');

        var button = document.createElement('button');
        button.className = 'widgetToolbarButtons';
        Decor.setIcon(button, "displayButton.png");
        button.name = 'layoutSettingsButton';
        button.addEventListener('click',function(){
            Decor.setTheme(Decor.themes()[1]);
        });
        return button;
    };
    buttons.push(displayButton());

    var hideButton = document.createElement('button');
    hideButton.className = 'widgetToolbarButtons';
    Decor.setIcon(hideButton, "hideButton.png")
    hideButton.addEventListener('click', function(){
        if(hideButton.active == false || hideButton.active == null) {
            hideButton.active = true;
            Layout.activatePins(true);
            hideButton.style.opacity = '.3';
        }
        else{
            hideButton.active = false;
            Layout.activatePins(false);
            hideButton.style.opacity = '1';
        }
    });
    buttons.push(hideButton);

    var saveButton = document.createElement('button');
    saveButton.className = 'widgetToolbarButtons';
    Decor.setIcon(saveButton, "saveButton.png");
    saveButton.style.top = '25px';
    saveButton.style.left = '75px';
    saveButton.addEventListener("click", function(){
        function saveFile () {
            if(self.currentFile!=null)  {
                const {defaultMarkdownSerializer} = require("prosemirror/dist/markdown")
                Mainframe.fs.writeFile(self.currentFile, defaultMarkdownSerializer.serialize(editor.doc.content), function (err) {});
                return;
            }
            Mainframe.dialog.showSaveDialog(function (fileName) {
                if (fileName === undefined) return;
                const {defaultMarkdownSerializer} = require("prosemirror/dist/markdown")
                Mainframe.fs.writeFile(fileName, defaultMarkdownSerializer.serialize(editor.doc.content), function (err) {});
                self.currentFile = fileName;
            });
        }
        saveFile();
    });
    buttons.push(saveButton);

    var saveAsButton = document.createElement('button');
    saveAsButton.className = 'widgetToolbarButtons';
    Decor.setIcon(saveAsButton, "saveasButton.png");
    saveAsButton.style.top = '50px';
    saveAsButton.style.left = '100px';
    saveAsButton.addEventListener("click", function(){

    });
    buttons.push(saveAsButton);

    var openButton = document.createElement('button');
    openButton.className = 'widgetToolbarButtons';
    Decor.setIcon(openButton, "openButton.png");
    openButton.style.top = '75px';
    openButton.style.left = '125px';
    openButton.addEventListener("click", function(){

    });
    buttons.push(openButton);

    documentButton.addEventListener('click',function(){
        if(documentButton.expanded==false||documentButton.expanded==null){
            openButton.style.display = 'inline';
            saveAsButton.style.display = 'inline';
            saveButton.style.display = 'inline';
            documentButton.expanded=true;
        }
        else{
            openButton.style.display = 'none';
            saveAsButton.style.display = 'none';
            saveButton.style.display = 'none';
            documentButton.expanded=false;
        }
    });
    documentButton.addEventListener('blur',function(){
        setTimeout(function () {
            openButton.style.display = 'none';
            saveAsButton.style.display = 'none';
            saveButton.style.display = 'none';
            documentButton.expanded=false;
        }, 100)
    });

    openButton.style.display = 'none';
    saveAsButton.style.display = 'none';
    saveButton.style.display = 'none';

    return buttons;
}

module.exports = toolbar();
