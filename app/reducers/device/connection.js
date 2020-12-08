/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import {UserTypes} from 'app/action_types';
import {DeviceTypes} from 'app/constants';

export default function connection(state = true, action) {
    switch (action.type) {
    case DeviceTypes.CONNECTION_CHANGED:
        return action.data;

    case UserTypes.LOGOUT_SUCCESS:
        return true;
    }

    return state;
}
