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
import Layout from '../core/layout.js';
import ReactDOM from 'react-dom';
import TimeWidget from '../widgets/Time/main.js';
import Sheet from '../widgets/Sheet/main.js';
import jetpack from 'fs-jetpack';

export default function(){

    var widgets = [],
        mother = document.getElementById('parent'),
        screenWidth = mother.getBoundingClientRect().width,
        screenHeight = mother.getBoundingClientRect().height;

    var widgets = [Sheet];

    class App extends Component{

        constructor(props){
            super(props);

            if(jetpack.exists('state.json')){
                var savedState = jetpack.read('state.json','json')
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
                        minWidth: 3,
                        minHeight: 3,
                        maxWidth: 10,
                        maxHeight: 10,
                    }],
                }
            }

            this.setConfig = this.setConfig.bind(this);
            this.setLayout = this.setLayout.bind(this);
            console.log(this.state);
        }

        setConfig(configChanges){
            var config = this.state.config;
            config.forEach(function(attr){
                for(var prop in configChanges) {
                    attr[prop] = configChanges[prop];
                }
            })
            this.setState({config:config});

            var state = JSON.stringify(this.state);
            jetpack.write("state.json",state);
        }

        setLayout(layoutChanges){
            var layout = this.state.layout;
            layout.forEach(function(widget){
                for(var prop in layoutChanges) {
                    widget[prop] = layoutChanges[prop];
                }
            })
            this.setState({config:layout});

            var state = JSON.stringify(this.state);
            jetpack.write("config.json",state);
        }

        render(){
            return(
                <div>
                    <Layout widgets = {widgets}
                            cols = '8'
                            rows = '5'
                            config = {this.state.config[0]}
                            setConfig = {this.setConfig}
                            saveLayout = {this.saveLayout}
                            layout = {this.state.layout[0]}
                            screenWidth = {screenWidth}
                            screenHeight ={screenHeight}/>
                </div>
            )
        }
    }


    ReactDOM.render(<App/>, document.getElementById('parent'));
};
