/**
 * Tyherox
 *
 * TimeWidget
 *
 * The TimeWidget is a simple widget used to tell time. Expanding adds the functionality of showing seconds
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Editor, EditorState } from 'draft-js';

class Hub extends React.Component {
    constructor(props) {
        super(props);
        this.state = { editorState: EditorState.createEmpty() };
        this.onChange = editorState => this.setState({ editorState });
    }
    render() {
        return React.createElement(Editor, { editorState: this.state.editorState, onChange: this.onChange });
    }
}

export default {
    id: 1,
    refWidth: 1,
    refHeight: 1,
    refLeft: 0,
    refTop: 0,
    minWidth: 1,
    minHeight: 1,
    maxWidth: 2,
    maxHeight: 2,
    content: Hub
};