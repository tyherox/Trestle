/*Tyherox
*
* The layout module of Scribe handles tasks related to decorating and arranging widgets on the screen.
* Main components include both the widget and its Element object counterpart. Custom data is stored within Widget props
* using React.
*
*/

import React from 'react';
import Widget from '../widget/widget';
import {connectAdvanced} from 'react-redux';
import {bindActionCreators} from 'redux';
import shallowEqual from 'shallowequal';
import Grid from './grid.jsx';
import * as Actions from '../../actions/index';

var key = 1;

//React component in charge of managing graphical layout
class Layout extends React.Component{

    constructor(props){
        super(props);
    }

    //Extract widget bounds
    prepRect(widget){
        return {
            width: widget.get("refWidth"),
            height: widget.get("refHeight"),
            top: widget.get("refTop"),
            left: widget.get("refLeft")
        }
    }

    //Check to see if widget can be placed at current location
    isValidHome(id, rect){
        var self =  this;
        var test = this.props.layout.map(function(entry){
            if(entry.get("id") != id){
                var cRect = self.prepRect(entry);
                if(self.intersects(rect, cRect,0)) {
                    console.log("Checked home: FALSE 1");
                    return false
                }
                else if(rect.left<0 || rect.top<0 || rect.left + rect.width > self.props.screenWidth - 40 || rect.top + rect.height > self.props.screenHeight){
                    console.log("Checked home: FALSE 2");
                    return false;
                }
                else return true;
            }
        });
        if(test.includes(false)) return false;
        else return true;
    }

    /**
     * Layout.intersects
     *
     * Check to see if two rects/Widgets intersect
     *
     * @param cRect: Colliding Rect (order doesn't matter)
     * @param iRect: Iterated Rect (order doesn't matter)
     * @param offset: Optional offset for intersection calculation
     * @returns {boolean}: true for intersect, false for non-intersect
     */
    intersects(cRect, iRect, offset){
        if(((cRect.left>=iRect.left + offset&&cRect.left<iRect.left+iRect.width - offset)||
            (iRect.left + offset>=cRect.left&&iRect.left + offset<cRect.left+cRect.width))&&
            ((cRect.top>=iRect.top + offset &&cRect.top<iRect.top+iRect.height - offset)||
            (iRect.top + offset>=cRect.top&&iRect.top + offset<cRect.top+cRect.height))){
            return true;
        }
        return false;
    };

    componentDidMount(){
        var layout = this.refs.layoutRef;
        layout.style.width = this.props.screenWidth - 40 +'px';
        layout.style.height = this.props.screenHeight +'px';
        layout.style.marginLeft = "40px";
    }

    render(){

        var self = this;

        var widgets = this.props.layout.valueSeq().map(function(widget, i){
            var refined = JSON.stringify(widget.get("id")),
                id = JSON.stringify(widget.get("id"));

            if(refined.includes(".")) refined = refined.substring(0,refined.indexOf("."));
            var widgetRef = self.props.widgets.find(function(elem){
                return elem["id"]==refined;
            });

            if(widgetRef.hasOwnProperty("refWidth")) self.assignHome(widgetRef);

            return(
                <Widget id = {widget.get("id").toString()}
                        key = {widget.get("id")}
                        content = {widgetRef.content}
                        toolbar = {widgetRef.toolbar}
                        minWidth = {widgetRef.minWidth}
                        minHeight = {widgetRef.minHeight}
                        maxWidth = {widgetRef.maxWidth}
                        maxHeight = {widgetRef.maxHeight}
                        validateHome = {self.isValidHome.bind(self)}>
                </Widget>
            )
        });

        return (

            <div id='layout'
                 ref='layoutRef'>
                <Grid />
                {widgets}
            </div>
        );
    }
};

function layoutSelector(dispatch) {
    let state = {};
    let ownProps = {};
    let result = {};
    const actions = bindActionCreators(Actions, dispatch);
    return (nextState, nextOwnProps) => {
        const nextResult = {
            layout: nextState.layout,
            gridCols: nextState.settings.get("gridCols"),
            gridRows: nextState.settings.get("gridRows"),
            screenWidth: nextState.settings.get("screenWidth"),
            screenHeight: nextState.settings.get("screenHeight"),
            reduxActions: actions,
            ...nextOwnProps
        };
        state = nextState;
        ownProps = nextOwnProps;
        if (!shallowEqual(result,nextResult)){
            result = nextResult;
        }
        return result
    }
}

export default connectAdvanced(layoutSelector)(Layout);
