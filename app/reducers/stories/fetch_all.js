/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {StoryTypes, UserTypes} from 'app/action_types';

export default function fetchAll(state = {}, action) {
    switch (action.type) {
    case StoryTypes.STORIES_FETCH_BY_USER_SUCCESS: {
        const nextState = state;
        action.data.forEach((item) => {
            nextState[item.id] = item;
        });
        return nextState;
    }
    case StoryTypes.GET_JUST_UPLOADED_STORY_SUCCESS: {
        return {
            [action.data.id]: action.data,
            ...state,
        };
    }

    case StoryTypes.UPDATE_STORY_SUCCESS: {
        const nextState = state;
        nextState[action.data.id] = action.data;
        return nextState;
    }
    case StoryTypes.DELETE_STORY_SUCCESS: {
        const nextState = state;
        if (nextState[action.deletedStoryId]) {
            delete nextState[action.deletedStoryId];
        }

        // if (action.replaceStory) {
        //     nextState[action.replaceStory.id] = action.replaceStory;
        // }
        return nextState;
    }

    case UserTypes.LOGOUT_SUCCESS:
        return {};
    }
    return state;
}