/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {StoryTypes, UserTypes} from 'app/action_types';

const newStory = (state = {}, action) => {
    switch (action.type) {
    case StoryTypes.UPLOADING:
        return {
            uploading: true,
            bytesTransferred: action.bytesTransferred,
            totalBytes: action.totalBytes,
        };
    case StoryTypes.UPLOADING_FAIL:
        return {
            error: action.error,
            uploading: false,
        };

    case StoryTypes.UPLOADING_SUCCESS:
        return {
            uploading: false,
            success: true,
        };
    case UserTypes.LOGOUT_SUCCESS:
        return {};
    default:
        return state;
    }
};

export default newStory;