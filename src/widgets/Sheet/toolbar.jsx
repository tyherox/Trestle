/**
 * Created by JohnBae on 3/14/17.
 */

import React from 'react';
import {connectAdvanced} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../actions/index';
import shallowEqual from 'shallowequal';
import idGen from '../../helpers/idGenerator';
import {storage} from "./main";

class Toolbar extends React.Component {

    componentWillMount(){

        var title = this.props.reduxTitle;
        if(!title) {
            var list = this.props.reduxLayout.map(function(elem){
                return elem.get("content").get("title");
            }).toArray();
            list = list.concat(storage.list());
            title = idGen("Untitled", list);
            this.props.reduxActions.modifyAtLayout(this.props.id,{content:{title: title}});
        }
        this.setState({title: title, prevTitle: title, edited: false});
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.reduxTitle != this.state.title){
            console.log("UNEQUAL:", nextProps.reduxTitle, this.state.title);
            this.setState({title: nextProps.reduxTitle});
        }
    }

    saveTitle(event){
        if(this.state.title!=this.state.prevTitle) {
            console.log("DIFFERENCE IN TITLES");
            if(storage.exists(this.state.prevTitle)) {
                console.log("RENAMING TITLE");
                storage.rename(this.state.prevTitle, event.target.value);
            }
            this.props.reduxActions.modifyAtLayout(this.props.id,{content:{title: event.target.value}});
            this.setState({title: event.target.value, edited: false});
        }
    }

    setTitle(event){
        if(!this.state.edited){
            console.log("SAVING PREV:", this.state.title);
            this.setState({prevTitle: this.state.title, edited: true});
        }
        this.setState({title: event.target.value});
        event.preventDefault();
    }

    render(){
        return(
            <input className = "sheet-title"
                   type="text"
                   value={this.state.title}
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
        if(!nextState.layout.get(nextOwnProps.id)) return result;
        var title = nextState.layout.get(nextOwnProps.id).get("content");
        if(title) title = title.get("title");
        const nextResult = {
            reduxLayout: nextState.layout,
            reduxTitle: title,
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
