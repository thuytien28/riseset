/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {StoryTypes, UserTypes} from 'app/action_types';

const deleteStory = (state = {}, action) => {
    switch (action.type) {
    case StoryTypes.DELETE_STORY:
        return {
            loading: true,
        };
    case StoryTypes.DELETE_STORY_FAILED:
        return {
            error: action.error,
            loading: false,
        };

    case StoryTypes.DELETE_STORY_SUCCESS:
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

export default deleteStory;