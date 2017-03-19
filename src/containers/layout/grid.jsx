/**
 * Created by JohnBae on 3/15/17.
 */

import React from 'react';
import shallowEqual from 'shallowequal';
import {connectAdvanced} from 'react-redux';

//React component that draws the grid
class Grid extends React.PureComponent{

    componentDidMount(){
        var w = this.props.screenWidth - 40,
            h = this.props.screenHeight,
            wOffs = w/this.props.gridCols,
            hOffs = h/this.props.gridRows,
            canvas = this.refs.gridRef;

        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        canvas.backgroundSize = w + "px " + h + "px";
        canvas.style.opacity = '0';
        this.forceUpdate();
    }

    shouldComponentUpdate(props){
        var canvas = this.refs.gridRef,
            visibility = props.visibility;

        if(visibility) {
            canvas.style.opacity = '1';
        }
        else {
            canvas.style.opacity = '0';
        }
        return false;
    }

    render(){
        return (
            <div id = 'gridContainer'>
                <div id = 'grid'
                     ref = 'gridRef'
                     className = 'themeGridColor'
                     onClick = {this.props.exit}>
                </div>
            </div>
        );
    }
}

function gridSelector(dispatch) {
    let state = {};
    let ownProps = {};
    let result = {};
    return (nextState, nextOwnProps) => {
        const nextResult = {
            visibility: nextState.session.get("gridVisible"),
            gridCols: nextState.settings.get("gridCols"),
            gridRows: nextState.settings.get("gridRows"),
            screenWidth: nextState.settings.get("screenWidth"),
            screenHeight: nextState.settings.get("screenHeight")
        };
        state = nextState;
        ownProps = nextOwnProps;
        if (!shallowEqual(result,nextResult)){
            result = nextResult;
        }
        return result
    }
}

export default connectAdvanced(gridSelector)(Grid);
