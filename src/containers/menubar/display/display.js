/**
 * Created by JohnBae on 1/29/17.
 */

import React, {Component} from "react";
import Collapsible from '../../../components/collapsiblePane'
import Scrollable from '../../../components/scrollPane'
import Button from '../../../components/button'
import * as Actions from '../../../actions/index';
import {connectAdvanced} from "react-redux";
import {bindActionCreators} from 'redux';
import shallowEqual from 'shallowequal';
import fs from '../../../helpers/fileSystem.js';

var storage = new fs("layouts");

class DisplayPane extends Component{

    constructor(props){
        super(props);
        this.setLayout = this.setLayout.bind(this);
        this.addLayout = this.addLayout.bind(this);
        this.deleteLayout = this.deleteLayout.bind(this);
        this.renameLayout = this.renameLayout.bind(this);
    }

    setLayout(data){
        this.props.reduxActions.setLayout(data);
    }

    addLayout(){
        var i = 0, self = this;
        var name = "Untitled." + i++;
        while(this.props.layouts.has(name)) {
            name = "Untitled." + i++;
        }

        var layout = this.props.currentLayout.map(function(elem){
            var valid = self.props.session.delete("gridVisible").delete("pinMode").find(function(i){
                return i.get("id") ==elem.get("id");
            });
            if(valid && valid.get('content') && valid.get("content").get("title")) {
                return elem.merge({content: {title: valid.get("content").get("title")}});
            }
            return elem;
        });

        this.props.reduxActions.addStoredLayout(name, layout);
    }

    deleteLayout(name){
        this.props.reduxActions.deleteStoredLayout(name);
    }

    renameLayout(prevName, name){
        this.props.reduxActions.renameStoredLayout(prevName, name);
    }

    render(){
        var id = 0;
        var self = this,
            layouts = this.props.layouts.entrySeq().map(function(data){
                return(<ConnectedLayout key = {id++}
                               path = {data[1]}
                               name = {data[0]}
                               renameLayout = {self.renameLayout}
                               deleteLayout = {self.deleteLayout}
                               setLayout = {self.setLayout}/>
                )
            });

        return(
            <div id="subMenu">
                <h2>Display</h2>
                <Scrollable className="displayScroll">
                    <Collapsible title = "Layouts">
                        {layouts}
                        <Button className="display-addLayoutItem"
                                onClick={this.addLayout}><h1>+</h1><br/>
                            Save Current Layout
                        </Button>
                    </Collapsible>
                    <Collapsible title = "Widgets">
                        <Button className="display-widgetItem">TEST WIDGET LOCATION</Button>
                    </Collapsible>
                </Scrollable>
            </div>
        )
    }
}

class Layout extends Component{

    componentDidMount(){
        var input = this.refs.input;
        input.focus();
        input.setSelectionRange(0, input.value.length);
    }

    setLayout(){
        var layout = JSON.parse(storage.read(this.props.name + ".json"));
        this.props.setLayout(layout);
    }

    renameLayout(event){
        if(event.target.value==""){
            this.deleteLayout();
        }
        else if(event.target.value!=this.props.name) this.props.renameLayout(this.props.name, event.target.value);
    }

    deleteLayout(){
        this.props.deleteLayout(this.props.name);
    }

    keyPress(event){
        if (event.key === 'Enter') {
            event.target.blur();
        }
    }

    render(){
        return(
            <div className = "display-layout">
                <Button className="display-layoutDelete"
                        onClick={this.deleteLayout.bind(this)}/>
                <Button className="display-layoutItem"
                        onClick={this.setLayout.bind(this)}/>
                <input className="display-layoutTitle"
                       placeholder="Name me!"
                       onKeyPress={this.keyPress.bind(this)}
                       onBlur={this.renameLayout.bind(this)}
                       defaultValue={this.props.name}
                       ref = "input"/>
            </div>
        )
    }
}

function selectorFactory(dispatch) {
    let state = {};
    let ownProps = {};
    let result = {};
    const actions = bindActionCreators(Actions, dispatch);
    return (nextState, nextOwnProps) => {
        const nextResult = {
            currentLayout: nextState.layout,
            session: nextState.session,
            layouts: nextState.storedLayouts,
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

var ConnectedLayout = connectAdvanced(selectorFactory)(Layout);
export default connectAdvanced(selectorFactory)(DisplayPane);
