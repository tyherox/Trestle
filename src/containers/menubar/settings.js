/**
 * Created by JohnBae on 1/29/17.
 */

import React from "react";
import Button from "../../components/button";
import Input from "../../components/input"

export default class SettingPane extends React.Component{

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
                <h2>Settings</h2>
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
