/**
 * Created by JohnBae on 2/13/17.
 */

import * as types from '../constants/actionTypes';
import {Map, List} from 'immutable';

const DEFAULT_LAYOUT = Map({
    1: {
        id: 1,
        refWidth: 4,
        refHeight:5,
        refTop: 0,
        refLeft: 2
    },
    2: {
        id: 2,
        refWidth: 4,
        refHeight:5,
        refTop: 0,
        refLeft: 2
    }
});



function layout(state = DEFAULT_LAYOUT, action) {
    switch (action.type) {
        case types.MODIFY_AT_LAYOUT:
            return state.merge(action.payload);

        case types.SET_LAYOUT:
            return Map(action.payload);

        case types.DELETE_AT_LAYOUT:
            return state.delete(action.payload);

        default:
            return state
    }
}

export default layout;
