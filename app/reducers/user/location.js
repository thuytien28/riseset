/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import {UserTypes} from 'app/action_types';

export default function location(state = {}, action) {
    switch (action.type) {
    case UserTypes.FETCH_USER_SUCCESS: {
        if (action.data.location) {
            return action.data.location;
        }
        return {};
    }
    case UserTypes.UPDATE_USER_LOCATION_SUCCESS:
        return action.location;

    case UserTypes.LOGOUT_SUCCESS:
        return {};
    }

    return state;
}