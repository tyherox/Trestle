/**
 * Created by JohnBae on 2/16/17.
 */

import * as types from '../constants/actionTypes';

export const addStoredLayout = (layout) => {
    return {
        type: types.ADD_STORED_LAYOUTS,
        payload: layout
    }
};

export const renameStoredLayout = (prevName, newName) => {
    return {
        type: types.RENAME_STORED_LAYOUTS,
        payload: {
            prevName: prevName,
            newName: newName
        }
    }
};

export const deleteStoredLayout = (id) => {
    return {
        type: types.DELETE_STORED_LAYOUTS,
        payload: id
    }
};
