/**
 * Created by JohnBae on 1/29/17.
 */

import React from "react";
import Button from "../../components/button";
import Settings from './settings/settings'
import Display from './display/display'
import Files from './library/library'
import * as Actions from '../../actions/index';
import {connectAdvanced} from "react-redux";
import {bindActionCreators} from 'redux';
import shallowEqual from 'shallowequal';

class MenuBar extends React.Component{

    constructor(props){
        super(props);
        this.state = {subMenu: null}
    }

    componentDidMount(){
        this.refs.menu.style.transform = "translate( -40px, 0px)";
        this.refs.hideButton.style.opacity = ".3";
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
        this.props.addSheet({
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
            this.refs.menu.style.width = "40px";
            this.setState({subMenu:null})
        }
        else if(this.state.subMenu==null || this.state.subMenu!=pane){
            this.refs.menu.style.width = "280px";
            this.setState({subMenu:pane})
        }

    }

    setPinnedMode(){
        this.props.reduxActions.modifyAtSession({pinMode: !this.props.reduxSession.get('pinMode')});
        if(this.props.reduxSession.get("pinMode")){
            this.refs.hideButton.style.opacity = ".3"
        }
        else this.refs.hideButton.style.opacity = "1"
    }

    componentDidUpdate(){
        if(this.props.visible){
            this.refs.menu.style.transform = "translate( 0px, 0px)";
            console.log("SHOWING");
        }
        else{
            this.refs.menu.style.transform = "translate( -40px, 0px)";
        }
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
                case "display" : subMenuContent = <Display addWidget = {this.props.addWidget} />
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

        console.log("openedMenu:", openedMenu == "setting");

        return(
            <div id = "menuBar" ref="menu">
                {overlay}
                <div id ="menuBar-topButtonGroup">
                    <Button onClick={self.exit.bind(self)}
                            type="square"
                            icon = "window.png"/>
                    <Button onClick={self.openFiles.bind(self)}
                            type="square"
                            icon = {openedMenu == "file" ? "fileBrowserInverse.png" : "fileBrowser.png"}
                            inverse = {openedMenu == "file"}/>
                    <Button onClick={self.openDisplay.bind(self)}
                            type="square"
                            icon = {openedMenu == "display" ? "displayInverse.png" : "display.png"}
                            inverse = {openedMenu == "display"}/>
                    <Button onClick={self.openSetting.bind(self)}
                            type="square"
                            icon = {openedMenu == "setting" ? "settingsInverse.png" : "settings.png"}
                            inverse = {openedMenu == "setting"}/>
                </div>
                <div id ="menuBar-botButtonGroup">
                    <span ref="hideButton">
                        <Button type="square"
                                onClick = {this.setPinnedMode.bind(this)}
                                icon="hideToggle.png"/>
                    </span>
                    <Button type="square"
                            onClick = {this.addSheet.bind(this)}
                            icon="newSheet.png"/>
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
