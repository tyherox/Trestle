/**
 * Created by JohnBae on 1/29/17.
 */

import React, {Component} from "react";
import Collapsible from '../../components/collapsiblePane'
import Scrollable from '../../components/scrollPane'
import Button from '../../components/button'
import jetpack from 'fs-jetpack';

export default class DisplayPane extends Component{

    constructor(props){
        super(props);
        this.addLayout = this.addLayout.bind(this);
    }

    collapsePane(elem){

    }

    setLayout(){
        var data = jetpack.read('dev/layouts/TEST.json','json')
        this.props.setLayout(data);
    }

    addLayout(){
        this.props.addLayout("TEST");
    }

    render(){
        return(
            <div className="subMenu">
                <h2>Display</h2>
                <Scrollable className="subMenu-displayScroll">
                    <Collapsible title = "Layouts">
                        <Button className="subMenu-collapsiblePane-item" onClick={this.setLayout.bind(this)}></Button>
                        <Button className="subMenu-collapsiblePane-item" onClick={this.addLayout}><h1>+</h1><br/> Save Current Layout</Button>
                    </Collapsible>
                    <Collapsible title = "Widgets">
                        <Button className="subMenu-collapsiblePane-item">TEST 1</Button>
                        <Button className="subMenu-collapsiblePane-item">TEST 2</Button>
                        <Button className="subMenu-collapsiblePane-item">TEST 3</Button>
                        <Button className="subMenu-collapsiblePane-item">TEST 4</Button>
                        <Button className="subMenu-collapsiblePane-item">TEST 5</Button>
                    </Collapsible>
                </Scrollable>
            </div>
        )
    }
}

class List extends Component{
    render(){
        return(
            <div>{this.props.children}</div>
        )
    }
}

class Layout extends Component{

    render(){
        return(
            <Button className="subMenu-collapsiblePane-item">TEST 1</Button>
        )
    }
}
