/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

export const getUserInfo = (state) => {
    return state.user.info;
};
export const getUserLocation = (state) => {
    return state.user.location;
};
export const getUserSignature = (state) => {
    return state.user.signature;
};