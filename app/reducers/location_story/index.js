/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {UserTypes} from 'app/action_types';

const locationStory = (state = {}, action) => {
    switch (action.type) {
    case 'FETCH_LOCATIONS_STORY_SUCCESS': {
        return action.data;
    }
    case 'REPLACE_LAST_IMAGE': {
        const nextState = state;
        if (nextState[action.locationId]) {
            nextState[action.locationId].lastImage = action.lastImage;
        }
        return nextState;
    }
    case 'DELETE_USER_LOCATION': {
        const nextState = state;
        if (nextState[action.locationId]) {
            delete nextState[action.locationId];
        }
        return nextState;
    }
    case 'LOAD_MORE_LOCATIONS_SUCCESS': {
        const nextState = {...state};
        action.data.forEach((item) => {
            nextState[item.locationId] = item;
        });
        return nextState;
    }
    case 'UPDATE_LOCATIONS_JUST_UPLOADED_STORY_SUCCESS': {
        const nextState = state;
        if (nextState[action.data.locationId]) {
            delete nextState[action.data.locationId];
        }
        return {
            [action.data.locationId]: action.data,
            ...nextState,
        };
    }
    case UserTypes.LOGOUT_SUCCESS:
        return {};
    }
    return state;
};

export default locationStory;
