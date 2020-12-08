/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {LocationTypes, UserTypes} from 'app/action_types';

const fetchLocation = (state = {}, action) => {
    switch (action.type) {
    case LocationTypes.LOCATION_FETCH:
        return {
            loading: true,
        };
    case LocationTypes.LOCATION_FETCH_FAIL:
        return {
            loading: false,
            error: action.error,
        };

    case LocationTypes.LOCATION_FETCH_SUCCESS: {
        return {
            loading: false,
            success: true,
        };
    }
    case UserTypes.LOGOUT_SUCCESS:
        return {};

    default:
        return state;
    }
};

export default fetchLocation;