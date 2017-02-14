/*Tyherox
*
* The layout module of Scribe handles tasks related to decorating and arranging widgets on the screen.
* Main components include both the widget and its Element object counterpart. Custom data is stored within Widget props
* using React.
*
*/

import React from 'react';
import Widget from '../widget/widget';
import {connect} from 'react-redux'
import MenuBar from '../menubar/menuBar';

var key = 1;

//React component in charge of managing graphical layout
class Layout extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            gridToggled: false
        };
    }

    //Clean temporary props of Widgets. Used for dragging (Interact.js)
    solidifyWidgets(){
        var currentLayout = this.props.layout,
            newLayout = [],
            self = this;

        currentLayout.forEach(function(layout){

            var source = layout.state;
            if(typeof source === "undefined" || Object.keys(source).length==0){
                source = layout;
            }

            layout.refWidth = source.refWidth;
            layout.refHeight = source.refHeight;
            layout.refLeft = source.refLeft;
            layout.refTop = source.refTop;
            newLayout.push(layout);
        });
        this.props.setLayout(newLayout);
    }

    toggleGrid(visibility){
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
    isValidHome(id, rect){
        for(var i = 0; i<this.props.layout.length; i ++){
            if(this.props.layout[i].id != id){
                var cRect = this.prepRect(this.props.layout[i]);
                if(this.intersects(rect, cRect,0)) {
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
        if(((cRect.left>=iRect.left + offset&&cRect.left<iRect.left+iRect.width - offset)||
            (iRect.left + offset>=cRect.left&&iRect.left + offset<cRect.left+cRect.width))&&
            ((cRect.top>=iRect.top + offset &&cRect.top<iRect.top+iRect.height - offset)||
            (iRect.top + offset>=cRect.top&&iRect.top + offset<cRect.top+cRect.height))){
            return true;
        }
        return false;
    };

    findAvailableSpace(id,w,h){
        var currentLayout = this.props.layout,
            newLayout = [],
            self = this;

        currentLayout.forEach(function(layout){
            if(id==layout.id){

            }
            else newLayout.push({
                id: layout.id,
                refWidth: layout.state.refWidth,
                refHeight: layout.state.refHeight,
                refLeft: layout.state.refLeft,
                refTop: layout.state.refTop,
                state: layout.state
            });
        })
        this.props.setLayout(newLayout);
    }

    generateMultiId(id){
        id = id.replace(/"/g,"");
        var offset = 1,
            generated = id + "." + offset.toString();

        while(this.props.layout.find(function(id){
            return id==generated
        })){
            generated = id + "." + (++offset).toString();
        }
        return generated;
    }

    render(){

        var self = this, {store} = this.context;
        console.log("STORE TEST:", store);
        
        var widgets = this.props.layout.map(function(widget, i){

            var id = JSON.stringify(widget.id);

            if(id.includes(".")) id = id.substring(0,id.indexOf("."));
            var widgetRef = self.props.widgets.find(function(elem){
                return elem["id"]==id;
            });

            var width = widget["refWidth"],
                height = widget["refHeight"],
                top = widget["refTop"],
                left = widget["refLeft"],
                state = widgetRef.state;

            return(
                <Widget id = {widget.id}
                        key = {widget.id}
                        content = {widgetRef.content}
                        toolbar = {widgetRef.toolbar}
                        dragging = {false}
                        pushed = {false}
                        solidifyWidgets = {self.solidifyWidgets.bind(self)}
                        tmpWidth = {(widget.state && widget.state.tmpWidth) || 0}
                        tmpHeight = {(widget.state && widget.state.tmpHeight) || 0}
                        tmpLeft = {(widget.state && widget.state.tmpLeft) || 0}
                        tmpTop = {(widget.state && widget.state.tmpTop)|| 0}
                        refWidth = {width}
                        refHeight = {height}
                        refLeft = {left}
                        refTop = {top}
                        minWidth = {widgetRef.minWidth}
                        minHeight = {widgetRef.minHeight}
                        maxWidth = {widgetRef.maxWidth}
                        maxHeight = {widgetRef.maxHeight}
                        gridWidth = {self.props.gridWidth}
                        gridHeight = {self.props.gridHeight}
                        cellOffset = {self.props.cellOffset}
                        saveStorage = {self.props.saveWidgetStorage}
                        readStorage = {self.props.readWidgetStorage}
                        index = {(widget.state && widget.state.index) || 0}
                        transition = {(widget.state && widget.state.transition) || 'all .5s ease'}
                        toggleGrid = {self.toggleGrid.bind(self)}
                        validateHome = {self.isValidHome.bind(self)}
                        settings = {self.props.settings}
                        getWidgetState = {self.props.getWidgetState}
                        renameWidgetStorage = {self.props.renameWidgetStorage}
                        deleteWidgetStorage = {self.props.deleteWidgetStorage}
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

export default connect()(Layout);
