/**
 * Created by JohnBae on 2/16/17.
 */

import * as types from '../constants/actionTypes';

export const modifyAtSession = (id, layout) =>{
    //console.log("Logging Session Change:", id, layout);
    return {
        type: types.MODIFY_AT_SESSION,
        payload: {
            id: id,
            layout: layout
        }
    }
};

export const setSession = (session) =>{

    return {
        type: types.SET_SESSION,
        payload: session
    }
};

export const deleteAtSession = (key) =>{

    return {
        type: types.DELETE_AT_SESSION,
        payload: key
    }
};

export const testingMessage = (text)=>{
    console.log("Messaging test:", text);
    return {
        type: null
    }
}
