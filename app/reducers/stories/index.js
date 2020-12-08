/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {combineReducers} from 'redux';

import fetchByLocation from './fetch_by_location';
import fetchAll from './fetch_all';
import count from './count';

export default combineReducers({
    fetchByLocation,
    count,
    fetchAll,
});