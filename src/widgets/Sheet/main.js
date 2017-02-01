/**
 * Tyherox
 *
 * TimeWidget
 *
 * The TimeWidget is a simple widget used to tell time. Expanding adds the functionality of showing seconds
 */

import React from 'react';
import ReactDOM from 'react-dom';
import RichEditorExample from './editor.js';

class Hub extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <RichEditorExample />
        )
    }
}

class Toolbar extends React.Component {
    render(){
        return(
            <input className = "sheet-title"/>
        )
    }
}

 export default {
 id:1,
 refWidth: 3,
 refHeight: 3,
 refLeft: 0,
 refTop: 0,
 minWidth: 2,
 minHeight: 2,
 maxWidth: 10,
 maxHeight: 10,
 toolbar: Toolbar,
 content: Hub
 };
