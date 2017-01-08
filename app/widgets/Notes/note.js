/**
 * Created by JohnBae on 8/21/16.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Draft from 'draft-js';
import interact from 'interact.js';

var Decor = require('../../core/decor');

const {
    Editor,
    EditorState
} = Draft;

export default class Note extends React.Component {
    constructor(props) {
        super(props);

        var self = this;

        this.state = { editorState: EditorState.createEmpty(), x: 0, y: 0 };
        this.onChange = editorState => {
            if (this.props.toggleState && !this.props.reorder) {
                this.setState({ editorState: editorState });
                setTimeout(function () {
                    if (self.props.toggleState && !self.props.reorder && self.refs.note != null) {
                        var height = parseInt(getComputedStyle(self.refs.editorContainer, null).height) + 45;
                        if (self.props.height != height) {
                            self.refs.note.style.height = height + 'px';
                            if (height < 100) height = 100;
                            self.props.updateHeight(self.props.id, height);
                        }
                    }
                }, 1);
            } else this.refs.editor.blur();
        };
        this.focus = event => {
            this.refs.editor.focus();
        };
        this.toggleHandle = () => {
            var state = this.props.toggleState ? false : true;
            if (!state) {
                Decor.setIcon(this.refs.sizeButton, 'downButton.png');
            } else Decor.setIcon(this.refs.sizeButton, 'upButton.png');
            this.props.toggle(this, state);
        };
        this.deleteHandle = () => {
            this.props.removeNote(this);
        };
        this.setTitle = event => {
            this.refs.title.focus();
            event.stopPropagation();
        };
    }
    componentDidUpdate() {

        var self = this,
            note = self.refs.note;

        if (!this.props.drag && this.props.visible) note.style.transform = 'translate(' + this.props.left + 'px, ' + this.props.top + 'px)';else if (!this.props.visible) note.style.transform = 'translate(' + this.props.left + 'px, ' + -this.props.height + 'px)';

        if (this.props.drag) note.style.boxShadow = '0 0 5px #536DFE';else note.style.boxShadow = "0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0px 2px 0 rgba(0, 0, 0, 0.12)";

        if (this.props.toggleState && !this.props.reorder && this.refs.editorContainer.parentNode != note) {
            note.style.minHeight = '100px';
            note.style.height = this.props.height + 'px';
            note.style.cursor = 'text';
            note.appendChild(this.refs.editorContainer);
        } else if ((!this.props.toggleState || this.props.reorder) && this.refs.editorContainer.parentNode === note) {
            note.style.minHeight = '25px';
            note.style.height = '25px';
            note.style.cursor = 'default';
            note.removeChild(this.refs.editorContainer);
        };
    }
    componentDidMount() {
        var self = this;

        Decor.setIcon(this.refs.deleteButton, 'exitButton.png');
        Decor.setIcon(this.refs.sizeButton, 'upButton.png');

        var xTarget,
            yTargetnote = this.refs.note,
            offs = note.offsetTop,
            refX = 0,
            refY = 0;

        note.style.height = this.props.height + 'px';
        note.style.transform = 'translate(' + this.props.left + 'px, ' + this.props.top + 'px)';

        interact(note).draggable({
            inertia: true,
            snap: {
                targets: [function () {
                    self.setState({ x: xTarget, y: 0 });
                    return { x: xTarget, y: yTarget };
                }],
                range: Infinity,
                endOnly: true,
                relativePoints: [{ x: 0, y: 0 }]
            }
        }).on('dragstart', function (e) {
            note.style.transition = 'transform 0s, width .5s, height .5s, box-shadow .5s';
            refX = 0;
            refY = self.props.top;
            console.log("TESTING:", refY + ", " + self.state.y);
            self.props.setDrag(self, true, { x: refX, y: refY });
            e.target.style.zIndex = 10;
            xTarget = 5 + refX;
            yTarget = offs + refY;
        }).on('dragmove', function (e) {
            self.setState({ x: self.state.x + e.dx, y: self.state.y + e.dy });
            note.style.transform = 'translate(' + (self.state.x + refX) + 'px, ' + (self.state.y + refY) + 'px)';
            self.props.overlap(self, e);
        }).on('draginertiastart', function (e) {
            note.style.transition = 'all .5s ease';
            self.props.setDrag(self, false);
        }).on('dragend', function (e) {
            e.target.style.zIndex = -1;
            self.props.setDrag(self, false);
        }).actionChecker(function (pointer, event, action, interactable, element, interaction) {
            if (action.name == 'drag') {
                if (event.target.id == 'handler') {
                    action.name = 'drag';
                } else {
                    return null;
                }
            }
            return action;
        }).origin('parent').deltaSource('client');
    }
    render() {
        const { editorState } = this.state;
        return React.createElement(
            'div',
            { className: 'id2-note', ref: 'note', onClick: this.focus, onDragOver: this.test },
            React.createElement(
                'div',
                { className: 'id2-toolbar' },
                React.createElement('button', { className: 'widgetToolbarButtons id2-handler',
                    id: 'handler',
                    ref: 'handle' }),
                React.createElement('input', { className: 'id2-title',
                    ref: 'title',
                    defaultValue: 'Untitled ' + (this.props.id + 1),
                    onClick: this.setTitle }),
                React.createElement('button', { className: 'widgetToolbarButtons',
                    onClick: this.deleteHandle,
                    ref: 'deleteButton' }),
                React.createElement('button', { className: 'widgetToolbarButtons',
                    onClick: this.toggleHandle,
                    ref: 'sizeButton' })
            ),
            React.createElement(
                'div',
                { className: 'id2-editor', ref: 'editorContainer' },
                React.createElement(Editor, { editorState: editorState,
                    onChange: this.onChange,
                    ref: 'editor',
                    placeholder: 'Awesome Stuff Here' })
            )
        );
    }
}