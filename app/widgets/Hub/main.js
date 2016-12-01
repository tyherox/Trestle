/**
 * Created by JohnBae on 4/7/16.
 */

import ReactDOM from 'react-dom';

function Hub() {

    var Widget = require('../../core/widget');

    //Build widget
    var widget = new Widget("Hub", 0);
    this.widget = widget;
    this.pinned = true;

    widget.toolbar.fixedButtons();

    //Initialize Toolbar Components
    var toolbarComponents = require("./toolbar");
    toolbarComponents.forEach(function (button) {
        widget.toolbar.addButton(button);
    });

    //Initialize widget
    widget.initialize();
    widget.setMinSize(3, 3);
    widget.setMaxSize(10, 10);

    var editor = require('./editor.js');

    ReactDOM.render(editor, widget.container);
}

module.exports = new Hub();