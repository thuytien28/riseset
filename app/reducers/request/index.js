/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {combineReducers} from 'redux';

import fetchStories from './fetch_stories';
import newStory from './new_story';
import editStory from './edit_story';
import deleteStory from './delete_story';
import fetchStoriesByLocation from './fetch_stories_by_location';
import updateProfile from './update_profile';
import loadMoreLocations from './load_more_locations';
import fetchLocations from './fetch_locations';
import fetchLocation from './fetch_location';

export default combineReducers({
    fetchStories,
    newStory,
    deleteStory,
    editStory,
    fetchStoriesByLocation,
    updateProfile,
    loadMoreLocations,
    fetchLocations,
    fetchLocation,
});