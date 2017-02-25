/*Tyherox
*
* The layout module of Scribe handles tasks related to decorating and arranging widgets on the screen.
* Main components include both the widget and its Element object counterpart. Custom data is stored within Widget props
* using React.
*
*/

import React from 'react';
import Widget from '../widget/widget';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import MenuBar from '../menubar/menuBar';
import * as Actions from '../../actions/index';
import shallowEqual from 'shallowequal';

var key = 1;

//React component in charge of managing graphical layout
export default class Layout extends React.PureComponent{

    constructor(props){
        super(props);

        this.state = {
            gridToggled: false
        };
    }

    toggleGrid(visibility){
        console.log("TOGGLING GRID");
        this.setState({gridToggled: visibility});
    }

    findX(column){
        return Math.round(column * this.props.store.getState().settings.get("gridWidth") + this.props.store.settings.get("cellOffset"));
    }

    findY(row){
        return Math.round(row * this.props.store.getState().settings.get("gridHeight") + this.props.store.settings.get("cellOffset"));
    }

    findRow(y){
        return Math.round(y/this.props.store.getState().settings.get("gridHeight"));
    }

    findCol(x){
        return Math.round(x/this.props.store.getState().settings.get("gridWidth"));
    }

    findNearestRow(y){
        return this.findY(this.findRow(y));
    }

    findNearestCol(x){
        return this.findX(this.findCol(x));
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
        var test = this.props.store.getState().layout.map(function(entry){
            if(entry.get("id") != id){
                var cRect = self.prepRect(entry);
                if(self.intersects(rect, cRect,0)) {
                    console.log("Checked home: FALSE 1")
                    return false
                }
                else if(rect.left<0 || rect.top<0 || rect.left + rect.width > self.props.screenWidth - 40 || rect.top + rect.height > self.props.screenHeight){
                    console.log("Checked home: FALSE 2")
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
        layout.style.width = this.props.store.getState().settings.get("screenWidth") +'px';
        layout.style.height = this.props.store.getState().settings.get("screenHeight") +'px';
        layout.style.marginLeft = "40px";
    }

    render(){

        console.log("Rendering: Layout");

        var self = this;

        var widgets = this.props.store.getState().layout.valueSeq().map(function(widget, i){
            var id = JSON.stringify(widget.get("id"));

            if(id.includes(".")) id = id.substring(0,id.indexOf("."));
            var widgetRef = self.props.widgets.find(function(elem){
                return elem["id"]==id;
            });

            return(
                <Widget id = {widget.get("id").toString()}
                        key = {widget.get("id")}
                        content = {widgetRef.content}
                        toolbar = {widgetRef.toolbar}
                        dragging = {false}
                        pushed = {false}
                        minWidth = {widgetRef.minWidth}
                        minHeight = {widgetRef.minHeight}
                        maxWidth = {widgetRef.maxWidth}
                        maxHeight = {widgetRef.maxHeight}
                        toggleGrid = {self.toggleGrid.bind(self)}
                        validateHome = {self.isValidHome.bind(self)}>
                </Widget>
            )
        });

        return (

            <div id='layout'
                 ref='layoutRef'>
                <ConnectedGrid gridCols={self.props.store.getState().settings.get("gridCols")}
                      gridRows={self.props.store.getState().settings.get("gridRows")}
                      screenWidth = {self.props.store.getState().settings.get("screenWidth")}
                      screenHeight = {self.props.store.getState().settings.get("screenHeight")}
                      visibility = {this.state.gridToggled}>
                </ConnectedGrid>
                {widgets}
            </div>
        );
    }
};


//React component that draws the grid
class Grid extends React.PureComponent{

    componentDidMount(){
        var w = this.props.screenWidth - 40, h = this.props.screenHeight,
            wOffs = w/this.props.gridCols,
            hOffs = h/this.props.gridRows,
            canvas = this.refs.gridRef,
            ctx = canvas.getContext('2d');

        ctx.canvas.width  = w;
        ctx.canvas.height = h;
        ctx.strokeStyle = getComputedStyle(canvas).getPropertyValue('border-color');
        //ctx.setLineDash([1, 8]);
        ctx.lineWidth=1;
        ctx.stroke();
        for (let x=0;x<=w;x+=wOffs) {
            for (let y=0;y<=h;y+=hOffs) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }
        }

        var grid = document.getElementById('gridContainer');
        grid.style.minHeight = h + 'px';
        grid.style.minWidth = w + 'px';

        this.forceUpdate();
    }

    componentDidUpdate(){
        var canvas = this.refs.gridRef,
            visibility = this.props.visible,
            current = canvas.style.opacity == 1;
        if(visibility) {
            canvas.style.opacity = '0';
        }
        else {
            canvas.style.opacity = '0';
        }
    }

    render(){
        console.log("Rendering: Grid");
        return (
            <div id = 'gridContainer'>
                <canvas id = 'grid'
                        ref = 'gridRef'
                        className = 'themeGridColor'
                        onClick = {this.props.exit}>
                </canvas>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({visible: state.session.get("gridVisible")});

const mapDispatchToProps = (dispatch) => ({reduxActions: bindActionCreators(Actions, dispatch)});

const areStatesEqual = (prev, next) => shallowEqual(prev.session.get("gridVisible"),next.session.get("gridVisible"));

var ConnectedGrid = connect(mapStateToProps, mapDispatchToProps, null, {areStatesEqual: areStatesEqual})(Grid);
