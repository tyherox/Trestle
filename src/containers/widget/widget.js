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
                    self.props.updateWidgetState(self.props.id, {
                        tmpLeft: (self.props.tmpLeft + event.dx),
                        tmpTop: (self.props.tmpTop + event.dy)
                    });
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

                    self.props.updateWidgetState(self.props.id,{
                        tmpWidth: width,
                        tmpHeight: height,
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
                    if(event.target.className.includes("widgetToolbar") || event.target.className.includes("sheet-title")){
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
        this.setOpacity();

        self.props.updateWidgetState(self.props.id,{
            tmpLeft: 0,
            tmpTop: 0,
            tmpWidth: 0,
            tmpHeight: 0
        });

        //Prep Layout/Widget for drag
        var startDrag = function(){
            self.props.toggleGrid(true);
            self.props.updateWidgetState(self.props.id,{
                dragging: true,
                index: 10,
                transition: 'transform 0s, width .0s, height .0s, box-shadow .5s'
            });
        }

        //Clean up temp variables for drag
        var endDrag = function(){
            if(self.props.validateHome(self.props)){
                var top = self.props.tmpTop,
                    left = self.props.tmpLeft,
                    width = self.props.tmpWidth,
                    height= self.props.tmpHeight;

                self.props.updateWidgetState(self.props.id,{
                    index: 1,
                    transition: 'all .5s ease',
                    dragging: false,
                    refTop: self.props.refTop + Math.round(top/self.props.gridHeight),
                    refLeft: self.props.refLeft + Math.round(left/self.props.gridWidth),
                    refWidth: width==0 ?self.props.refWidth : Math.ceil(width/self.props.gridWidth),
                    refHeight: height==0 ?self.props.refHeight : Math.ceil(height/self.props.gridHeight),
                    tmpLeft: 0,
                    tmpTop: 0,
                    tmpWidth: 0,
                    tmpHeight: 0
                });
            }
            else{
                self.props.updateWidgetState(self.props.id,{
                    index: 1,
                    transition: 'all .5s ease',
                    dragging: false,
                    tmpLeft: 0,
                    tmpTop: 0,
                    tmpWidth: 0,
                    tmpHeight: 0
                });

                console.log("END 2");
            }
            console.log("ENDED DRAG:", self.props);
            self.props.solidifyWidgets();
        }

    }

    //Use stateless React props to update Widget. Modularized update system avoids irrelevant updates.
    componentDidUpdate(){

        this.setSize();
        this.setMinSize();
        this.setMaxSize();
        this.setLocation();
        this.setTransition();
        this.setIndex();
        this.setOpacity()

    }

    setSize(){

        var self = this;

        var widget = this.refs.widgetRef,
            width = this.props.refWidth * this.props.gridWidth - this.props.cellOffset * 2,
            height = this.props.refHeight * this.props.gridHeight - this.props.cellOffset * 2;

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
            x = this.props.refLeft * this.props.gridWidth + this.props.cellOffset,
            y = this.props.refTop * this.props.gridHeight + this.props.cellOffset ;
        if(this.props.tmpTop!=0 || this.props.tmpLeft!=0){
            x += this.props.tmpLeft;
            y += this.props.tmpTop;
        }
        widget.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    }

    setTransition(){
        var widget = this.refs.widgetRef;
        widget.style.transition = this.props.transition;
    }

    setIndex(){
        var widget = this.refs.widgetRef;
        widget.style.zIndex = this.props.index;
    }

    setOpacity(){
        var widget = this.refs.widgetRef;
        widget.style.opacity = this.props.settings.widgetOpacity * .01;
    }

    render(){
        var Content = this.props.content,
            CustomToolbarElem = this.props.toolbar,
            toolbar = "widgetToolbar themeSecondaryColor";

        if(CustomToolbarElem==null) CustomToolbarElem = EmptyToolbar;
        if(!this.props.settings.toolbar) toolbar = "widgetToolbar";

        return(
            <div className = 'widget widgetBackground'
                 ref = 'widgetRef'>
                <div className = {toolbar}
                     ref="widgetToolbarRef">
                    <CustomToolbarElem updateWidgetState={this.props.updateWidgetState}/>
                    <button className="widgetToolbarButtons">1</button>
                    <button className="widgetToolbarButtons">2</button>
                    <button className="widgetToolbarButtons">3</button>
                </div>
                <div className = "widgetContainer" ref="widgetContainerRef">
                    <Content refWidth = {this.props.refWidth}
                             refHeight = {this.props.refHeight}
                             updateWidgetState={this.props.updateWidgetState}/>
                </div>
            </div>
        )

    }
}

class EmptyToolbar extends React.Component {
    render(){
        return(
            <div>
            </div>
        )
    }
}
