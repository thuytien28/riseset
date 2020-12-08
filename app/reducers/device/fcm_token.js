
/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {GeneralTypes} from 'app/action_types';

export default function fcmToken(state = '', action) {
    switch (action.type) {
    case GeneralTypes.STORAGE_FCM_TOKEN:
        return action.fcmToken;
    }
    return state;
}
