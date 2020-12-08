/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {StoryTypes, UserTypes} from 'app/action_types';

const fetchByLocation = (state = {}, action) => {
    // console.warn(action);
    switch (action.type) {
    // case StoryTypes.STORIES_FETCH_BY_LOCATION:
    //     return {...state, loading: true, isFetchingSuccess: false};

    // case StoryTypes.STORIES_FETCH_BY_LOCATION_FAIL:
    //     return {...state, isFetchingSuccess: false, errorFetching: 'Fail to add story', loading: false};

    case StoryTypes.STORIES_FETCH_BY_LOCATION_SUCCESS: {
        // console.warn(action.data);
        // return {isFetchingSuccess: true, errorFetching: '', loading: false, data: action.data};
        // let data = [];
        // if (state.data) {
        //     data = state.data;
        // }
        // action.data.map((item) => {
        //     data.push(item);
        // });
        // return {fetchLoading: false, errFetching: '', isFetchSuccess: true, data};
        const nextState = state;
        action.data.forEach((item) => {
            // console.log(item);
            nextState[item.id] = item;
        });

        // console.log(nextState);
        return nextState;
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
        return nextState;
    }

    case UserTypes.LOGOUT_SUCCESS:
        return {};

    case StoryTypes.STORIES_FETCH_BY_LOCATION_RESET:
        return {};

    default:
        return state;
    }
};

export default fetchByLocation;