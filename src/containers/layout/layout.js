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

        this.manualLayout();

        this.state = {
            screenWidth: this.props.screenWidth,
            screenHeight: this.props.screenHeight,
            gridCols: this.props.cols,
            gridRows: this.props.rows,
            gridHeight: this.props.screenHeight/5,
            gridWidth: (this.props.screenWidth - 40)/8,
            cellOffset: 4,
            widgets: this.props.widgets || [],
            gridToggled: false
        };
    }

    manualLayout(){
        var self = this;

        this.props.layout.map(function(attr){
            var id = attr["id"];
            var widgets = self.props.widgets;
            widgets.forEach(function(widget){
                if(id==widget.id) {
                    for(var prop in attr) {
                        widget[prop] = attr[prop];
                    }
                }
            })
        });
    }

    componentDidMount(){
        this.translateToLocalScreen();
    }

    //Initialize Widget Locations based on col and row variables for screen size independence
    translateToLocalScreen(){
        var widgets = this.props.widgets, self = this;
        widgets.forEach(function(widget){
            if(widget.refLeft!=null && widget.refTop!=null){
                widget.actLeft = self.findX(widget.refLeft);
                widget.actTop = self.findY(widget.refTop);
            }
            if(widget.refWidth!=null && widget.refHeight!=null){
                widget.actWidth = widget.refWidth * self.state.gridWidth - self.state.cellOffset * 2;
                widget.actHeight = widget.refHeight * self.state.gridHeight - self.state.cellOffset * 2;
            }
        })
    }

    /**
     * Layout.updateWidget
     *
     * Update Widgets through props. Allows for stateless widget components
     * @param id: Id of widget
     * @param attributes: Attributes that need to be changed
     */
    updateWidget(id, attributes){
        var widgets = this.state.widgets;
        widgets.forEach(function(widget){
            if(id==widget.id) {
                for(var prop in attributes) {
                    widget[prop] = attributes[prop];
                }
            }
        })
        this.setState({widgets:widgets});
    }

    //Clean temporary props of Widgets. Used for dragging (Interact.js)
    solidifyWidgets(){
        var widgets = this.state.widgets,
            self = this;

        widgets.forEach(function(widget){
            widget.actWidth = widget.tmpWidth == 0 ? widget.actWidth : widget.tmpWidth,
            widget.actHeight = widget.tmpHeight == 0 ? widget.actHeight : widget.tmpHeight,
            widget.tmpWidth = 0;
            widget.tmpHeight = 0;
            widget.refWidth = Math.round(widget.actWidth/self.state.gridWidth);
            widget.refHeight = Math.round(widget.actHeight/self.state.gridHeight);
            widget.actLeft += widget.tmpLeft;
            widget.actTop += widget.tmpTop;
            widget.tmpLeft = 0;
            widget.tmpTop = 0;
            widget.refLeft = self.findCol(widget.actLeft);
            widget.refTop = self.findRow(widget.actTop);
            self.props.saveLayout(widget.id,{
                refWidth: widget.refWidth,
                refHeight: widget.refHeight,
                refLeft: widget.refLeft,
                refTop: widget.refTop
            });
        })
        this.setState({widgets:widgets});
    }

    addWidget(widget){
        var widgets = this.state.widgets;
        var newWidget = {id: key};
        widgets = widgets.concat([newWidget]);
        this.setState({widgets: widgets});
        key++;
    }

    removeWidget(element) {

    }

    toggleGrid(visibility){
        this.setState({gridToggled: visibility});
    }

    findX(column){
        return Math.round(column * this.state.gridWidth + this.state.cellOffset);
    }

    findY(row){
        return Math.round(row * this.state.gridHeight + this.state.cellOffset);
    }

    findRow(y){
        return Math.round(y/this.state.gridHeight);
    }

    findCol(x){
        return Math.round(x/this.state.gridWidth);
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
            width: widget.tmpWidth == 0 ? widget.actWidth : widget.tmpWidth,
            height: widget.tmpHeight == 0 ? widget.actHeight : widget.tmpHeight,
            top: widget.actTop + widget.tmpTop,
            left: widget.actLeft + widget.tmpLeft,
        }
    }

    //Check to see if widget can be placed at current location
    isValidHome(widget){
        var rect = this.prepRect(widget);
        for(var i = 0; i<this.state.widgets.length; i ++){
            if(this.state.widgets[i].id != widget.id){
                var cRect = this.prepRect(this.state.widgets[i]);
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

    useSavedLayout(data){
        var widgets = this.state.widgets;
        widgets.forEach(function(widget){
            data.forEach(function(iteration){
                if(iteration["id"]==widget.id) {
                    for(var prop in iteration) {
                        widget[prop] = iteration[prop];
                    }
                }
            })
        });
    }

    //Logic for widget collision (Currently in Testing Phase)
    collisionDetect(id){

        var self = this;

        var findHome = function(widget){
            return {
                width: widget.actWidth,
                height: widget.actHeight,
                top: widget.actTop,
                left: widget.actLeft,
            }
        }

        var findPushDirection = function(id, cRect, iRect){

            var gauge = {
                top: 0,
                left: 0,
                bottom: 0,
                right: 0
            }

            if(cRect.top<iRect.top){
                gauge.top = iRect.top;
            }
            else gauge.top = cRect.top;

            if(cRect.top + cRect.height<iRect.top + iRect.height){
                gauge.bottom = cRect.top + cRect.height;
            }
            else gauge.bottom = iRect.top + iRect.height;

            if(cRect.left<iRect.left){
                gauge.left = iRect.left;
            }
            else gauge.left = cRect.left;

            if(cRect.left + cRect.width<iRect.left + iRect.width){
                gauge.right = cRect.left + cRect.width;
            }
            else gauge.right = iRect.left + iRect.width;

            var iRect_width = gauge.right - gauge.left;
            var iRect_height = gauge.bottom - gauge.top;

            var right = 0, left = 0, up = 0, down = 0;

            if(gauge.bottom == iRect.top + iRect_height) down = iRect_width;
            else if(gauge.top == iRect.top + iRect.height - iRect_height) up = iRect_width;
            if(gauge.left == iRect.left + iRect.width - iRect_width) left = iRect_height;
            else if(gauge.right == iRect.left + iRect_width) right = iRect_height;

            var max = Math.max(right,left,up,down);
            console.log("MAX:", max);
            if(max==0) return 'none';

            var gridHeight = self.state.gridHeight,
                gridWidth = self.state.gridWidth,
                offset = self.state.cellOffset;

            switch(max){
                case right :
                    iRect.left += gridWidth;
                    if(isValidHome(id,iRect)){
                        return {direction: "right", magnitude: gridWidth};
                    }
                    iRect.left -= (gridWidth + Math.round(iRect.width/gridWidth)*gridWidth);
                    if(isValidHome(id,iRect)){
                        console.log(gridWidth)
                        return {direction: "left", magnitude: -Math.round(iRect.width/gridWidth)*gridWidth};;
                    }
                    else return {direction: "r none", magnitude: 0};
                case left :
                    iRect.left -= gridWidth ;
                    if(isValidHome(id,iRect)){
                        return {direction: "left", magnitude: -gridWidth};;
                    }
                    iRect.left = cRect.left+cRect.width;
                    if(isValidHome(id,iRect)){
                        return {direction: "right", magnitude: cRect.left+cRect.width - iRect.width};;
                    }
                    else return {direction: "l none", magnitude: 0};
                case up :
                    iRect.top -= cRect.height;
                    if(isValidHome(id,iRect)){
                        return "up";
                    }
                    iRect.top += cRect.height * 2;
                    if(isValidHome(id,iRect)){
                        return "down";
                    }
                    else return {direction: "none", magnitude: 0};
                case down :
                    iRect.top += cRect.height;
                    if(isValidHome(id,iRect)){
                        return "down";
                    }
                    iRect.top -= cRect.height * 2;
                    if(isValidHome(id,iRect)){
                        return "up";
                    }
                    else return {direction: "none", magnitude: 0};
            }
        };

        var collider, cRect;

        for(var i = 0; i<this.state.widgets.length; i ++){
            if(this.state.widgets[i].id == id){
                collider = this.state.widgets[i];
            }
        }

        cRect = this.prepRect(collider);

        this.state.widgets.forEach(function(widget){
            if(!widget.dragging){
                var iRect = prepRect(widget);

                if(collides(cRect,iRect, 50) && !widget.pushed){
                    var push = findPushDirection(widget.id, cRect, iRect);
                    console.log("Direction:", push);
                    switch(push.direction){
                        case "right" :
                            widget.tmpLeft += push.magnitude;
                            widget.pushed = true;
                            break;
                        case "left" :
                            widget.tmpLeft += push.magnitude;
                            widget.pushed = true;
                            break;
                        case "down" :
                            widget.tmpTop += cRect.height + self.state.cellOffset * 2;
                            widget.pushed = true;
                            break;
                        case "up" :
                            widget.tmpTop += cRect.height + self.state.cellOffset * 2;
                            widget.pushed = true;
                            break;
                    }
                }
                else if(widget.pushed){

                    var x = widget.actLeft, y = widget.actTop;
                    console.log("Validating for home");
                    if(isValidHome(widget.id, findHome(widget))) {
                        widget.tmpTop = 0;
                        widget.tmpLeft = 0;
                        widget.pushed = false;
                        console.log("Resetting");
                    }
                }
            }
        });
        this.forceUpdate();
    }

    render(){

        this.manualLayout();
        this.translateToLocalScreen();

        var self = this;
        var widgets = this.state.widgets.map(function(widget, i){

            return(
                <Widget id = {widget.id}
                        key = {widget.id}
                        content = {widget.content}
                        toolbar = {widget.toolbar}
                        dragging = {false}
                        pushed = {false}
                        collisionDetect = {self.collisionDetect.bind(self)}
                        solidifyWidgets = {self.solidifyWidgets.bind(self)}
                        update = {self.updateWidget.bind(self)}
                        actWidth = {widget.actWidth}
                        actHeight = {widget.actHeight}
                        actLeft = {widget.actLeft}
                        actTop = {widget.actTop}
                        tmpWidth = {widget.tmpWidth}
                        tmpHeight = {widget.tmpHeight}
                        tmpLeft = {widget.tmpLeft}
                        tmpTop = {widget.tmpTop}
                        refWidth = {widget.refWidth}
                        refHeight = {widget.refHeight}
                        refLeft = {widget.refLeft}
                        refTop = {widget.refTop}
                        minWidth = {widget.minWidth}
                        minHeight = {widget.minHeight}
                        maxWidth = {widget.maxWidth}
                        maxHeight = {widget.maxHeight}
                        gridWidth = {self.state.gridWidth}
                        gridHeight = {self.state.gridHeight}
                        cellOffset = {self.state.cellOffset}
                        index = {widget.index || 0}
                        transition = {widget.transition || 'all .5s ease'}
                        toggleGrid = {self.toggleGrid.bind(self)}
                        validateHome = {self.isValidHome.bind(self)}
                        config = {self.props.config}>
                </Widget>
            )
        });

        return (
            <div className='layout'
                 ref='layoutRef'>
                <MenuBar config={this.props.config}
                         setConfig={this.props.setConfig}
                         addLayout={this.props.addLayout}
                         setLayout={this.useSavedLayout.bind(this)}/>
                <Grid gridCols={this.state.gridCols}
                      gridRows={this.state.gridRows}
                      screenWidth = {this.state.screenWidth}
                      screenHeight = {this.state.screenHeight}
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
