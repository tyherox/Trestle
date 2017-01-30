/**
 * Created by JohnBae on 1/30/17.
 */

import React from "react";

export default class Input extends React.Component{

    componentDidMount(){

    }

    componentDidUpdate(){

    }

    handleNewValue(){
        this.props.changeValue(this.props.checked);
    }


    render(){

        var input = null,
            type = this.props.type;

        switch(type){
            case "checkbox" :
                input = <input className = "rye-inputArea"
                               ref="input"
                               type="checkbox"
                               checked={this.props.checked}
                               onChange={this.handleNewValue.bind(this)} />;
                break;

            case "number" :
                input = <input className = "rye-inputArea"
                               ref="input"
                               type="number"
                               checked={this.props.checked}
                               onChange={this.handleNewValue.bind(this)} />;
                break;
        }

        /*
         return(
         <div className = "rye-input">
         <div className = "rye-inputText"
         onClick={this.handleNewValue.bind(this)}>{this.props.text}</div>
         {input}
         </div>
         )
         */

        return(
            <div className = "rye-input">
                <div className = "rye-inputText"
                     onClick={this.handleNewValue.bind(this)}>{this.props.text}</div>
                {input}
            </div>
        )

    }
}
