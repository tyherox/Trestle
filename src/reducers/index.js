/**
 * Created by JohnBae on 2/13/17.
 */

import {combineReducers} from 'redux'
import layout from './layout';
import session from './session';
import settings from './settings';
import storedLayouts from './storedLayouts';


const reducers = combineReducers({
    session,
    layout,
    settings,
    storedLayouts
});

export default reducers;
