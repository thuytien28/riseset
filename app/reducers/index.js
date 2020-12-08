/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import {combineReducers} from 'redux';

import app from './app';
import device from './device';
import navigation from './navigation';
import user from './user';
import stories from './stories';
import locationStory from './location_story';
import request from './request';
import views from './views';
import currentQuote from './quote';
import locationDetails from './location_detail';

export default combineReducers({
    app,
    device,
    navigation,
    user,
    stories,
    request,
    locationStory,
    views,
    currentQuote,
    locationDetails,
});
