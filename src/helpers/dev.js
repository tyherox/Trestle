/**
 * Tyherox
 *
 * dev
 *
 * Development Test Framework for test case setup.
 *
 */

import React, {Component} from 'react';
import Layout from '../containers/layout/layout.js';
import MenuBar from '../containers/menubar/menuBar.js'
import ReactDOM from 'react-dom';
import Sheet from '../widgets/Sheet/main.js';
import {createStore} from 'redux';
import reducer from '../reducers/index';
import * as Actions from '../actions/index';
import {Provider} from 'react-redux';
import fs from './fileSystem'
import jetpack from 'fs-jetpack';

export default function(){
    let widgets = [Sheet],
        userData = "dev",
        store = createStore(reducer),
        screenWidth = screen.width,
        screenHeight = screen.height;

    class App extends Component{

        constructor(props){
            super(props);

            if(jetpack.exists(userData+'/state.json')){
                this.state = jetpack.read(userData+'/state.json','json');
            }
            else{
                this.state = {
                    settings: {
                        toolbar: true,
                        findButton: true,
                        sentenceFocusButton: true,
                        widgetOpacity: 100
                    },
                    savedThemes: [
                    ],
                    savedWidgets: [
                        Sheet
                    ],
                    savedLayouts: [
                    ]
                }
            }

            this.addWidget = this.addWidget.bind(this);
        }

        componentWillMount(){
            this.scanUserData();
        }

        scanUserData(){
           if(jetpack.exists(userData+'/layouts')){
                   console.log("SCANNING LAYOUTS");
               var layouts = jetpack.list(userData+'/layouts');
               layouts = layouts.map(function(layout){
                   return({
                       name: layout,
                       data: jetpack.read(userData+'/layouts/'+layout, "json")
                   })
               });
               this.setState({savedLayouts: layouts});
           }

            this.setState({savedWidgets: [Sheet]});
        }

        assignHome(widget){
            var currentLayout = store.getState().layout,
                widgets = this.state.savedWidgets,
                row = store.getState().settings.get("gridRows"),
                col = store.getState().settings.get("gridCols"),
                range = [];

            currentLayout.forEach(function(entry){
                var top = entry.get("refTop"),
                    left = entry.get("refLeft");
                for(var h = top; h< top + entry.get("refHeight"); h++){
                    for(var w = left; w< left + entry.get("refWidth"); w++){
                       var num = col * h + w;
                        range.push(num);
                    }
                }
            });

            var id = widget.id.toString();
            if(id.includes(".")) id = id.substring(0,id.indexOf("."));

            var template = widgets.find(function(entry){
                if(entry.id == id) return entry;
            });

            var width = template.minWidth,
                height = template.minHeight,
                top,
                left,
                grid = row * col;

            for(var i = 0; i<grid; i++){
                if(range.indexOf(i)==-1){
                    var coordinates = [];
                    for(var r = 0; r < height; r++){
                        var tempRow = null;
                        for(var c = 0; c < width; c++){
                            var num = i + c + r * col;
                            if(tempRow==null) tempRow = Math.floor(num/col);
                            if(range.indexOf(num)==-1 && num<=grid && tempRow == Math.floor(num/col)){
                                coordinates.push(num);
                            }
                        }
                    }
                    if(coordinates.length==width * height) {
                        var origin = coordinates[0];
                        top = Math.floor(origin/col);
                        left = origin - top * col;
                        break;
                    }
                }
            }
            console.groupEnd();
            if(top==undefined && left==undefined) return null;
            return {id: parseFloat(widget.id), refWidth: width, refHeight: height, refTop: top, refLeft: left};
        }

        generateMultiId(id){
            id = id.replace(/"/g,"");
            var offset = 1,
                generated = id + "." + offset.toString();

            while(store.getState().layout.find(function(widget){
                return widget.get("id")==generated;
            })){
                generated = id + "." + (offset++).toString();
            }

            return generated;
        }

        addWidget(widget){
            var layout = store.getState().layout;

            var id = JSON.stringify(widget.id);
            if(id.includes("*")) {
                id = this.generateMultiId(id.replace("*", ""));
                widget = {id: parseFloat(id)};
            }

            widget = this.assignHome(widget);

            if(widget!=null){
                store.dispatch(Actions.modifyAtSession(id.toString(), {
                    id: widget.id,
                    content: {}
                }));

                store.dispatch(Actions.modifyAtLayout(id.toString(), widget));
            }
            else console.log("No Place Available");
        }

        render(){

            return(
                <Provider store={store}>
                    <div>
                        <MenuBar addWidget = {this.addWidget}
                                 widgets = {this.state.savedWidgets}/>

                        <Layout setLayout = {this.setLayout}
                                widgets = {this.state.savedWidgets}
                        />
                    </div>
                </Provider>
            )
        }
    }


    ReactDOM.render(<App/>, document.getElementById('parent'));
};

