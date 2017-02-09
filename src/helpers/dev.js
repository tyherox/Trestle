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
import merge from 'deepmerge'

export default function(){

    var widgets = [Sheet],
        userData = "dev",
        screenWidth =screen.width,
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
                    layout: [{
                        id: 1,
                        refWidth: 4,
                        refHeight:5,
                        refTop: 0,
                        refLeft: 2,
                        state: []
                    }],
                    themeStorage: [
                        {}
                    ],
                    widgetStorage: [
                        Sheet
                    ],
                    layoutStorage: [
                        {}
                    ]
                }
            }

            this.scanUserData = this.scanUserData.bind(this);
            this.readExternalData = this.readExternalData.bind(this);
            this.storeExternalData = this.storeExternalData.bind(this);
            this.setSettings = this.setSettings.bind(this);
            this.setLayout = this.setLayout.bind(this);
            this.addLayout = this.addLayout.bind(this);
            this.deleteLayout = this.deleteLayout.bind(this);
            this.renameLayout = this.renameLayout.bind(this);
            this.updateWidgetState = this.updateWidgetState.bind(this);
            this.saveStateToLocal = this.saveStateToLocal.bind(this);
        }

        componentDidMount(){
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
               this.setState({layoutStorage: layouts});
           }
        }

        readExternalData(){

        }

        storeExternalData(){

        }

        setSettings(settingChanges){
            var settings = this.state.settings;
            for(var prop in settingChanges) {
                settings[prop] = settingChanges[prop];
            }
            this.setState({settings:settings});
            this.saveStateToLocal();
        }

        setLayout(layout){
            this.setState({layout: layout});
            this.saveStateToLocal();
        }

        addLayout(name){
            var layout = JSON.stringify(this.state.layout, null, "\t");
            jetpack.write(userData+"/layouts/"+name+".json",layout);
            console.log("ADDED LAYOUT");
            this.scanUserData();
        }

        deleteLayout(name){
            jetpack.remove(userData+"/layouts/"+name+".json");
            this.scanUserData();
        }

        renameLayout(prevName, name){
            jetpack.rename(userData+"/layouts/"+prevName+".json", name+".json");
            this.scanUserData();
        }

        updateWidgetState(id, state){
            var widget = this.state.widgetStorage.find(function(elem){
                return elem.id == id;
            });
            var result = merge(widget, state);
            var widgets = this.state.widgetStorage;
            widgets.forEach(function(widget){
                if(id==widget.id) {
                    for(var props in result){
                        widget[props] = result[props];
                    }
                }
            });
            this.setState({widgetStorage:widgets});
        }

        saveStateToLocal(){
            var state = JSON.stringify(this.state, null, "\t");
            //jetpack.write(userData+"/state.json",state);
        }

        render(){

            console.log("Dev:",this.state.layout);
            return(
                <div>
                    <MenuBar settings={this.state.settings}
                             setSettings={this.setSettings}
                             layouts={this.state.layoutStorage}
                             addLayout={this.addLayout}
                             setLayout={this.setLayout}
                             deleteLayout={this.deleteLayout}
                             renameLayout={this.renameLayout}
                             widgets = {this.state.widgetStorage}/>

                    <Layout gridCols = '8'
                            gridRows = '5'
                            screenWidth = {screenWidth}
                            screenHeight ={screenHeight}
                            gridHeight = {screenHeight/5}
                            gridWidth = {(screenWidth - 40)/8}
                            cellOffset = {4}
                            settings = {this.state.settings}
                            layout = {this.state.layout}
                            setLayout = {this.setLayout}
                            widgets = {this.state.widgetStorage}
                            updateWidgetState = {this.updateWidgetState}
                            />
                </div>
            )
        }
    }


    ReactDOM.render(<App/>, document.getElementById('parent'));
};

