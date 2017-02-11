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
import jetpack from 'fs-jetpack';

class Hub extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}

    }

    componentWillMount(){
        var title = this.props.getWidgetState(this.props.id,"title"),
            files =  this.props.readStorage(1, "docs");

        var file = files.find(function(file){
            return file = title;
        })
        var content = this.props.readStorage(1, "docs/" + title);

        if(content) this.setState({content: content})
        else if(content!="Untitled" && content!=null) {
            this.props.deleteWidgetStorage(this.props.id, "doc/" + title);
            this.props.updateWidgetState(this.props.id, {title: "Untitled"}, true);
        }
    }

    save(data){
        //this.props.updateWidgetState(this.props.id, {text: data}, true);
        //this.setState({text: data});
        this.props.saveStorage(1, data, "docs/" + this.props.getWidgetState(this.props.id,"title"));
    }

    render() {
        return(
            <RichEditorExample save={this.save.bind(this)} editorState={this.state.content}/>
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
        this.props.renameWidgetStorage(1, "docs/" + this.props.getWidgetState(this.props.id,"title"), this.refs.input.value);
        this.props.updateWidgetState(this.props.id, {title: this.refs.input.value}, true);
    }

    componentWillMount(){
        var title = this.props.getWidgetState(this.props.id, "title") || "Untitled";
        this.props.updateWidgetState(this.props.id, {title: title}, true);
    }

    render(){
        return(
            <input className = "sheet-title"
                   defaultValue = {this.props.getWidgetState(this.props.id, "title")}
                   ref = "input"
                   onClick={this.selectAll.bind(this)}
                   onBlur={this.setTitle.bind(this)}/>
        )
    }
}

 export default {
     id:1,
     multi: true,
     minWidth: 2,
     minHeight: 2,
     maxWidth: 10,
     maxHeight: 10,
     storage: "1-sheets",
     toolbar: Toolbar,
     content: Hub
 };
