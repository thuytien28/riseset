/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {UserTypes} from 'app/action_types';

const loadMoreLocations = (state = {}, action) => {
    switch (action.type) {
    case 'LOAD_MORE_LOCATIONS':
        return {
            loading: true,
        };
    case 'LOAD_MORE_LOCATIONS_FAILED':
        return {
            error: action.error,
            loading: false,
        };

    case 'LOAD_MORE_LOCATIONS_SUCCESS':
        return {
            loading: false,
            success: true,
        };
    case 'FINISH_LOAD_MORE_LOCATIONS':
        return {
            loading: false,
        };
    case UserTypes.LOGOUT_SUCCESS:
        return {};
    default:
        return state;
    }
};

export default loadMoreLocations;