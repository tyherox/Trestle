/**
 * Created by JohnBae on 1/29/17.
 */

import React from "react";
import Button from "../../components/button";
import Settings from './settings/settings'
import Display from './display/display'
import Files from './files/files'
import * as Actions from '../../actions/index';
import {connectAdvanced} from "react-redux";
import {bindActionCreators} from 'redux';
import shallowEqual from 'shallowequal';

class MenuBar extends React.Component{

    constructor(props){
        super(props);
        this.state = {subMenu: null}
    }

    exit(){
        window.close();
    }

    openSetting(){
        this.toggleSub("setting");
    }

    openDisplay(){
        this.toggleSub("display");
    }

    openFiles(){
        this.toggleSub("file");
    }

    addSheet(){
        this.props.addWidget({
                id: '1*',
                pinned: true,
                content: {}
        });
    }

    closeSubMenu(){
        this.toggleSub();
    }

    toggleSub(pane){
        var overlay = this.refs.overlay;

        if(pane==null || this.state.subMenu==pane){
            this.setState({subMenu:null})
        }
        else if(this.state.subMenu==null || this.state.subMenu!=pane){
            this.setState({subMenu:pane})
        }

    }

    setPinnedMode(){
        this.props.reduxActions.modifyAtSession("pinMode", !this.props.reduxSession.get('pinMode'));
    }

    render(){

        var subMenuContent = null,
            subMenu = null,
            openedMenu = this.state.subMenu,
            self = this,
            overlay = null;

        if(openedMenu!=null){
            switch(openedMenu){
                case "setting" : subMenuContent = <Settings />
                    break;
                case "display" : subMenuContent = <Display />
                    break;
                case "file" : subMenuContent = <Files addWidget = {this.props.addWidget}/>
                    break;
                default : console.log("Unregistered Pane!");
                    break;
            }
            subMenu =
                <div id ="menuBar-subMenu" ref="subMenu">
                    {subMenuContent}
                </div>

            overlay =
                <div id = "menuBar-overlay"
                           onClick = {self.closeSubMenu.bind(self)}
                           ref="overlay">
                </div>
        }

        return(

            <div id = "menuBar" ref="menu">
                {overlay}
                <div id ="menuBar-topButtonGroup">
                    <Button onClick={self.exit.bind(self)} type="square">E</Button>
                    <Button onClick={self.openSetting.bind(self)} type="square">S</Button>
                    <Button onClick={self.openDisplay.bind(self)} type="square">D</Button>
                    <Button onClick={self.openFiles.bind(self)} type="square">F</Button>
                </div>
                <div id ="menuBar-botButtonGroup">
                    <Button type="square" onClick = {this.setPinnedMode.bind(this)}>H</Button>
                    <Button type="square" onClick = {this.addSheet.bind(this)}>+</Button>
                </div>
                {subMenu}
            </div>
        )
    }
}

function selectorFactory(dispatch) {
    let result = {};
    const actions = bindActionCreators(Actions, dispatch);
    return (nextState, nextOwnProps) => {
        const nextResult = {
            reduxSession: nextState.session,
            reduxActions: actions,
            ...nextOwnProps
        };
        if (!shallowEqual(result,nextResult)){
            result = nextResult;
        }
        return result
    }
}

export default connectAdvanced(selectorFactory)(MenuBar);
