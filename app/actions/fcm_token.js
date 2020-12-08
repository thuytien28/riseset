/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {GeneralTypes} from 'app/action_types';

export const storageFcmToken = (fcmToken) => {
    return {
        type: GeneralTypes.STORAGE_FCM_TOKEN,
        fcmToken,
    };
};