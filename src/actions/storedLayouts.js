/**
 * Created by JohnBae on 2/16/17.
 */

import * as types from '../constants/actionTypes';

export const addStoredLayout = (layout) => {
    return {
        type: types.ADD_STORED_LAYOUT,
        payload: layout
    }
};

export const renameStoredLayout = (prevName, newName) => {
    return {
        type: types.RENAME_STORED_LAYOUT,
        payload: {
            prevName: prevName,
            newName: newName
        }
    }
};

export const deleteStoredLayout = (layout) => {
    return {
        type: types.DELETE_STORED_LAYOUT,
        payload: layout
    }
};
