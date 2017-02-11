/**
 * Created by JohnBae on 1/29/17.
 */

import React, {Component} from "react";
import Collapsible from '../../components/collapsiblePane'
import Scrollable from '../../components/scrollPane'
import Button from '../../components/button'
import jetpack from 'fs-jetpack';

var id = 0;

export default class DisplayPane extends Component{

    constructor(props){
        super(props);
        this.state={newLayout: false}
        this.addLayout = this.addLayout.bind(this);
    }

    setLayout(data){
        console.log("SETTING:", data);
        this.props.setLayout(data);
    }

    addLayout(name){
        this.props.addLayout(name);
        this.setState({newLayout: false})
    }

    deleteLayout(name){
        this.props.deleteLayout(name);
    }

    renameLayout(prevName, name){
        this.props.renameLayout(prevName, name);
    }

    initializeLayout(){
        this.setState({newLayout: true})
    }

    cancelLayout(){
        this.setState({newLayout: false})
    }

    render(){
        var placeholder = this.state.newLayout,
            layouts = this.props.layouts,
            self = this;
        if(placeholder){
            console.log("PLACE");
            placeholder = <InitializeLayout requestFocus
                                            cancel={this.cancelLayout.bind(this)}
                                            add={this.addLayout.bind(this)}/>;
        }

        if(layouts.length > 0) layouts = layouts.map(function(layout){
            return(
                <Layout key = {id++}
                        layout = {layout.data}
                        name = {layout.name.replace(".json","")}
                        renameLayout = {self.renameLayout.bind(self)}
                        deleteLayout = {self.deleteLayout.bind(self)}
                        setLayout = {self.setLayout.bind(self)}/>
            )
        })

        return(
            <div className="subMenu">
                <h2>Display</h2>
                <Scrollable className="subMenu-displayScroll">
                    <Collapsible title = "Layouts">
                        {layouts}
                        {placeholder}
                        <Button className="subMenu-display-layoutItem"
                                onClick={this.initializeLayout.bind(this)}><h1>+</h1><br/> Save Current Layout</Button>
                    </Collapsible>
                    <Collapsible title = "Widgets">
                        <Button className="subMenu-display-widgetItem">TEST 1</Button>
                    </Collapsible>
                </Scrollable>
            </div>
        )
    }
}

class InitializeLayout extends Component{

    componentDidMount(){
        if(this.props.requestFocus){
            this.refs.input.focus();
        }
    }

    addLayout(){
        this.props.add(this.refs.input.value);
    }

    render(){
        return(
            <div className = "subMenu-display-layoutItem subMenu-display-initializeLayout">
                <input className="subMenu-display-layoutTitle"
                       placeholder="Name me!"
                       ref = "input"/>
                <button className="subMenu-display-confirmLayout"
                        onClick={this.addLayout.bind(this)}>Confirm</button>
                <button className="subMenu-display-confirmLayout"
                        onClick={this.props.cancel}>Cancel</button>
            </div>
        )
    }
}

class Layout extends Component{

    setLayout(){
        this.props.setLayout(this.props.layout);
    }

    renameLayout(){
        this.props.renameLayout(this.props.name, this.refs.input.value);
    }

    deleteLayout(){
        this.props.deleteLayout(this.props.name);
    }

    render(){
        return(
            <div className = "subMenu-display-layout">
                <Button className="subMenu-display-layoutDelete"
                        onClick={this.deleteLayout.bind(this)}/>
                <Button className="subMenu-display-layoutItem"
                        onClick={this.setLayout.bind(this)}/>
                <input className="subMenu-display-layoutTitle"
                       placeholder="Name me!"
                       onChange={null}
                       onBlur={this.renameLayout.bind(this)}
                       defaultValue={this.props.name}
                       ref = "input"/>
            </div>
        )
    }
}
