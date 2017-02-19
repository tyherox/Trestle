/**
 * Created by JohnBae on 1/29/17.
 */

import React from "react";
import Button from "../../components/button";
import Input from "../../components/input"
import Collapsible from '../../components/collapsiblePane'
import Scrollable from '../../components/scrollPane'
import Settings from './settings'
import Display from './display'
import Files from './files'

export default class MenuBar extends React.Component{

    constructor(props){
        super(props);
        this.state = {subMenu: null}
    }

    componentDidMount(){

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

    hide(){

    }

    addSheet(){
        this.props.addWidget(
            {
                id: '1*',
                refWidth: 2,
                refHeight: 2,
                refLeft: 0,
                refTop: 0,
                state: []
            }
        );
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

    render(){


        var subMenuContent = null,
            subMenu = null,
            openedMenu = this.state.subMenu,
            self = this,
            overlay = null;

        console.log("RENDERING: Menubar");

        if(openedMenu!=null){
            switch(openedMenu){
                case "setting" : subMenuContent = <Settings />
                    break;
                case "display" : subMenuContent = <Display />
                    break;
                case "file" : subMenuContent = <Files readWidgetStorage = {this.props.readWidgetStorage}
                                                      saveWidgetStorage = {this.props.saveWidgetStorage}/>
                    break;
                default : console.log("Unregistered Pane!");
                    break;
            }
            subMenu = <div id ="menuBar-subMenu" ref="subMenu">
                {subMenuContent}
            </div>

            overlay = <div id = "menuBar-overlay"
                           onClick = {self.closeSubMenu.bind(self)}
                           ref="overlay">
            </div>
        }

        return(

            <div id = "menuBar" className = "themeSecondaryColor" ref="menu">
                {overlay}
                <div id ="menuBar-topButtonGroup">
                    <Button onClick={self.exit.bind(self)} type="square">E</Button>
                    <Button onClick={self.openSetting.bind(self)} type="square">S</Button>
                    <Button onClick={self.openDisplay.bind(self)} type="square">D</Button>
                    <Button onClick={self.openFiles.bind(self)} type="square">F</Button>
                </div>
                <div id ="menuBar-botButtonGroup">
                    <Button type="square">F</Button>
                    <Button type="square" onClick = {this.addSheet.bind(this)}>+</Button>
                </div>
                {subMenu}
            </div>
        )
    }
}
