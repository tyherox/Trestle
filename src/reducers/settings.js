/**
 * Created by JohnBae on 2/13/17.
 */

import * as types from '../constants/actionTypes';
import {Map, List} from 'immutable';

const DEFAULT_SETTINGS = Map({
    screenWidth: screen.width,
    screenHeight: screen.height,
    gridCols: 8,
    gridRows: 5,
    toolbar: true,
    findButton: true,
    sentenceFocusButton: true,
    widgetOpacity: 100
});

function settings(state = DEFAULT_SETTINGS, action) {
    switch (action.type) {
        case types.MODIFY_AT_SETTING:
            return state.merge(action.payload);

        case types.SET_SETTING:
            return Map(action.payload);

        default:
            return state;
    }
}

export default settings;
