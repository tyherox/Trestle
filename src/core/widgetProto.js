/**
 * Created by JohnBae on 11/21/16.
 */

import React from 'react';
import ReactDOM from 'react-dom';

var NotePane = React.createClass({

    getInitialState: function() {

    },
    componentDidUpdate(){

    },
    createId: function(){

    },
    setDrag: function(collider, state, coord){

    },
    toggle: function(noteArg, state){

    },
    search: function(){

    },
    render: function() {
        return (
            <div className = 'widget'
                 ref = 'widget'>
                <div className = 'widgetContent'
                     ref="widgetContent">
                </div>
            </div>
        );
    }
});

module.exports = function(config){
    return <NotePane config = {config}/>;
}
