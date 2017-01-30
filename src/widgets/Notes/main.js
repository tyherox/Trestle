/**
 * Tyherox
 *
 * NoteWidget
 *
 * The widget allows users to create notes with ease and turn them into separate widgets if necessary. The widget
 * textarea is handled by the MIT licensed library prosemirror (http://prosemirror.net).
 *
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState} from 'draft-js';

function NoteWidget(){

    console.log(module.parent);

    var Widget = require('../../core/Widget');
    var data = require('../../core/settings');
    var config = new data('2');

    //Configure widget
    var widget = new Widget("Note", 2);
    this.widget = widget;

    //Set widget toolbar - adding two prebuilt toolbar buttons.
    var toolbar = widget.toolbar;
    toolbar.addButton(toolbar.exit());
    toolbar.addButton(toolbar.pin());
    toolbar.expandButtons();

    //Starting Widget initialization with .json file
    widget.initialize('./package.json');
    widget.setMaxSize(4,5);

    var notePane = require('./NotePane')(config);

    ReactDOM.render(notePane, widget.container);

}

module.exports = new NoteWidget();
