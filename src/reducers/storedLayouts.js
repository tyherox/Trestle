/**
 * Created by JohnBae on 2/13/17.
 */

import * as types from '../constants/actionTypes';
import {Map, List} from 'immutable';

const DEFAULT_STORED_LAYOUTS = Map();

function settings(state = DEFAULT_STORED_LAYOUTS, action) {
    switch (action.type) {
        case types.ADD_STORED_LAYOUT:
            return state.merge(Map(action.payload));

        case types.DELETE_STORED_LAYOUT:
            return state.delete(action.payload);

        case types.RENAME_STORED_LAYOUT:
            if(state.has(action.payload.prevName)){
                console.log("!!!");
                return state.delete(action.payload.prevName).set(action.payload.newName,state.get(action.payload.prevName));
            }

        default:
            return state;
    }
}

export default settings;
