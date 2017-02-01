/**
 * Created by JohnBae on 1/29/17.
 */

import React from "react";
import Button from "../ui/button";
import Buffer from "../ui/buffer";
import Input from "../ui/input"
import Collapsible from '../ui/collapsiblePane'
import Scrollable from '../ui/scrollPane'

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

        if(openedMenu!=null){
            switch(openedMenu){
                case "setting" : subMenuContent = <SettingPane config = {this.props.config}
                                                               setConfig = {this.props.setConfig}/>
                    break;
                case "display" : subMenuContent = <DisplayPane />
                    break;
                case "file" : subMenuContent = <FilePane />
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
                    <Button onClick={self.exit.bind(self)}>E</Button>
                    <Button onClick={self.openSetting.bind(self)}>S</Button>
                    <Button onClick={self.openDisplay.bind(self)}>D</Button>
                    <Button onClick={self.openFiles.bind(self)}>F</Button>
                </div>
                <div id ="menuBar-botButtonGroup">
                    <Button>F</Button>
                    <Button>+</Button>
                </div>
                {subMenu}
            </div>
        )
    }
}

class SettingPane extends React.Component{

    toggleToolbar(state){
        console.log("check:",state);
        this.props.setConfig({toolbar: !state});
    }

    toggleFindButton(state){
        this.props.setConfig({findButton: !state});
    }

    toggleFocusButton(state){
        this.props.setConfig({sentenceFocusButton: !state});
    }

    setWidgetOpacity(state){
        console.log(state);
        this.props.setConfig({widgetOpacity: state});
    }

    reset(){
        this.props.setConfig({toolbar: true, findButton: true, sentenceFocusButton: true, widgetOpacity: 100});
    }

    render(){
        return(
            <div className = "subMenu">
                <h1>Settings</h1>
                <div className="subMenu-settings-attrGroup">
                    <Input text="Show toolbar"
                           type="checkbox"
                           checked={this.props.config.toolbar}
                           changeValue={this.toggleToolbar.bind(this)} />
                    <Input text="Show find button"
                           type="checkbox"
                           checked={this.props.config.findButton}
                           changeValue={this.toggleFindButton.bind(this)}/>
                    <Input text="Show sentence focus button"
                           type="checkbox"
                           checked={this.props.config.sentenceFocusButton}
                           changeValue={this.toggleFocusButton.bind(this)}/>
                </div>
                <div className="subMenu-settings-attrGroup">
                    <Input text="Widget opacity"
                           type="number"
                           max="100"
                           min="0"
                           value={this.props.config.widgetOpacity}
                           changeValue={this.setWidgetOpacity.bind(this)}/>
                    <Input type="range"
                           max="100"
                           min="0"
                           value={this.props.config.widgetOpacity}
                           changeValue={this.setWidgetOpacity.bind(this)}/>
                </div>
                <div className = 'subMenu-botToolGroup'>
                    <Button height="50"
                            width="150"
                            onClick={this.reset.bind(this)}> Default </Button>
                </div>
            </div>
        )
    }
}

class DisplayPane extends React.Component{

    constructor(props){
        super(props);
    }

    collapsePane(elem){

    }

    render(){
        return(
            <div className="subMenu">
                <h1>Display</h1>
                <Scrollable className="subMenu-displayScroll">
                    <Collapsible title = "Layouts">
                        <button className="subMenu-collapsiblePane-item">TEST 1</button>
                        <button className="subMenu-collapsiblePane-item">TEST 2</button>
                        <button className="subMenu-collapsiblePane-item">TEST 3</button>
                        <button className="subMenu-collapsiblePane-item">TEST 4</button>
                        <button className="subMenu-collapsiblePane-item">TEST 5</button>
                    </Collapsible>
                    <Collapsible title = "Widgets">
                        <button className="subMenu-collapsiblePane-item">TEST 1</button>
                        <button className="subMenu-collapsiblePane-item">TEST 2</button>
                        <button className="subMenu-collapsiblePane-item">TEST 3</button>
                        <button className="subMenu-collapsiblePane-item">TEST 4</button>
                        <button className="subMenu-collapsiblePane-item">TEST 5</button>
                    </Collapsible>
                </Scrollable>
            </div>
        )
    }
}

class FilePane extends React.Component{

    constructor(props) {
        super(props);
        this.state = {value: 'Recently Opened'};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(){
        this.setState({value: event.target.value});
    }

    render(){
        return(
            <div className = "subMenu">
                <h1>Files</h1>
                <div className="subMenu-files">
                    <div className="subMenu-files-toolbar">
                        <select value={this.state.value}
                                onChange={this.handleChange}>
                            <option value="Recently Opened">Recently Opened&nbsp;&nbsp;</option>
                            <option value="Date">Date</option>
                            <option value="Date Created">Date Created&nbsp;&nbsp;</option>
                            <option value="Date Modified">Date Modified&nbsp;&nbsp;</option>
                        </select>
                    </div>
                    <Scrollable className="subMenu-filesScroll">
                        <div className="exampleFile" > TEST 1 </div>
                        <div className="exampleFile" > TEST 2 </div>
                        <div className="exampleFile" > TEST 3 </div>
                        <div className="exampleFile" > TEST 4 </div>
                        <div className="exampleFile" > TEST 5 </div>
                        <div className="exampleFile" > TEST 6 </div>
                        <div className="exampleFile" > TEST 7 </div>
                        <div className="exampleFile" > TEST 8 </div>
                        <div className="exampleFile" > TEST 9 </div>
                        <div className="exampleFile" > TEST 10 </div>
                        <div className="exampleFile" > TEST 11 </div>
                        <div className="exampleFile" > TEST 12 </div>
                        <div className="exampleFile" > TEST 13 </div>
                        <div className="exampleFile" > TEST 14 </div>
                        <div className="exampleFile" > TEST 15 </div>
                        <div className="exampleFile" > TEST 16 </div>
                        <div className="exampleFile" > TEST 1 </div>
                        <div className="exampleFile" > TEST 2 </div>
                        <div className="exampleFile" > TEST 3 </div>
                        <div className="exampleFile" > TEST 4 </div>
                        <div className="exampleFile" > TEST 5 </div>
                        <div className="exampleFile" > TEST 6 </div>
                        <div className="exampleFile" > TEST 7 </div>
                        <div className="exampleFile" > TEST 8 </div>
                        <div className="exampleFile" > TEST 9 </div>
                        <div className="exampleFile" > TEST 10 </div>
                        <div className="exampleFile" > TEST 11 </div>
                        <div className="exampleFile" > TEST 12 </div>
                        <div className="exampleFile" > TEST 13 </div>
                        <div className="exampleFile" > TEST 14 </div>
                        <div className="exampleFile" > TEST 15 </div>
                        <div className="exampleFile" > TEST 16 </div>
                    </Scrollable>
                </div>
                <div className="subMenu-botToolGroup">
                    <Button className="subMenu-botToolGroup-item">1</Button>
                    <Button className="subMenu-botToolGroup-item">2</Button>
                </div>
            </div>
        )
    }
}
