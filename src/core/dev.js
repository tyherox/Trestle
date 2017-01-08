/**
 * Tyherox
 *
 * dev
 *
 * Development Test Framework for test case setup.
 *
 */

import { remote } from 'electron';
import React from 'react';
import Layout from './LayoutProto.js';
import ReactDOM from 'react-dom';
import TimeWidget from '../widgets/Time/main.js';
import Hub from '../widgets/Hub/main.js';

export default function(){

    var widgets = [],
        mother = document.getElementById('parent'),
        screenWidth = mother.getBoundingClientRect().width,
        screenHeight = mother.getBoundingClientRect().height;

    var widget1 = {id: "T1", refWidth: 1, refHeight: 1, refLeft: 1, refTop: 0, minWidth: 1, minHeight: 1, maxWidth: 5, maxHeight: 5},
        widget2 = {id: "T2", refWidth: 1, refHeight: 1, refLeft: 2, refTop: 0, minWidth: 1, minHeight: 1, maxWidth: 5, maxHeight: 5},
        widget3 = {id: "T3", refWidth: 1, refHeight: 1, refLeft: 3, refTop: 0, minWidth: 1, minHeight: 1, maxWidth: 5, maxHeight: 5},
        widget4 = {id: "T4", refWidth: 1, refHeight: 1, refLeft: 4, refTop: 0, minWidth: 1, minHeight: 1, maxWidth: 5, maxHeight: 5},
        widget5 = {id: "T5", refWidth: 1, refHeight: 1, refLeft: 5, refTop: 0, minWidth: 1, minHeight: 1, maxWidth: 5, maxHeight: 5},
        widget6 = {id: "T6", refWidth: 1, refHeight: 1, refLeft: 6, refTop: 0, minWidth: 1, minHeight: 1, maxWidth: 5, maxHeight: 5},
        widget7 = {id: "T7", refWidth: 1, refHeight: 1, refLeft: 7, refTop: 0, minWidth: 1, minHeight: 1, maxWidth: 5, maxHeight: 5},
        widgets = [widget1,widget2,widget3, widget4,widget5,widget6,Hub, TimeWidget];

    ReactDOM.render(<Layout widgets = {widgets}
                            cols = '8'
                            rows = '5'
                            screenWidth = {screenWidth}
                            screenHeight ={screenHeight}/>, document.getElementById('parent'));
};
