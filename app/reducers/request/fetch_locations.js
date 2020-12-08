/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {UserTypes} from 'app/action_types';

const fetchLocations = (state = {}, action) => {
    switch (action.type) {
    case 'FETCH_LOCATIONS_STORY':
        return {
            loading: true,
        };

    case 'FETCH_LOCATIONS_STORY_FAILED':
        return {
            loading: false,
            error: action.error,
        };

    case 'FETCH_LOCATIONS_STORY_SUCCESS': {
        return {
            loading: false,
            success: true,
        };
    }
    case UserTypes.LOGOUT_SUCCESS:
        return {};

    default:
        return state;
    }
};

export default fetchLocations;