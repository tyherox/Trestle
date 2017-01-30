/**
 * Created by JohnBae on 1/29/17.
 */

import React from "react";
import Button from "../ui/button";
import Buffer from "../ui/buffer";
import Input from "../ui/input"
import Collapsible from '../ui/collapsiblePane'

export default class NavBar extends React.Component{

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
        var subMenu = this.refs.subMenu,
            overlay = this.refs.overlay;

        if(subMenu!=null){
            if(pane==null){
                subMenu.style.width = "0";
                overlay.style.width = "0";
                overlay.style.height = "0";
                this.setState({subMenu:null})
            }
            else if(this.state.subMenu==null || this.state.subMenu!=pane){
                console.log("EXPANDING");
                subMenu.style.width = "240px";
                overlay.style.width = "100vw";
                overlay.style.height = "100vh";
                overlay.display = "inline";
                this.setState({subMenu:pane})
            }
            else if(this.state.subMenu || pane==null){
                subMenu.style.width = "0";
                overlay.style.width = "0";
                overlay.style.height = "0";
                this.setState({subMenu:null})
            }
        }

    }

    render(){


        var subMenu = null,
            openedMenu = this.state.subMenu,
            self = this;

        if(openedMenu!=null){
            switch(openedMenu){
                case "setting" : subMenu = <SettingPane />
                    break;
                case "display" : subMenu = <DisplayPane />
                    break;
                case "file" : subMenu = <FilePane />
                    break;
                default : console.log("Unregistered Pane!");
                    break;
            }
        }

        return(
            <div id = "menuBar" className = "themeSecondaryColor" ref="menu">
                <div id = "menuBar-overlay"
                     onClick = {self.closeSubMenu.bind(self)}
                     ref="overlay">
                </div>
                <div id ="menuBar-top">
                    <Button onClick={self.exit.bind(self)}>E</Button>
                    <Button onClick={self.openSetting.bind(self)}>S</Button>
                    <Button onClick={self.openDisplay.bind(self)}>D</Button>
                    <Button onClick={self.openFiles.bind(self)}>F</Button>
                </div>
                <div id ="menuBar-bot">
                    <Button className = "rye-button">F</Button>
                    <Button className = "rye-button">+</Button>
                </div>
                <div id ="menuBar-subMenu" ref="subMenu">
                    {subMenu}
                </div>
            </div>
        )
    }
}

class SettingPane extends React.Component{

    constructor(props){
        super(props);
        this.state = {toolbar: true, find: true, focus: true, opacity: 100}
    }

    toggleToolbar(state){
        this.setState({toolbar: !state});
    }

    toggleFindButton(state){
        this.setState({find: !state});
    }

    toggleFocusButton(state){
        this.setState({focus: !state});
    }

    setWidgetOpacity(state){
        this.setState({opacity: state});
    }

    render(){
        return(
            <div className = "subMenu">
                <h1>Settings</h1>
                <div className = "subMenu-settings">
                    <Input text="Hide toolbar"
                           type="checkbox"
                           checked={this.state.toolbar}
                           changeValue={this.toggleToolbar.bind(this)} />
                    <Input text="Hide find button"
                           type="checkbox"
                           checked={this.state.find}
                           changeValue={this.toggleFindButton.bind(this)}/>
                    <Input text="Hide sentence focus button"
                           type="checkbox"
                           checked={this.state.focus}
                           changeValue={this.toggleFocusButton.bind(this)}/>
                    <Input text="Widget opacity"
                           type="number"
                           checked={this.state.toolbar}
                           changeValue={this.setWidgetOpacity.bind(this)}/>
                </div>
                <button className = 'rye-button subMenu-defaultButton'> Default </button>
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
            <div className = "subMenu">
                <h1>Display</h1>
                <div className="subMenu-display">
                    <div className="subMenu-displayScroll">
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
                    </div>
                </div>
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
                    <div className="subMenu-filesScroll">
                        <div className="subMenu-files-list">
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
                        </div>
                    </div>
                </div>
                <div className="subMenu-files-botTools">
                    <button className="botTool">1</button>
                    <button className="botTool">2</button>
                </div>
            </div>
        )
    }
}
