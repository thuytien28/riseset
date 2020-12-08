/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {UserTypes} from 'app/action_types';

const isListEnd = (state = false, action) => {
    switch (action.type) {
    case 'FINISH_LOAD_MORE_LOCATIONS':
        return true;
    case 'RESET_LOAD_MORE_LOCATIONS':
        return false;
    case UserTypes.LOGOUT_SUCCESS:
        return false;
    default:
        return state;
    }
};

export default isListEnd;