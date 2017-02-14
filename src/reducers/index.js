/**
 * Created by JohnBae on 2/13/17.
 */

import {combineReducers} from 'redux'
import * as types from '../constants/actionTypes';
import {Map, List} from 'immutable';

const DEFAULT = Map({
    settings: {
        toolbar: true,
        findButton: true,
        sentenceFocusButton: true,
        widgetOpacity: 100
    },
    layout: [
        {
            id: 1,
            refWidth: 4,
            refHeight:5,
            refTop: 0,
            refLeft: 2
        }
    ],
    session:[
        {
            id: 1
        }
    ]
});

function session(state = DEFAULT.get('session'), action) {
    switch (action.type) {
        case types.SET_SETTING:
            return action.payload
        default:
            return state
    }
}

function layout(state = DEFAULT.get('layout'), action) {
    switch (action.type) {
        case types.SET_SETTING:
            console.log("LAYOUT");
            return action.payload
        default:
            return state
    }
}

function settings(state = DEFAULT.get('settings'), action) {
    switch (action.type) {
        case types.SET_SETTING:
            console.log("SETTINGS");
            return action.payload
        default:
            return state
    }
}

const reducers = combineReducers({
    session,
    layout,
    settings
});

export default reducers;
