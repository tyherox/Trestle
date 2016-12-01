/**
 * Created by JohnBae on 11/21/16.
 */

import React from 'react';
import ReactDOM from 'react-dom';

var NotePane = React.createClass({
    displayName: 'NotePane',


    getInitialState: function () {},
    componentDidUpdate() {},
    createId: function () {},
    setDrag: function (collider, state, coord) {},
    toggle: function (noteArg, state) {},
    search: function () {},
    render: function () {
        return React.createElement(
            'div',
            { className: 'widget',
                ref: 'widget' },
            React.createElement('div', { className: 'widgetContent',
                ref: 'widgetContent' })
        );
    }
});

module.exports = function (config) {
    return React.createElement(NotePane, { config: config });
};