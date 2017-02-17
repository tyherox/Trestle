/**
 * Created by JohnBae on 1/29/17.
 */

import React, {Component} from "react";
import Collapsible from '../../components/collapsiblePane'
import Scrollable from '../../components/scrollPane'
import Button from '../../components/button'
import * as Actions from '../../actions/index';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';

var id = 0;

class DisplayPane extends Component{

    constructor(props){
        super(props);
        this.state = {newLayout: false}
        this.addLayout = this.addLayout.bind(this);
    }

    setLayout(data){
        //this.props.setLayout(data);
    }

    addLayout(name){
        var k = {};
        k["Testing:"+id] = {1:"NOW",2:"HERE"}
        this.props.reduxActions.addStoredLayout(k);
        //this.props.addLayout(name);
    }

    deleteLayout(name){
        this.props.reduxActions.deleteStoredLayout("TESTING");
        //this.props.deleteLayout(name);
    }

    renameLayout(prevName, name){
        this.props.reduxActions.renameStoredLayout("Testing:"+3,"OMGOMG");
        //this.props.renameLayout(prevName, name);
    }

    render(){

        console.log("Display Test:", this.props.reduxProps);

        var layouts = this.props.layouts,
            self = this;

        if(layouts.length > 0) layouts = layouts.map(function(layout){

            return(
                <Layout key = {id++}
                        layout = {layout.data}
                        name = {layout.name.replace(".json","")}
                        renameLayout = {self.renameLayout.bind(self)}
                        deleteLayout = {self.deleteLayout.bind(self)}
                        setLayout = {self.setLayout.bind(self)}/>
            )
        });

        return(
            <div className="subMenu">
                <h2>Display</h2>
                <Scrollable className="subMenu-displayScroll">
                    <Collapsible title = "Layouts">
                        {layouts}
                        <Button className="subMenu-display-layoutItem"
                                onClick={this.addLayout.bind(this)}><h1>+</h1><br/> Save Current Layout</Button>
                    </Collapsible>
                    <Collapsible title = "Widgets">
                        <Button className="subMenu-display-widgetItem">TEST 1</Button>
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

const mapStateToProps = (state) => ({
    reduxProps: state.storedLayouts,
});

const mapDispatchToProps = (dispatch) => ({
    reduxActions: bindActionCreators(Actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(DisplayPane);
