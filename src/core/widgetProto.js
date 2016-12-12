/**
 * Created by JohnBae on 11/21/16.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Interact from 'interact.js';

export default class Widget extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            gridHeight: this.props.gridHeight,
            gridWidth: this.props.gridWidth,
            width: this.props.width,
            height: this.props.height,
            maxWidth: this.props.maxWidth,
            maxHeight: this.props.maxHeight,
            minWidth: this.props.minWidth,
            minHeight: this.props.minHeight,
            xCord: this.props.xCord,
            yCord: this.props.yCord,
            tempXCord: this.props.tempXCord,
            tempYCord: this.props.tempYCord,
            pushing: this.props.pushing,
            resetting: this.props.resetting,
            id: this.props.id,
            dragging: false
        };
    }

    componentDidMount(){

        var self = this, widget = self.refs.widgetRef;

        self.setSize(this.state.width, this.state.height);
        self.setLocation(this.state.xCord, this.state.yCord);
        self.setState({xCord: (self.state.xCord + 2), yCord: (self.state.yCord + 2)});
        widget.style.transform = 'translate(' + (self.state.xCord + 2)+ 'px, ' + (self.state.yCord + 2) + 'px)';

        Interact(widget)
            .draggable({
                inertia: true,
                snap: {
                    targets: [
                        Interact.createSnapGrid({ x: this.state.width + 4, y: this.state.height + 4})
                    ],
                    offset: { x: 2, y: 2 },
                    range: Infinity,
                    endOnly: true,
                    relativePoints: [ { x: 0, y: 0 } ]
                },
                restrict: {
                    restriction: 'parent',
                    elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
                    endOnly: true
                },
            })
            .on('dragstart', function(e){
                widget.style.transition = 'transform 0s, width .5s, height .5s, box-shadow .5s';
                self.props.toggleGrid(true);
                self.setState({dragging: true});
            })
            .on('dragmove', function (e) {
                self.setState({xCord: (self.state.xCord + e.dx), yCord: (self.state.yCord + e.dy)});
                widget.style.transform = 'translate(' + (self.state.xCord)+ 'px, ' + (self.state.yCord) + 'px)';
            })
            .on('draginertiastart', function(e){
                self.props.toggleGrid(false);
                self.setState({dragging: true});
            })
            .on('dragend', function(e){
                widget.style.transition = 'all .5s ease';
                e.target.style.zIndex = 10;
            })
            .actionChecker(function (pointer, event, action, interactable, element, interaction) {
                if(action.name=='drag'){
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
    }

    componentDidUpdate(){
        this.setSize(this.state.width, this.state.height);
        this.setLocation(this.state.xCord, this.state.yCord);
    }

    setSize(width, height){
        var widget = this.refs.widgetRef;
        widget.style.width = width + "px";
        widget.style.height = height + "px";
    }

    setLocation(x, y){
        var widget = this.refs.widgetRef;
        widget.style.top = y + "px";
        widget.style.left = x + "px";
    }

    render(){
        if(this.props.id) return(
            <div className = 'widget widgetBackground'
                 ref = 'widgetRef'>
                <div className = 'widgetToolbar themeSecondaryColor'
                     ref="widgetToolbarRef">
                </div>
                <div className = 'widgetContent'
                     ref="widgetContentREf">
                </div>
            </div>
        )
    }
}
