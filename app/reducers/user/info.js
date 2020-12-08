/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import {UserTypes} from '../../action_types';

export default function info(state = {}, action) {
    switch (action.type) {
    case UserTypes.LOGIN_SUCCESS:
        return action.data;

    case UserTypes.LOGIN_ANONYMOUSLY_SUCCESS:
        return action.data;

    case UserTypes.CREATE_USER_SUCCESS:
        return action.data;

    case UserTypes.UPDATE_PROFILE_SUCCESS: {
        const nextState = state;
        if (action.data.picture) {
            nextState.picture = action.data.picture;
        }
        if (action.data.name) {
            nextState.name = action.data.name;
        }
        return nextState;
    }

    case UserTypes.FETCH_USER_SUCCESS:
        return action.data.info;

    case UserTypes.LOGOUT_SUCCESS:
        return {};
    }

    return state;
}