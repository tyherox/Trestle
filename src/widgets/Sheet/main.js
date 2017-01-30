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

export default {
    id:1,
    refWidth: 1,
    refHeight: 1,
    refLeft: 0,
    refTop: 0,
    minWidth: 3,
    minHeight: 3,
    maxWidth: 10,
    maxHeight: 10,
    content: Hub
};
