/**
 * Created by JohnBae on 2/13/17.
 */

import * as types from '../constants/actionTypes';
import {Map, fromJS} from 'immutable';

const DEFAULT_SESSION = fromJS({
    gridVisible: false,
    pinMode: false
});



function sessionReducer(state = DEFAULT_SESSION, action) {
    switch (action.type) {
        case types.MODIFY_AT_SESSION:
            return state.mergeDeepIn([action.payload.id.toString()], action.payload.layout);
        case types.SET_SESSION:
            return Map(action.payload);
        case types.DELETE_AT_SESSION:
            return state.delete(action.payload);
        default:
            return state;
    }
}
export default sessionReducer;
