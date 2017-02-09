/*Tyherox
*
* The layout module of Scribe handles tasks related to decorating and arranging widgets on the screen.
* Main components include both the widget and its Element object counterpart. Custom data is stored within Widget props
* using React.
*
*/

import React from 'react';
import Widget from '../widget/widget';
import MenuBar from '../menubar/menuBar';

var key = 1;

//React component in charge of managing graphical layout
export default class Layout extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            gridToggled: false
        };
    }

    //Clean temporary props of Widgets. Used for dragging (Interact.js)
    solidifyWidgets(){
        var widgets = this.props.widgets,
            layout = [],
            self = this;

        widgets.forEach(function(widget){
            console.log("!!!", widget);
            layout.push({
                id: widget.id,
                refWidth: widget.refWidth,
                refHeight: widget.refHeight,
                refLeft: widget.refLeft,
                refTop: widget.refTop
            });
        })
        this.props.setLayout(layout);
    }

    toggleGrid(visibility){
        console.log("Toggling GRID:",visibility);
        this.setState({gridToggled: visibility});
    }

    findX(column){
        return Math.round(column * this.props.gridWidth + this.props.cellOffset);
    }

    findY(row){
        return Math.round(row * this.props.gridHeight + this.props.cellOffset);
    }

    findRow(y){
        return Math.round(y/this.props.gridHeight);
    }

    findCol(x){
        return Math.round(x/this.props.gridWidth);
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
            width: widget.refWidth,
            height: widget.refHeight,
            top: widget.refTop,
            left: widget.refLeft,
        }
    }

    //Check to see if widget can be placed at current location
    isValidHome(widget){
        var rect = this.prepRect(widget);
        for(var i = 0; i<this.props.widgets.length; i ++){
            if(this.props.widgets[i].id != widget.id){
                var cRect = this.prepRect(this.props.widgets[i]);
                if(this.intersects(rect, cRect,50)) {
                    return false;
                }
                else if(rect.left<0 || rect.top<0 || rect.left + rect.width > this.props.screenWidth - 40 || rect.top + rect.height > this.props.screenHeight){
                    return false;
                }
            }
        }
        return true;
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
        if(((cRect.left>=iRect.left + offset&&cRect.left<=iRect.left+iRect.width - offset)||
            (iRect.left + offset>=cRect.left&&iRect.left + offset<=cRect.left+cRect.width))&&
            ((cRect.top>=iRect.top + offset &&cRect.top<=iRect.top+iRect.height - offset)||
            (iRect.top + offset>=cRect.top&&iRect.top + offset<=cRect.top+cRect.height))){
            return true;
        }
        return false;
    };

    render(){

        var self = this;
        var widgets = this.props.widgets.map(function(widget, i){

            console.log("1!:", self.props.widgets);
            console.log("2!:", self.props.layout);

            var widgetRef = self.props.layout.find(function(elem){
                return elem["id"]==widget.id;
            });

            var width = widgetRef["refWidth"],
                height = widgetRef["refHeight"],
                top = widgetRef["refTop"],
                left = widgetRef["refLeft"];

            return(
                <Widget id = {widget.id}
                        key = {widget.id}
                        content = {widget.content}
                        toolbar = {widget.toolbar}
                        dragging = {false}
                        pushed = {false}
                        solidifyWidgets = {self.solidifyWidgets.bind(self)}
                        tmpWidth = {widget.tmpWidth || 0}
                        tmpHeight = {widget.tmpHeight || 0}
                        tmpLeft = {widget.tmpLeft || 0}
                        tmpTop = {widget.tmpTop || 0}
                        refWidth = {width}
                        refHeight = {height}
                        refLeft = {left}
                        refTop = {top}
                        minWidth = {widget.minWidth}
                        minHeight = {widget.minHeight}
                        maxWidth = {widget.maxWidth}
                        maxHeight = {widget.maxHeight}
                        gridWidth = {self.props.gridWidth}
                        gridHeight = {self.props.gridHeight}
                        cellOffset = {self.props.cellOffset}
                        index = {widget.index || 0}
                        transition = {widget.transition || 'all .5s ease'}
                        toggleGrid = {self.toggleGrid.bind(self)}
                        validateHome = {self.isValidHome.bind(self)}
                        settings = {self.props.settings}
                        updateWidgetState={self.props.updateWidgetState}>
                </Widget>
            )
        });

        return (
            <div className='layout'
                 ref='layoutRef'>
                <Grid gridCols={this.props.gridCols}
                      gridRows={this.props.gridRows}
                      screenWidth = {this.props.screenWidth}
                      screenHeight = {this.props.screenHeight}
                      widgets = {widgets}
                      visibility = {this.state.gridToggled}>
                </Grid>
            </div>
        );
    }
};


//React component that draws the grid
class Grid extends React.Component{

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
            visibility = this.props.visibility;
        if(visibility) {
            canvas.style.opacity = '1';
        }
        else {
            canvas.style.opacity = '0';
        }
    }

    render(){
        return (
            <div id = 'gridContainer'>
                <canvas id = 'grid'
                        ref = 'gridRef'
                        className = 'themeGridColor'
                        onClick = {this.props.exit}>
                </canvas>
                {this.props.widgets}
            </div>
        );
    }
}
