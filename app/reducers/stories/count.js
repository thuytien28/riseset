/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {StoryTypes, UserTypes} from 'app/action_types';

const count = (state = {
    images: 0,
    stories: 0,
    places: 0,
}, action) => {
    switch (action.type) {
    case StoryTypes.COUNT_STORIES_AND_IMAGES_BY_USER:
        return {
            ...action.data,
        };

    case UserTypes.LOGOUT_SUCCESS:
        return {};

    default:
        return state;
    }
};

export default count;