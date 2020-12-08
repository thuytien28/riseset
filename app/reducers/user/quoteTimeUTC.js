/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import {UserTypes} from 'app/action_types';

export default function quoteTimeUTC(state = {}, action) {
    switch (action.type) {
    case UserTypes.FETCH_USER_SUCCESS: {
        if (action.data.pushQuoteTimeIn) {
            return action.data.pushQuoteTimeIn;
        }
        return {};
    }

    case UserTypes.FETCH_QUOTE_TIME_UTC_SUCCESS:
        return action.data;

    case UserTypes.FETCH_QUOTE_TIME_UTC_FAIL:
        return action.data;

    case UserTypes.LOGOUT_SUCCESS:
        return {};
    }

    return state;
}