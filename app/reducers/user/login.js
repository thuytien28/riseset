/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import {UserTypes} from '../../action_types';

export default function isLogin(state = false, action) {
    switch (action.type) {
    case UserTypes.LOGOUT_SUCCESS:
        return false;

    case UserTypes.FETCH_USER_SUCCESS:
        return true;
        
    case UserTypes.CREATE_USER_SUCCESS:
        return true;
    }

    return state;
}
