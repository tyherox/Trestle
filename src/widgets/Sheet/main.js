/**
 * Tyherox
 *
 * TimeWidget
 *
 * The TimeWidget is a simple widget used to tell time. Expanding adds the functionality of showing seconds
 */

import React from 'react';
import Toolbar from './toolbar.jsx';
import Editor from './editor.js';

 export default {
     id:1,
     multi: true,
     minWidth: 2,
     minHeight: 2,
     maxWidth: 10,
     maxHeight: 10,
     storage: "1-sheets",
     toolbar: Toolbar,
     content: Editor
 };
