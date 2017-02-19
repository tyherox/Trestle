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
import * as Actions from '../../actions/index';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';

class Widget extends React.Component{
    componentDidMount(){

        var self = this,
            widget = self.refs.widgetRef;

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
                    self.props.reduxActions.modifyAtLayout(self.props.id, {
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
                        Interact.createSnapGrid({ x: self.props.gridWidth , y: self.props.gridHeight })
                    ],
                    offset: { x: self.props.cellOffset, y: self.props.cellOffset },
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

                    self.props.reduxActions.modifyAtLayout(self.props.id,{
                        tmpWidth: width,
                        tmpHeight: height,
                    });
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

        //Prep Layout/Widget for drag
        var startDrag = function(){
            self.props.toggleGrid(true);
            self.props.reduxActions.modifyAtLayout(self.props.id,{
                dragging: true,
                index: 10,
                transition: 'transform 0s, width .0s, height .0s, box-shadow .5s'
            });
        }

        //Clean up temp variables for drag
        var endDrag = function(){

            var top = self.props.tmpTop,
                left = self.props.tmpLeft,
                width = self.props.tmpWidth,
                height= self.props.tmpHeight;

            var home = {
                top: self.props.refTop + Math.round(top/self.props.gridHeight),
                left: self.props.refLeft + Math.round(left/self.props.gridWidth),
                width: width==0 ?self.props.refWidth : Math.ceil(width/self.props.gridWidth),
                height: height==0 ?self.props.refHeight : Math.ceil(height/self.props.gridHeight),
            };

            if(self.props.validateHome(self.props.id, home)){
                console.log("FOUND HOME:", home);
                self.props.reduxActions.modifyAtLayout(self.props.id,{
                    index: 1,
                    transition: 'all .5s ease',
                    dragging: false,
                    refTop: home.top,
                    refLeft: home.left,
                    refWidth: home.width,
                    refHeight: home.height,
                    tmpLeft: 0,
                    tmpTop: 0,
                    tmpWidth: 0,
                    tmpHeight: 0
                }, false, self.props.solidifyWidgets);
            }
            else{
                self.props.reduxActions.modifyAtLayout(self.props.id,{
                    index: 1,
                    transition: 'all .5s ease',
                    dragging: false,
                    tmpLeft: 0,
                    tmpTop: 0,
                    tmpWidth: 0,
                    tmpHeight: 0
                }, false, self.props.solidifyWidgets);
            }
        }

    }

    //Use stateless React props to update Widget. Modularized update system avoids irrelevant updates.
    componentDidUpdate(props){

        if(this.props.tmpWidth != props.tmpWidth || this.props.tmpHeight != props.tmpHeight||
            this.props.refWidth != props.refWidth || this.props.refHeight != props.refHeight) this.setSize();
        if(this.props.minWidth!=props.minWidth || this.props.minHeight!=props.minHeight) this.setMinSize();
        if(this.props.maxWidth!=props.maxWidth || this.props.maxHeight!=props.maxHeight)this.setMaxSize();
        if(this.props.tmpLeft != props.tmpLeft|| this.props.tmpTop != props.tmpTop||
            this.props.refLeft != props.refLeft|| this.props.refTop != props.refTop)this.setLocation();
        if(this.props.transition!=props.transition)this.setTransition();
        if(this.props.index!=props.index)this.setIndex();
        if(this.props.opacity!=props.opacity)this.setOpacity()

    }

    setSize(){

        var widget = this.refs.widgetRef,
            width = this.props.refWidth * this.props.gridWidth - this.props.cellOffset * 2,
            height = this.props.refHeight * this.props.gridHeight - this.props.cellOffset * 2;

        if(this.props.tmpWidth != 0 || this.props.tmpHeight != 0){
            width = this.props.tmpWidth;
            height = this.props.tmpHeight;
        }

        console.log(this.props.refWidth, this.props.gridWidth);

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
        widget.style.transition = this.props.transition || 'all .5s ease';
    }

    setIndex(){
        var widget = this.refs.widgetRef;
        widget.style.zIndex = this.props.index;
    }

    setOpacity(){
        var widget = this.refs.widgetRef;
        widget.style.opacity = this.props.opacity * .01;
    }

    shouldComponentUpdate(props, state){
        if(props===this.props && state===this.state){
            console.log("SAME SAME!");
            return false;
        }
        return true;
    }

    render(){
        var Content = this.props.content,
            CustomToolbarElem = this.props.toolbar,
            toolbar = "widgetToolbar themeSecondaryColor";

        if(CustomToolbarElem==null) CustomToolbarElem = EmptyToolbar;
        if(!this.props.toolbar) toolbar = "widgetToolbar";
        return(
            <div className = 'widget widgetBackground'
                 ref = 'widgetRef'>
                <div className = {toolbar}
                     ref="widgetToolbarRef">
                    <CustomToolbarElem id = {this.props.id}/>
                    <button className="widgetToolbarButtons">1</button>
                    <button className="widgetToolbarButtons">2</button>
                    <button className="widgetToolbarButtons">3</button>
                </div>
                <div className = "widgetContainer" ref="widgetContainerRef">
                    <Content id = {this.props.id}/>
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

const mapStateToProps = (state, props) => ({
    reduxState: state.layout.get(props.id.toString()),
    refWidth: state.layout.get(props.id.toString()).get("refWidth"),
    refHeight: state.layout.get(props.id.toString()).get("refHeight"),
    refLeft: state.layout.get(props.id.toString()).get("refLeft"),
    refTop: state.layout.get(props.id.toString()).get("refTop"),
    tmpWidth: state.layout.get(props.id.toString()).get("tmpWidth"),
    tmpHeight: state.layout.get(props.id.toString()).get("tmpHeight"),
    tmpLeft: state.layout.get(props.id.toString()).get("tmpLeft"),
    tmpTop: state.layout.get(props.id.toString()).get("tmpTop"),
    transition: state.layout.get(props.id.toString()).get("transition"),
    index: state.layout.get(props.id.toString()).get("index"),
    opacity: state.settings.get("widgetOpacity"),
    gridWidth: (state.settings.get("screenWidth") - 40 ) / state.settings.get("gridCols"),
    gridHeight: state.settings.get("screenHeight") / state.settings.get("gridRows"),
    cellOffset: state.settings.get("cellOffset")
});

const mapDispatchToProps = (dispatch) => ({
    reduxActions: bindActionCreators(Actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Widget);
