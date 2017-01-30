/**
 * Created by JohnBae on 1/30/17.
 */

import React from "react";

export default class Collapsible extends React.Component{

    constructor(props){
        super(props);
        this.state = {collapse: false};
    }

    componentDidMount(){
        //this.refs.cPane.style.height = parseInt(this.refs.cPane.getBoundingClientRect().height) + 'px';
    }

    componentDidUpdate(){
        //this.refs.cPane.style.height = parseInt(this.refs.cPane.getBoundingClientRect().height) + 'px';
    }

    setCollapse(){
        var pane = this.refs.cPane;
        if(this.state.collapse){
            pane.style.height = 'auto';
            this.setState({collapse: false});
        }
        else{
            pane.style.height = this.props.height || '25px';
            this.setState({collapse: true});
        }
    }

    render(){
        return(
            <div className="rye-collapsiblePane" ref="cPane">
                <div className="rye-collapsiblePane-topBar">
                    <div className="rye-collapsiblePane-topBarTitle" onClick={()=>this.setCollapse()}>{this.props.title}</div>
                    <button className="rye-collapsiblePane-topBarIcon" onClick={()=>this.setCollapse()}>*</button>
                </div>
                {this.props.children}
            </div>
        )
    }
}
