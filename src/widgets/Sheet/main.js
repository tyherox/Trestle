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

        console.log("title of sheet:", title);

        if(!title || title==="") {
            this.props.updateWidgetState(this.props.id, {title: "Untitled"}, true);
            title = "Untitled";
            console.log("new title of sheet:", title);
        }

        if(files){
            var file = files.find(function(file){
                return file = title;
            })
            var content = this.props.readStorage(1, "docs/" + title);

            if(content) this.setState({content: content})
            else if(content!="Untitled" && content!=null) {
                this.props.deleteWidgetStorage(1, "doc/" + title);
                this.props.updateWidgetState(this.props.id, {title: "Untitled"}, true);
            }
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

    saveTitle(event){
        var title = this.props.getWidgetState(this.props.id,"title");
        if(this.props.readStorage(1, "docs/" + title)) this.props.renameWidgetStorage(1, "docs/" + title, event.target.value);
        this.props.updateWidgetState(this.props.id, {title: event.target.value}, true);
    }

    render(){
        return(
            <input className = "sheet-title"
                   type="text"
                   value = {this.props.getWidgetState(this.props.id, "title") || ""}
                   onChange={this.saveTitle.bind(this)}/>
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
