/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
export function handleIgnoreAction(dispatch, action) {
    if (
        action.type === 'Navigation/COMPLETE_TRANSITION' ||
        action.type === 'Navigation/MARK_DRAWER_IDLE' ||
        action.type === 'Navigation/MARK_DRAWER_SETTLING' ||
        action.type === 'Navigation/DRAWER_CLOSED' ||
        action.type === 'Navigation/DRAWER_OPENED' ||
        action.type === 'Navigation/OPEN_DRAWER'
    ) {
        return null;
    }
    dispatch(action);
    return null;
}