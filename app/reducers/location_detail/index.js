/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {LocationTypes, UserTypes} from 'app/action_types';

const locationDetail = (state = {}, action) => {
    switch (action.type) {
    case (LocationTypes.LOCATION_FETCH_SUCCESS):
        return action.data;
    case UserTypes.LOGOUT_SUCCESS:
        return {};

    default:
        return state;
    }
};

export default locationDetail;