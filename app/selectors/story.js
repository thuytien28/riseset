/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

export const getStoriesForUser = (state) => {
    const stories = Object.values(state.stories.fetchAll);
    return stories;
};

export const getStory = (state, storyId) => {
    return state.stories.fetchAll[storyId] || state.stories.fetchByLocation[storyId];
};

export const getStoriesForLocation = (state, locationId) => {
    const stories = Object.values(state.stories.fetchByLocation);
    return stories.filter((story) => story.locationId === locationId);
};