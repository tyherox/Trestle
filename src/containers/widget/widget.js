/**
 * Tyherox
 *
 * Widget
 *
 * The widget class is the template for all widgets of Scribe. It includes the container to place custom content and
 * means to be arranged upon the Layout module.
 */


import Perf from 'react-addons-perf'
import React from 'react';
import Interact from 'interact.js';
import * as Actions from '../../actions/index';
import {connectAdvanced} from "react-redux";
import {bindActionCreators} from 'redux';
import shallowEqual from 'shallowequal';

class Widget extends React.PureComponent{

    constructor(props){
        super(props);

        var sw = this.props.reduxSettings.get("screenWidth"),
            sh = this.props.reduxSettings.get("screenHeight"),
            gc = this.props.reduxSettings.get("gridCols"),
            gr = this.props.reduxSettings.get("gridRows"),
            gridWidth = (sw - 40) / gc,
            gridHeight = sh / gr;

        this.state = {
            tmpWidth: 0,
            tmpHeight: 0,
            tmpTop: 0,
            tmpLeft: 0,
            gridWidth: (sw - 40) / gc,
            gridHeight: sh / gr,
        }
    }

    componentDidMount(){

        var self = this,
            widget = self.refs.widgetRef,
            sw = self.props.reduxSettings.get("screenWidth"),
            sh = self.props.reduxSettings.get("screenHeight"),
            gc = self.props.reduxSettings.get("gridCols"),
            gr = self.props.reduxSettings.get("gridRows"),
            gridWidth = (sw - 40) / gc,
            gridHeight = sh / gr;

        //Initialize Drag Module for Widget
        Interact(widget)
            .draggable({
                inertia: {
                    minSpeed: Infinity,
                },
                snap: {
                    targets: [
                        Interact.createSnapGrid({x: gridWidth, y: gridHeight})
                    ],
                    offset: { x: self.props.reduxSettings.get("cellOffset"), y: self.props.reduxSettings.get("cellOffset") },
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
                    Perf.start()
                    startDrag();
                },
                onmove: function(event){
                    self.setState({
                        tmpLeft: (self.state.tmpLeft + event.dx),
                        tmpTop: (self.state.tmpTop + event.dy)
                    });
                },
                onend: function(){
                    endDrag();
                },
                oninertiastart: function(event){
                    self.props.reduxActions.modifyAtSession("gridVisible", false);
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
                        Interact.createSnapGrid({x: gridWidth, y: gridHeight})
                    ],
                    offset: { x: self.props.reduxSettings.get("cellOffset"), y: self.props.reduxSettings.get("cellOffset") },
                    range: Infinity,
                    relativePoints: [ { x: 0, y: 0 } ],
                    endOnly: true
                },
                restrict: {
                    restriction: 'parent',
                    endOnly: true
                },
                onstart: function(event){
                    Perf.start()
                    startDrag();
                },
                onmove: function(event){
                    var width = event.rect.width,
                        height = event.rect.height,
                        offset = self.props.reduxSettings.get("cellOffset") * 2;

                    if(width<=0) {
                        width = gridWidth - offset;
                    }
                    else if(width>self.props.maxWidth * gridWidth - offset) {
                        width = self.props.maxWidth * gridWidth - offset;
                    }

                    if(height<=0) height = gridHeight - offset;
                    else if(height>self.props.maxHeight * gridHeight - offset) height = self.props.maxHeight * gridHeight - offset;

                    self.setState({
                        tmpWidth: width,
                        tmpHeight: height,
                    });
                },
                onend: function(event){
                    endDrag();
                },
                oninertiastart: function(event){
                    self.props.reduxActions.modifyAtSession("gridVisible", false);
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
            self.setState({
                dragging: true,
                index: 10,
                transition: 'transform 0s, width .0s, height .0s, box-shadow .5s'
            });
            self.props.reduxActions.modifyAtSession("gridVisible", true);
        }

        //Clean up temp variables for drag
        var endDrag = function(){

            var top = self.state.tmpTop,
                left = self.state.tmpLeft,
                width = self.state.tmpWidth,
                height= self.state.tmpHeight;

            var home = {
                top: self.props.reduxLayout.get("refTop") + Math.round(top/gridHeight),
                left: self.props.reduxLayout.get("refLeft") + Math.round(left/gridWidth),
                width: width==0 ?self.props.reduxLayout.get("refWidth") : Math.ceil(width/gridWidth),
                height: height==0 ?self.props.reduxLayout.get("refHeight") : Math.ceil(height/gridHeight),
            };

            if(self.props.validateHome(self.props.id, home)){
                self.props.reduxActions.modifyAtLayout(self.props.id,{
                    refTop: home.top,
                    refLeft: home.left,
                    refWidth: home.width,
                    refHeight: home.height,
                });
            }
            self.setState({
                tmpLeft: 0,
                tmpTop: 0,
                tmpWidth: 0,
                tmpHeight: 0,
                index: 1,
                transition: 'all .5s ease',
                dragging: false,
            })
            Perf.stop()
            Perf.printInclusive(Perf.getLastMeasurements())
            Perf.printWasted(Perf.getLastMeasurements())
        }
    }

    shouldComponentUpdate(props, state){
        var tmpUpdates = false;
        if(this.state.tmpLeft != state.tmpLeft|| this.state.tmpTop != state.tmpTop){
            this.setLocation();
            tmpUpdates = true;
        }
        if(this.state.tmpWidth != state.tmpWidth || this.state.tmpHeight != state.tmpHeight){
            this.setSize();tmpUpdates = true;
        }

        if(tmpUpdates && state.tmpLeft==0 && state.tmpTop==0 &&
            state.tmpWidth==0 && state.tmpHeight==0){
            console.log("TMP UPDATE");
            return true;
        }
        else if(tmpUpdates) {
            console.log("TMP REFUSE:", tmpUpdates, state.tmpLeft, state.tmpTop, state.tmpWidth, state.tmpHeight);
            return false;
        }
        else return true;
    }

    //Use stateless React props to update Widget. Modularized update system avoids irrelevant updates.
    componentDidUpdate(props, state){
        if(this.state.tmpWidth != state.tmpWidth || this.state.tmpHeight != state.tmpHeight||
            this.props.reduxLayout.get("refWidth") != props.reduxLayout.get("refWidth") || this.props.reduxLayout.get("refHeight") != props.reduxLayout.get("refHeight")){
            this.setSize();
        }
        if(this.props.minWidth!=props.minWidth || this.props.minHeight!=props.minHeight){
            this.setMinSize();
        }
        if(this.props.maxWidth!=props.maxWidth || this.props.maxHeight!=props.maxHeight){
            this.setMaxSize();
        }
        if(this.state.tmpLeft != state.tmpLeft|| this.state.tmpTop != state.tmpTop||
            this.props.reduxLayout.get("refLeft") != props.reduxLayout.get("refLeft")|| this.props.reduxLayout.get("refTop") != props.reduxLayout.get("refTop")){
            this.setLocation();
        }
        if(this.state.transition!=state.transition){
            this.setTransition();
        }
        if(this.state.index!=state.index){
            this.setIndex();
        }
        if(this.props.reduxSettings.get("opacity")!=props.reduxSettings.get("opacity")){
            this.setOpacity();
        }
    }

    setSize(){
        var widget = this.refs.widgetRef,
            width = this.props.reduxLayout.get("refWidth") * this.state.gridWidth - this.props.reduxSettings.get("cellOffset") * 2,
            height = this.props.reduxLayout.get("refHeight") * this.state.gridHeight - this.props.reduxSettings.get("cellOffset") * 2;

        if(this.state.tmpWidth != 0 || this.state.tmpHeight != 0){
            width = this.state.tmpWidth;
            height = this.state.tmpHeight;
        }

        widget.style.width = width + "px";
        widget.style.height = height + "px";
    }

    setMinSize(){

        var widget = this.refs.widgetRef;
        widget.style.minWidth = this.props.minWidth * this.state.gridWidth - this.props.reduxSettings.get("cellOffset") * 2 + "px";
        widget.style.minHeight = this.props.minHeight * this.state.gridHeight - this.props.reduxSettings.get("cellOffset") * 2 + "px";
    }

    setMaxSize(){
        var sw = this.props.reduxSettings.get("screenWidth"),
            sh = this.props.reduxSettings.get("screenHeight"),
            gc = this.props.reduxSettings.get("gridCols"),
            gr = this.props.reduxSettings.get("gridRows"),
            gridWidth = (sw - 40) / gc,
            gridHeight = sh / gr;

        var widget = this.refs.widgetRef;
        widget.style.maxWidth = this.props.maxWidth * gridWidth - this.props.reduxSettings.get("cellOffset") * 2 + "px";
        widget.style.maxHeight = this.props.maxHeight * gridHeight - this.props.reduxSettings.get("cellOffset") * 2 + "px";
    }

    setLocation(){

        var widget = this.refs.widgetRef,
            x = this.props.reduxLayout.get("refLeft") * this.state.gridWidth + this.props.reduxSettings.get("cellOffset"),
            y = this.props.reduxLayout.get("refTop") * this.state.gridHeight + this.props.reduxSettings.get("cellOffset") ;
        if(this.state.tmpTop!=0 || this.state.tmpLeft!=0){
            x += this.state.tmpLeft;
            y += this.state.tmpTop;
        }

        widget.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    }

    setTransition(){
        var widget = this.refs.widgetRef;
        widget.style.transition = this.state.transition || 'all .5s ease';
    }

    setIndex(){
        var widget = this.refs.widgetRef;
        widget.style.zIndex = this.state.index;
    }

    setOpacity(){
        var widget = this.refs.widgetRef;
        widget.style.opacity = this.props.reduxSettings.get("opacity") * .01;
    }

    render(){

        console.log("Rendering Widget:", this.props.id);

        var Content = this.props.content,
            CustomToolbarElem = this.props.toolbar,
            toolbarClass = "widgetToolbar themeSecondaryColor";

        if(CustomToolbarElem==null) CustomToolbarElem = EmptyToolbar;
        if(!this.props.reduxSettings.get("toolbarToggle")) toolbarClass = "widgetToolbar";

        return(
            <div className = 'widget widgetBackground'
                 ref = 'widgetRef'>
                <div className = {toolbarClass}
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

function selectorFactory(dispatch, props) {
    let state = {};
    let ownProps = {};
    let result = {};
    const actions = bindActionCreators(Actions, dispatch);
    return (nextState, nextOwnProps) => {
        const nextResult = {reduxLayout: nextState.layout.get(nextOwnProps.id), reduxSettings: nextState.settings, reduxActions: actions, ...nextOwnProps};
        state = nextState;
        ownProps = nextOwnProps;
        if (!shallowEqual(result,nextResult)){
            result = nextResult;
        }
        return result
    }
}

export default connectAdvanced(selectorFactory)(Widget);
