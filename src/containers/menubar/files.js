/**
 * Created by JohnBae on 1/29/17.
 */

import React, {Component} from "react";
import Button from "../../components/button";
import Scrollable from '../../components/scrollPane'

export default class FilePane extends Component{

    constructor(props) {
        super(props);
        this.state = {value: 'Recently Opened'};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(){
        this.setState({value: event.target.value});
    }


    render(){

        var files = this.props.readWidgetStorage(1, "docs");
        console.log("FILES:", files);
        files = files.map(function(file){
            console.log("FILE:", file);
            return(
                <File name = {file} key ={file}/>
            )
        })

        return(
            <div className = "subMenu">
                <h2>Files</h2>
                <div className="subMenu-files">
                    <div className="subMenu-files-toolbar">
                        <select value={this.state.value}
                                onChange={this.handleChange}>
                            <option value="Name">Name&nbsp;&nbsp;</option>
                            <option value="Recently Opened">Recently Opened&nbsp;&nbsp;</option>
                            <option value="Date Created">Date Created&nbsp;&nbsp;</option>
                            <option value="Date Modified">Date Modified&nbsp;&nbsp;</option>
                        </select>
                    </div>
                    <Scrollable className="subMenu-filesScroll">
                        {files}
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

class File extends Component{

    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className="exampleFile" > {this.props.name} </div>
        )
    }
}
