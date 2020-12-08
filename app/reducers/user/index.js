/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import {combineReducers} from 'redux';

import info from './info';
import location from './location';
import isLogin from './login';
import signature from './signature';
import quoteTimeUTC from './quoteTimeUTC';

export default combineReducers({
    info,
    location,
    isLogin,
    signature,
    quoteTimeUTC,
});