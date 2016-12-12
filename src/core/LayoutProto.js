/**
 * Created by JohnBae on 11/22/16.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Widget from './widgetProto';

var mother = document.getElementById('parent'),
    screenWidth = mother.getBoundingClientRect().width,
    screenHeight = mother.getBoundingClientRect().height,
    key = 1;

//React component in charge of managing graphical layout
class Layout extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            screenWidth: document.getElementById('parent').getBoundingClientRect().width,
            screenHeight: document.getElementById('parent').getBoundingClientRect().height,
            gridCols: 8,
            gridRows: 5,
            cellOffset: 5,
            widgets: this.props.widgets || [],
            gridToggled: false
        };
    }

    addWidget(widget){
        console.log("adding widget");
        var widgets = this.state.widgets;
        var newWidget = {id: key, key: key};
        widgets = widgets.concat([newWidget]);
        this.setState({widgets: widgets});
        key++;
    }

    removeWidget(element) {

    }

    toggleGrid(visibility){
        this.setState({gridToggled: visibility});
    }

    render(){

        var self = this;
        var widgets = this.state.widgets.map(function(widget, i){
            console.log(widget.id);
            return(
                <Widget id = {widget.id}
                        key = {widget.key}
                        width = {(screenWidth - 40)/8 - 4}
                        height = {screenHeight/5 - 4}
                        xCord = {0}
                        yCord = {0}
                        toggleGrid = {self.toggleGrid.bind(self)}>
                </Widget>
            )
        });

        return (
            <div className='layout'
                 ref='layoutRef'>
                <div id = 'navBar' className = 'themeSecondaryColor'></div>
                <Grid gridCols={this.state.gridCols}
                      gridRows={this.state.gridRows}
                      onClick={this.addWidget.bind(this)}
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
        var w = screenWidth, h = screenHeight,
            wOffs = w/this.props.gridCols,
            hOffs = h/this.props.gridRows,
            canvas = this.refs.gridRef,
            ctx = canvas.getContext('2d');

        ctx.canvas.width  = w;
        ctx.canvas.height = h;
        console.log("COLOR: " + getComputedStyle(canvas).getPropertyValue('border-color'));
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
                        onClick = {this.props.onClick}>
                </canvas>
                {this.props.widgets}
            </div>
        );
    }
}

export default function(widgets){
    return <Layout widgets = {widgets}/>
};
