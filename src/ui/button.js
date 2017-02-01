/**
 * Created by JohnBae on 1/30/17.
 *
 * React "Button" component to handle theme dependent styles.
 */

import React, {Component} from "react";

export default class Button extends Component{

    componentDidMount(){
        this.decorateButton()
    }

    componentDidUpdate(){
        this.decorateButton()
    }

    //Styling Button with theme dependent icons / parameters.
    decorateButton(){
        var button = this.refs.button;
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
            <button className = {"rye-button " + this.props.className}
                    ref = "button"
                    onClick={this.props.onClick}>
                {this.props.children}
            </button>
        )
    }
}
