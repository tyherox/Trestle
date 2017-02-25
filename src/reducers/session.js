/**
 * Created by JohnBae on 2/13/17.
 */

import * as types from '../constants/actionTypes';
import {Map, fromJS} from 'immutable';


const DEFAULT_SESSION = fromJS({
    gridVisible: false,
    "1": {
        id: 1,
        content: null
    },
    "1.1": {
        id: 1,
        content: null
    }
});

function session(state = DEFAULT_SESSION, action) {
    switch (action.type) {
        case types.MODIFY_AT_SESSION:
            return state.mergeDeepIn([action.payload.id.toString()], action.payload.layout);

        case types.SET_SESSION:
            return Map(action.payload);

        case types.DELETE_AT_SESSION:
            return state.delete(action.payload);

        default:
            return state
    }
}
export default session;
