/**
 * Created by JohnBae on 2/13/17.
 */

import * as types from '../constants/actionTypes';
import {Map, fromJS} from 'immutable';
import fs from '../helpers/fileSystem';

var storage = new fs();

const DEFAULT_STORED_LAYOUTS = fromJS([]);

function scanLayouts(){

}

function storedLayouts(state = DEFAULT_STORED_LAYOUTS, action) {
    switch (action.type) {
        case types.ADD_STORED_LAYOUTS:
            return state.merge(Map(action.payload));

        case types.DELETE_STORED_LAYOUTS:
            return state.delete(action.payload);

        case types.RENAME_STORED_LAYOUTS:
            if(state.has(action.payload.prevName)){
                console.log("!!!");
                return state.delete(action.payload.prevName).set(action.payload.newName,state.get(action.payload.prevName));
            }
        default:
            return state;
    }
}

export default storedLayouts;
