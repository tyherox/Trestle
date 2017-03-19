/**
 * Created by JohnBae on 2/13/17.
 */

import * as types from '../constants/actionTypes';
import {Map, fromJS} from 'immutable';

const DEFAULT_LAYOUT = fromJS({
    "1": {
        id: 1,
        refWidth: 2,
        refHeight:2,
        refTop: 1,
        refLeft: 0
    },
    "1.1": {
        id: 1.1,
        refWidth: 2,
        refHeight:2,
        refTop: 1,
        refLeft: 2
    }
});

function layout(state = DEFAULT_LAYOUT, action) {

    switch (action.type) {

        case types.MODIFY_AT_LAYOUT:
            return state.mergeDeepIn([action.payload.id.toString()], action.payload.layout);

        case types.SET_LAYOUT:
            return Map(action.payload);

        case types.DELETE_AT_LAYOUT:
            return state.delete(action.payload);

        default:
            return state
    }
}

export default layout;
