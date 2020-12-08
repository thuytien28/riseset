/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import {combineReducers} from 'redux';

import connection from './connection';
import websocket from './websocket';
import info from './info';
import fcmToken from './fcm_token';

export default combineReducers({
    fcmToken,
    info,
    connection,
    websocket,
});
