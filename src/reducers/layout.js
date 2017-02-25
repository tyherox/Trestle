/**
 * Created by JohnBae on 2/13/17.
 */

import * as types from '../constants/actionTypes';
import {Map, fromJS} from 'immutable';

const DEFAULT_LAYOUT = fromJS({
    "1": {
        id: 1,
        refWidth: 4,
        refHeight:5,
        refTop: 0,
        refLeft: 4
    },
    "1.1": {
        id: 1.1,
        refWidth: 4,
        refHeight:5,
        refTop: 0,
        refLeft: 0
    }
});

function intersects(cRect, iRect, offset){
    if(((cRect.left>=iRect.left + offset&&cRect.left<iRect.left+iRect.width - offset)||
        (iRect.left + offset>=cRect.left&&iRect.left + offset<cRect.left+cRect.width))&&
        ((cRect.top>=iRect.top + offset &&cRect.top<iRect.top+iRect.height - offset)||
        (iRect.top + offset>=cRect.top&&iRect.top + offset<cRect.top+cRect.height))){
        return true;
    }
    return false;
};

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
