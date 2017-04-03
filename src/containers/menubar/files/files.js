/**
 * Created by JohnBae on 1/29/17.
 */

import React, {Component} from "react";
import Button from "../../../components/button";
import Scrollable from '../../../components/scrollPane'
import fs from '../../../helpers/fileSystem';
import * as Actions from '../../../actions/index';
import {connectAdvanced} from "react-redux";
import {bindActionCreators} from 'redux';
import shallowEqual from 'shallowequal';

var storage = new fs("widgets/1-sheets");

class FilePane extends Component{

    constructor(props) {
        super(props);
        this.state = {value: 'Recently Opened'};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event){
        this.setState({value: event.target.value});

    }

    deleteFile(name){
        storage.remove(name);
        var file;
        this.props.reduxLayout.forEach(function(elem){
            var id = elem.get("id");
            var content = elem.get("content");
            if(content) {
                var title = content.get("title");
                if(name == title) file = id;
            }
        });
        this.props.reduxActions.deleteAtLayout(file.toString());
        this.forceUpdate();
    }

    render(){

        var files = storage.list(null, this.state.value),
            self = this;
        if(files)
        files = files.map(function(file){
            return(
                <File name = {file}
                      key = {file}
                      deleteFile = {self.deleteFile.bind(self, file)}
                      selected = {self.props.reduxLayout.find((elem) => elem.get("content").get("title") == file) ? true : false}
                      addWidget = {self.props.addWidget}/>
            )
        });
        else files = null;

        console.log(files);

        return(
            <div id = "subMenu">
                <h2>Files</h2>
                <div className="fileList-container">
                    <div className="fileList-toolbar">
                        <select value={this.state.value}
                                onChange={this.handleChange}>
                            <option value="Name">Name&nbsp;&nbsp;</option>
                            <option value="Recently Opened">Recently Opened&nbsp;&nbsp;</option>
                            {<option value="Date Created">Date Created&nbsp;&nbsp;</option>}
                            <option value="Date Modified">Date Modified&nbsp;&nbsp;</option>
                        </select>
                    </div>
                    <Scrollable className="fileList-scroll">
                        {files}
                    </Scrollable>
                </div>
                <div className="botToolGroup">
                    <Button className="botToolGroup-item">1</Button>
                    {/*<Button className="botToolGroup-item">2</Button>*/}
                </div>
            </div>
        )
    }
}

class File extends Component{

    constructor(props){
        super(props);
        this.state = {showOptions: false};

        this.addWidget = this.addWidget.bind(this);
        this.showOptions = this.showOptions.bind(this);
        this.hideOptions = this.hideOptions.bind(this);
    }

    addWidget(){
        if(!this.props.selected)this.props.addWidget({
            id: '1*',
            pinned: true,
            content: {title: this.props.name}
        });
    }

    showOptions(){
        this.setState({showOptions: true});
    }

    hideOptions(){
        this.setState({showOptions: false});
    }

    render(){
        var fileStyle = !this.props.selected ? "fileList-file-default" : "fileList-file-selected";
        var options = this.state.showOptions ? "fileList-file-showOption" : "fileList-file-hideOption";

        return(
            <div className = {fileStyle}
                 onClick = {this.addWidget}
                 onMouseEnter={this.showOptions}
                 onMouseLeave={this.hideOptions}>
                <span>{this.props.name}</span>
                <span><Button className={options} onClick={this.props.deleteFile}>X</Button></span>
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
            reduxLayout: nextState.layout,
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

export default connectAdvanced(selectorFactory)(FilePane);
