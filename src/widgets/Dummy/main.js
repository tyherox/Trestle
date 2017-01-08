/**
 * Tyherox
 *
 * TimeWidget
 *
 * The TimeWidget is a simple widget used to tell time. Expanding adds the functionality of showing seconds
 */

import React from 'react';

export default class Time extends React.Component{

    constructor(props){
        super(props);
    }

    render(){

        return (
            <div id="time" ref = 'time' key ='100'>{this.state.time}</div>
        );
    }
}

