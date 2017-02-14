/**
 * Created by JohnBae on 2/13/17.
 */

import * as types from '../constants/actionTypes';

export default function setSetting(setting) {
    return {
        type: types.SET_SETTING,
        payload: {
            setting
        }
    }
}
export function setSession(session){
    return {
        type: types.SET_SETTING,
        payload: {
            session
        }
    }
}
export function setLayout(layout){
    return {
        type: types.SET_SETTING,
        payload: {
            layout
        }
    }
}
