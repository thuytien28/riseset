/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {StoryTypes, UserTypes} from 'app/action_types';

const fetchStoriesByLocation = (state = {}, action) => {
    switch (action.type) {
    case StoryTypes.STORIES_FETCH_BY_LOCATION:
        return {
            loading: true,
        };

    case StoryTypes.STORIES_FETCH_BY_LOCATION_FAIL:
        return {
            loading: false,
            error: action.error,
        };

    case StoryTypes.STORIES_FETCH_BY_LOCATION_SUCCESS: {
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

export default fetchStoriesByLocation;