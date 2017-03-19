/**
 * Created by JohnBae on 3/14/17.
 */

import React from 'react';
import {connectAdvanced} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../actions/index';
import shallowEqual from 'shallowequal';

class Toolbar extends React.Component {

    constructor(props){
        super(props);
        this.state = {title: ""}
    }

    setTitle(event){
        this.setState({title: event.target.value});
    }

    saveTitle(event){
        this.props.reduxActions.modifyAtSession(this.props.id,{content:{title: event.target.value}});
        event.preventDefault();
    }

    render(){
        return(
            <input className = "sheet-title"
                   type="text"
                   value={this.state.title}
                   placeholder="Untitled"
                   onChange={this.setTitle.bind(this)}
                   onBlur={this.saveTitle.bind(this)}/>
        )
    }

}

function toolbarSelector(dispatch) {
    let state = {};
    let ownProps = {};
    let result = {};
    const actions = bindActionCreators(Actions, dispatch);

    return (nextState, nextOwnProps) => {
        var title = nextState.session.get(nextOwnProps.id).get("content").get("title");
        const nextResult = {
            title: title,
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

export default connectAdvanced(toolbarSelector)(Toolbar);
