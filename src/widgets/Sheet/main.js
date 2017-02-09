/**
 * Tyherox
 *
 * TimeWidget
 *
 * The TimeWidget is a simple widget used to tell time. Expanding adds the functionality of showing seconds
 */

import React from 'react';
import ReactDOM from 'react-dom';
import RichEditorExample from './editor.js';

class Hub extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}

    }

    save(data){
        this.props.updateWidgetState(1, {state: {text: data}});
        //this.setState({data: data});
    }

    render() {
        return(
            <RichEditorExample save={this.save.bind(this)}/>
        )
    }
}

class Toolbar extends React.Component {

    constructor(props){
        super(props);
        this.state = {}
    }

    selectAll(){
        this.refs.input.setSelectionRange(0, this.refs.input.value.length)
    }

    setTitle(){
        this.props.updateWidgetState(1, {state: {title: this.refs.input.value}});
    }

    render(){
        return(
            <input className = "sheet-title"
                   defaultValue = "Untitled"
                   ref = "input"
                   onClick={this.selectAll.bind(this)}
                   onChange={this.setTitle.bind(this)}/>
        )
    }
}

 export default {
     id:1,
     minWidth: 2,
     minHeight: 2,
     maxWidth: 10,
     maxHeight: 10,
     state: [],
     toolbar: Toolbar,
     content: Hub
 };
