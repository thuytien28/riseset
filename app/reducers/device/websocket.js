/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import {GeneralTypes, UserTypes} from 'app/action_types';

function getInitialState() {
    return {
        connected: false,
        lastConnectAt: 0,
        lastDisconnectAt: 0,
    };
}

export default function(state = getInitialState(), action) {
    if (!state.connected && action.type === GeneralTypes.WEBSOCKET_SUCCESS) {
        return {
            ...state,
            connected: true,
            lastConnectAt: new Date().getTime(),
        };
    } else if (
        state.connected &&
        (action.type === GeneralTypes.WEBSOCKET_FAILURE ||
            action.type === GeneralTypes.WEBSOCKET_CLOSED)
    ) {
        return {
            ...state,
            connected: false,
            lastDisconnectAt: new Date().getTime(),
        };
    }

    if (action.type === UserTypes.LOGOUT_SUCCESS) {
        return getInitialState();
    }

    return state;
}
