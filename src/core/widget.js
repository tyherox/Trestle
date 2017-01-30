/**
 * Tyherox
 *
 * Widget
 *
 * The widget class is the template for all widgets of Scribe. It includes the container to place custom content and
 * means to be arranged upon the Layout module.
 */


import React from 'react';
import Interact from 'interact.js';

export default class Widget extends React.Component{

    constructor(props){
        super(props);
    }

    componentDidMount(){

        var self = this, widget = self.refs.widgetRef;

        //Initialize Drag Module for Widget
        Interact(widget)
            .draggable({
                inertia: {
                    minSpeed: Infinity,
                },
                snap: {
                    targets: [
                        Interact.createSnapGrid({ x: self.props.gridWidth , y: self.props.gridHeight})
                    ],
                    offset: { x: self.props.cellOffset, y: self.props.cellOffset },
                    range: Infinity,
                    endOnly: true,
                    relativePoints: [ { x: 0, y: 0 } ]
                },
                restrict: {
                    restriction: 'parent',
                    elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
                    endOnly: true
                },
                onstart: function(event){
                    startDrag();
                },
                onmove: function(event){
                    self.props.update(self.props.id, {
                        tmpLeft: (self.props.tmpLeft + event.dx),
                        tmpTop: (self.props.tmpTop + event.dy),
                        refTop: Math.round(self.props.actTop/self.props.gridHeight),
                        refLeft: Math.round(self.props.actLeft/self.props.gridWidth)
                    });
                    //self.props.collisionDetect(self.props.id);
                },
                onend: function(){
                    endDrag();
                },
                oninertiastart: function(event){
                    self.props.toggleGrid(false);
                }
            })
            .resizable({
                invert: 'none',
                inertia: {
                    minSpeed: Infinity
                },
                square: false,
                preserveAspectRatio: false,
                edges: { left: false, right: true, bottom: true, top: false },
                snap: {
                    targets: [
                        Interact.createSnapGrid({ x: self.props.gridWidth , y: self.props.gridHeight})
                    ],
                    offset: { x: self.props.cellOffset, y: self.props.cellOffset},
                    range: Infinity,
                    relativePoints: [ { x: 0, y: 0 } ],
                    endOnly: true
                },
                restrict: {
                    restriction: 'parent',
                    endOnly: true
                },
                onstart: function(event){
                    startDrag();
                },
                onmove: function(event){
                    var width = event.rect.width,
                        height = event.rect.height,
                        gWidth = self.props.gridWidth,
                        gHeight = self.props.gridHeight,
                        offset = self.props.cellOffset * 2;

                    if(width<=0) width = gWidth - offset;
                    else if(width>self.props.maxWidth * gWidth - offset) width = self.props.maxWidth * gWidth - offset;

                    if(height<=0) height = gHeight - offset;
                    else if(height>self.props.maxHeight * gHeight - offset) height = self.props.maxHeight * gHeight - offset;

                    self.props.update(self.props.id,{
                        tmpWidth: width,
                        tmpHeight: height,
                        refWidth: Math.ceil(width/self.props.gridWidth),
                        refHeight: Math.ceil(height/self.props.gridHeight)
                    });
                    //self.props.collisionDetect(self.props.id);
                },
                onend: function(event){
                    endDrag();
                },
                oninertiastart: function(event){
                    self.props.toggleGrid(false);
                }
            })
            .actionChecker(function (pointer, event, action) {
                if(action.name=='drag'){
                    //Invalidate actions for widget content drag (users can only drag by using the toolbar)
                    if(event.target.className == 'widgetToolbar themeSecondaryColor'){
                        action.name = 'drag';
                    }
                    else{
                        return null;
                    }
                }
                return action;
            })
            .origin('parent');

        //Initialize widget props for Layout
        this.setSize();
        this.setMinSize();
        this.setMaxSize();
        this.setLocation();
        this.setTransition();
        this.setIndex();

        self.props.update(self.props.id,{
            actLeft: (self.props.actLeft + self.props.cellOffset),
            actTop: (self.props.actTop + self.props.cellOffset),
            tmpLeft: 0,
            tmpTop: 0,
            actWidth: self.props.actWidth,
            actHeight: self.props.actHeight,
            tmpWidth: 0,
            tmpHeight: 0
        });

        //Prep Layout/Widget for drag
        var startDrag = function(){
            self.props.toggleGrid(true);
            self.props.update(self.props.id,{
                dragging: true,
                index: 100,
                transition: 'transform 0s, width .0s, height .0s, box-shadow .5s'
            });
        }

        //Clean up temp variables for drag
        var endDrag = function(){
            if(self.props.validateHome(self.props)){
                self.props.update(self.props.id,{
                    index: 1,
                    transition: 'all .5s ease',
                    dragging: false,
                });
            }
            else{
                self.props.update(self.props.id,{
                    index: 1,
                    transition: 'all .5s ease',
                    dragging: false,
                    tmpLeft: 0,
                    tmpTop: 0,
                    tmpWidth: 0,
                    tmpHeight: 0
                });
            }
            self.props.solidifyWidgets();
        }

    }

    //Use stateless React props to update Widget. Modularized update system avoids irrelevant updates.
    componentDidUpdate(prevProps, prevState){

        if(prevProps.actWidth != this.props.actWidth || prevProps.actHeight != this.props.actHeight ||
            prevProps.tmpWidth != this.props.tmpWidth || prevProps.tmpHeight != this.props.tmpHeight ) this.setSize();
        if(prevProps.minWidth != this.props.minWidth || prevProps.minHeight != this.props.minHeight) this.setMinSize();
        if(prevProps.maxWidth != this.props.maxWidth || prevProps.maxWidth != this.props.maxWidth) this.setMaxSize();
        if(prevProps.actLeft != this.props.actLeft || prevProps.actTop != this.props.actTop ||
            prevProps.tmpLeft != this.props.tmpLeft || prevProps.tmpTop != this.props.tmpTop ) this.setLocation();
        if(prevProps.transition != this.props.transition) this.setTransition();
        if(prevProps.index != this.props.index) this.setIndex();

    }

    setSize(){

        var widget = this.refs.widgetRef,
            width = this.props.actWidth,
            height = this.props.actHeight;

        if(this.props.tmpWidth != 0 || this.props.tmpHeight != 0){
            width = this.props.tmpWidth;
            height = this.props.tmpHeight;
        }

        widget.style.width = width + "px";
        widget.style.height = height + "px";
    }

    setMinSize(){
        var widget = this.refs.widgetRef;
        widget.style.minWidth = this.props.minWidth * this.props.gridWidth - this.props.cellOffset * 2 + "px";
        widget.style.minHeight = this.props.minHeight * this.props.gridHeight - this.props.cellOffset * 2 + "px";
    }

    setMaxSize(){
        var widget = this.refs.widgetRef;
        widget.style.maxWidth = this.props.maxWidth * this.props.gridWidth - this.props.cellOffset * 2 + "px";
        widget.style.maxHeight = this.props.maxHeight * this.props.gridHeight - this.props.cellOffset * 2 + "px";
    }

    setLocation(){
        var widget = this.refs.widgetRef,
            width = this.props.actLeft + this.props.tmpLeft,
            height = this.props.actTop  + this.props.tmpTop;
        widget.style.transform = 'translate(' + width + 'px, ' + height + 'px)';
    }

    setTransition(){
        var widget = this.refs.widgetRef;
        widget.style.transition = this.props.transition;
    }

    setIndex(){
        var widget = this.refs.widgetRef;
        widget.style.zIndex = this.props.index;
    }

    render(){
        var Content = this.props.content;
        if(this.props.id){
            if(Content){
                return(
                    <div className = 'widget widgetBackground'
                         ref = 'widgetRef'>
                        <div className = 'widgetToolbar themeSecondaryColor'
                             ref="widgetToolbarRef">
                        </div>
                        <div className = 'widgetContainer'>
                            <Content refWidth = {this.props.refWidth}
                                      refHeight = {this.props.refHeight}/>
                        </div>
                    </div>
                )
            }
            else{
                return(
                    <div className = 'widget widgetBackground'
                         ref = 'widgetRef'>
                        <div className = 'widgetToolbar themeSecondaryColor'
                             ref="widgetToolbarRef">
                        </div>
                        <div className = 'widgetContainer'>
                        </div>
                    </div>
                )
            }
        }
    }
}
