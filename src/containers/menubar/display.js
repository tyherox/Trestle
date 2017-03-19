/**
 * Created by JohnBae on 1/29/17.
 */

import React, {Component} from "react";
import Collapsible from '../../components/collapsiblePane'
import Scrollable from '../../components/scrollPane'
import Button from '../../components/button'
import * as Actions from '../../actions/index';
import {connectAdvanced} from "react-redux";
import {bindActionCreators} from 'redux';
import shallowEqual from 'shallowequal';
import fs from '../../helpers/fileSystem.js'

var id = 0;

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

    addLayout(name){
        name = "TEST";
        var layout = {};
        layout[name] = name;
        this.props.reduxActions.addStoredLayout({
            "Untitled": this.props.currentLayout
        });

        var add = function(a, b){
            return a + b;
        }
        console.lg(add(1,2));
    }

    deleteLayout(name){
        this.props.reduxActions.deleteStoredLayout(name);
    }

    renameLayout(prevName, name){
        this.props.reduxActions.renameStoredLayout(prevName, name);
    }

    render(){
        var layouts = this.props.currentLayout, self = this;

        if(layouts.length > 0) {
            layouts = layouts.map(function(layout){
                return(
                    <Layout key = {id++}
                            layout = {layout.data || {}}
                            name = {layout.name ? layout.name.replace(".json","") : "Untitled"}
                            renameLayout = {self.renameLayout}
                            deleteLayout = {self.deleteLayout}
                            setLayout = {self.setLayout}/>
                )
            });
        }
        else layouts = null;

        return(
            <div className="subMenu">
                <h2>Display</h2>
                <Scrollable className="subMenu-displayScroll">
                    <Collapsible title = "Layouts">
                        {layouts}
                        <Button className="subMenu-display-layoutItem"
                                onClick={this.addLayout}><h1>+</h1><br/> Save Current Layout</Button>
                    </Collapsible>
                    <Collapsible title = "Widgets">
                        <Button className="subMenu-display-widgetItem">TEST WIDGET LOCATION</Button>
                    </Collapsible>
                </Scrollable>
            </div>
        )
    }
}

class Layout extends Component{

    componentDidMount(){
        this.refs.input.focus();
    }

    setLayout(){
        this.props.setLayout(this.props.layout);
    }

    renameLayout(){
        if(event.target.value==""){
            this.deleteLayout();
        }
        else this.props.renameLayout(this.props.name, this.refs.input.value);
    }

    deleteLayout(){
        this.props.deleteLayout(this.props.name);
    }

    render(){
        return(
            <div className = "subMenu-display-layout">
                <Button className="subMenu-display-layoutDelete"
                        onClick={this.deleteLayout.bind(this)}/>
                <Button className="subMenu-display-layoutItem"
                        onClick={this.setLayout.bind(this)}/>
                <input className="subMenu-display-layoutTitle"
                       placeholder="Name me!"
                       onChange={null}
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
            layouts: nextState.session.get("availLayouts"),
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

export default connectAdvanced(selectorFactory)(DisplayPane);
