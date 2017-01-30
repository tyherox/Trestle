/**
 * Created by JohnBae on 1/30/17.
 */

import React from "react";

export default class Button extends React.Component{

    componentDidMount(){
        this.decorateButton()
    }

    componentDidUpdate(){
        this.decorateButton()
    }

    decorateButton(){
        var button = this.refs.button;
        console.log("Decorating");
        if(this.props.width!=null && this.props.height!=null){
            button.style.width = this.props.width + "px";
            button.style.height = this.props.height + "px";
        }
        else{
            button.style.width = "36px";
            button.style.height = "36px";
        }
    }

    render(){
        return(
            <button className = "rye-button"
                    ref = "button"
                    onClick={this.props.onClick}>{this.props.children}</button>
        )
    }
}
