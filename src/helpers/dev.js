/**
 * Tyherox
 *
 * dev
 *
 * Development Test Framework for test case setup.
 *
 */

import { remote } from 'electron';
import React, {Component} from 'react';
import Layout from '../containers/layout/layout.js';
import ReactDOM from 'react-dom';
import TimeWidget from '../widgets/Time/main.js';
import Sheet from '../widgets/Sheet/main.js';
import jetpack from 'fs-jetpack';

export default function(){

    var widgets = [],
        userData = "dev",
        mother = document.getElementById('parent'),
        screenWidth = mother.getBoundingClientRect().width,
        screenHeight = mother.getBoundingClientRect().height;

    var widgets = [Sheet];

    class App extends Component{

        constructor(props){
            super(props);

            if(jetpack.exists(userData+'/state.json')){
                var savedState = jetpack.read(userData+'/state.json','json')
                this.state = savedState;
            }
            else{
                this.state = {
                    config: [{toolbar: true, findButton: true, sentenceFocusButton: true, widgetOpacity: 100}],
                    layout: [{
                        id:1,
                        refWidth: 3,
                        refHeight: 3,
                        refLeft: 0,
                        refTop: 0,
                    }]
                }
            }


            this.setConfig = this.setConfig.bind(this);
            this.saveLayout = this.saveLayout.bind(this);
            this.saveLayoutToLocal = this.saveLayoutToLocal.bind(this);
            this.setLayout = this.setLayout.bind(this);
            console.log(this.state);
        }

        setConfig(configChanges){
            var config = this.state.config;
            config.forEach(function(attr){
                for(var prop in configChanges) {
                    attr[prop] = configChanges[prop];
                }
            });
            this.setState({config:config});
            this.saveStateToLocal();
        }

        saveLayout(ID, layoutChanges){
            var layout = this.state.layout;
            layout.forEach(function(attr){
                var id = attr["id"];
                if(id==ID){
                    for(var prop in layoutChanges) {
                        attr[prop] = layoutChanges[prop];
                    }
                }
            });
            this.setState({layout: layout});
            this.saveStateToLocal();
        }

        saveStateToLocal(){
            var state = JSON.stringify(this.state, null, "\t");
            jetpack.write(userData+"/state.json",state);
        }


        setLayout(data){
            this.setState({layout: data});
            console.log("State:", this.state);
        }

        saveLayoutToLocal(name){
            var layout = JSON.stringify(this.state.layout, null, "\t");
            jetpack.write(userData+"/layouts/"+name+".json",layout);
            console.log("ADDED");
        }

        render(){

            return(
                <div>
                    <Layout widgets = {widgets}
                            cols = '8'
                            rows = '5'
                            config = {this.state.config[0]}
                            setConfig = {this.setConfig}
                            addLayout = {this.saveLayoutToLocal}
                            saveLayout = {this.saveLayout}
                            setLayout = {this.setLayout}
                            layout = {this.state.layout}
                            screenWidth = {screenWidth}
                            screenHeight ={screenHeight}/>
                </div>
            )
        }
    }


    ReactDOM.render(<App/>, document.getElementById('parent'));
};
