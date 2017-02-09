/**
 * Created by JohnBae on 1/29/17.
 */

import React from "react";
import Button from "../../components/button";
import Scrollable from '../../components/scrollPane'

export default class FilePane extends React.Component{

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
