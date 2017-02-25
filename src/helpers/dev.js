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
import jetpack from 'fs-jetpack';
import merge from 'deepmerge';
import {createStore} from 'redux';
import reducer from '../reducers/index';
import * as Actions from '../actions/index';
import * as types from '../constants/actionTypes';
import {Provider} from 'react-redux';

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

        readWidgetStorage(id, path, fun){

            var widget = this.state.savedWidgets.find(function(elem){
                return elem.id == id;
            });

            path = widget.storage + "/" + path;

            if(jetpack.exists(userData+'/widgets/' + path) && jetpack.inspect(userData+'/widgets/' + path).type == "dir"){
                var data = jetpack.list(userData+'/widgets/' + path);
                if(!fun) return data;
                return data.map(fun);
            }
            else if(jetpack.exists(userData+'/widgets/' + path) && jetpack.inspect(userData+'/widgets/' + path).type == "file"){
                var data = jetpack.read(userData+'/widgets/' + path);
                if(!fun) return data;
                return data.map(fun);
            }
            return false;
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
            var layout = this.state.layout;

            var id = JSON.stringify(widget.id);
            if(id.includes("*")) {
                id = this.generateMultiId(id.replace("*", ""));
                widget.id = parseFloat(id);
            }

            //layout.push(widget);
            //this.setState({layout: layout})
            store.dispatch(Actions.modifyAtSession(id.toString(), {id: widget.id, tmpWidth: 0,
                tmpHeight: 0,
                tmpTop: 0,
                tmpLeft: 0,
                content: null}));
            store.dispatch(Actions.modifyAtLayout(id.toString(), widget));
            this.forceUpdate();
        }

        render(){
            return(
                <Provider store={store}>
                    <div>
                        <MenuBar addWidget = {this.addWidget}
                                 widgets = {this.state.savedWidgets}/>

                        <Layout store = {store}
                                setLayout = {this.setLayout}
                                widgets = {this.state.savedWidgets}
                        />
                    </div>
                </Provider>
            )
        }
    }


    ReactDOM.render(<App/>, document.getElementById('parent'));
};

