/**
 * Tyherox
 *
 * TimeWidget
 *
 * The TimeWidget is a simple widget used to tell time. Expanding adds the functionality of showing seconds
 */

import React from 'react';
import ReactDOM from 'react-dom';

function TimeWidget(){

    var Widget = require('../../core/widget');

    //Configure widget
    var widget = new Widget("Time", 1);
    this.widget = widget;

    //Set widget toolbar - adding two prebuilt toolbar buttons.
    var toolbar = widget.toolbar;
    toolbar.addButton(toolbar.exit());
    toolbar.addButton(toolbar.pin());
    toolbar.expandButtons();

    //Starting Widget initialization with .json file
    widget.initialize('./package.json');
    widget.setMaxSize(2,2);

    //React component for widget content building
    var Time = React.createClass({

        //Set initial state
        getInitialState: function() {
            return {time: this.tick, widgetSize: widget.width};
        },

        //Function to track current time
        tick: function() {
            var time = 0;
            var date = new Date();
            var hours = date.getHours();
            if(hours<10) hours = "0" + hours;
            var minutes = date.getMinutes();
            if(minutes<10) minutes = "0" + minutes;
            var seconds = date.getSeconds();
            if(seconds<10) seconds = "0" + seconds;

            //Different time telling depending on widget size
            if(this.state.widgetSize == 1) time = hours + ":" + minutes;
            if(this.state.widgetSize== 2) time = hours + ":" + minutes +":" + seconds;
            this.setState({time: time});
        },

        componentDidMount: function() {
            //Set time keeping frequency
            this.interval = setInterval(this.tick, 1000);

            //Add resize listener
            widget.content = this.refs.time;
            var self = this;
            widget.resizeListener = function(){
                var content = widget.content;
                var height = Math.round(widget.container.getBoundingClientRect().height);

                //Keep text centered and scaled to width
                content.style.lineHeight = height + "px";
                content.style.fontSize = Layout.cellWidth/4 + "px";

                //Set widget size to determine function type (see above in tick())
                var width = Math.round(widget.element.getBoundingClientRect().width/(Layout.cellWidth-Layout.cellOffset));
                if(width == 1) self.setState({widgetSize: 1})
                if(width == 2) self.setState({widgetSize: 2})
                self.tick();
            };
        },
        render: function() {
            var fontSize = Layout.cellWidth/3 + "px";

            return (
                <div id="time" ref = 'time'>{this.state.time}</div>
            );
        }
    });
    ReactDOM.render(<Time />, widget.container);

}

module.exports= new TimeWidget();
