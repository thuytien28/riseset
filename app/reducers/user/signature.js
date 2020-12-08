/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {UserTypes} from 'app/action_types';

export default function signature(state = {}, action) {
    switch (action.type) {
    case UserTypes.FETCH_USER_SUCCESS: {
        if (action.data.signature) {
            return action.data.signature;
        }
        return {};
    }
    case UserTypes.UPDATE_USER_SIGNATURE_SUCCESS:
        return {
            ...state,
            signature: action.signature,
            font: action.font,
        };

    case UserTypes.LOGOUT_SUCCESS:
        return {};
    }

    return state;
}