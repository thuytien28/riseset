/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {StoryTypes, UserTypes} from 'app/action_types';

const fetchStories = (state = {}, action) => {
    switch (action.type) {
    case StoryTypes.STORIES_FETCH_BY_USER:
        return {
            loading: true,
        };

    case StoryTypes.STORIES_FETCH_BY_USER_FAIL:
        return {
            loading: false,
            error: action.error,
        };

    case StoryTypes.STORIES_FETCH_BY_USER_SUCCESS: {
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

export default fetchStories;