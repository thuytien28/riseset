/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import keyMirror from 'app/utils/key_mirror';

export default keyMirror({
    CREATE_USER_REQUEST: null,
    CREATE_USER_SUCCESS: null,
    CREATE_USER_FAILURE: null,

    LOGIN_REQUEST: null,
    LOGIN_SUCCESS: null,
    LOGIN_FAILURE: null,

    LOGIN_ANONYMOUSLY_SUCCESS: null,

    LOGOUT_REQUEST: null,
    LOGOUT_SUCCESS: null,
    LOGOUT_FAILURE: null,

    UPDATE_PROFILE: null,
    UPDATE_PROFILE_SUCCESS: null,
    UPDATE_PROFILE_FAILURE: null,

    FETCH_USER: null,
    FETCH_USER_SUCCESS: null,
    FETCH_USER_FAILED: null,

    UPDATE_USER_LOCATION_SUCCESS: null,
    UPDATE_USER_LOCATION_FAILED: null,

    UPDATE_USER_SIGNATURE_SUCCESS: null,
    UPDATE_USER_SIGNATURE_FAILED: null,

    UPDATE_USER_FCM_TOKEN_SUCCESS: null,
    UPDATE_USER_FCM_TOKEN_FAILED: null,

    UPDATE_USER_LOCALE_SUCCESS: null,
    UPDATE_USER_LOCALE_FAIL: null,

    FETCH_QUOTE_TIME_UTC_SUCCESS: null,
    FETCH_QUOTE_TIME_UTC_FAIL: null,
});
