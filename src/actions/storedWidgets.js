/**
 * Created by JohnBae on 2/16/17.
 */

import * as types from '../constants/actionTypes';

export const addStoredWidget = (widget) => {
    return {
        type: types.ADD_STORED_WIDGETS,
        payload: widget
    }
};

export const renameStoredWidget = (prevName, newName) => {
    return {
        type: types.RENAME_STORED_LAYOUTS,
        payload: {
            prevName: prevName,
            newName: newName
        }
    }
};

export const deleteStoredWidget = (layout) => {
    return {
        type: types.DELETE_AT_LAYOUT,
        payload: layout
    }
};
