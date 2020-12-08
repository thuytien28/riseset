/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {UserTypes} from 'app/action_types';

const updateProfile = (state = {}, action) => {
    switch (action.type) {
    case UserTypes.UPDATE_PROFILE:
        return {
            loading: true,
        };
    case UserTypes.UPDATE_PROFILE_FAILED:
        return {
            error: action.error,
            loading: false,
        };

    case UserTypes.UPDATE_PROFILE_SUCCESS:
        return {
            loading: false,
            success: true,
        };
    case UserTypes.LOGOUT_SUCCESS:
        return {};
    default:
        return state;
    }
};

export default updateProfile;