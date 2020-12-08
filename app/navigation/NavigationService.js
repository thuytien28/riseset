/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import {NavigationActions, StackActions} from 'react-navigation';

let navigator;

function setTopLevelNavigator(navigatorRef) {
    navigator = navigatorRef;
}

function navigate(routeName, params) {
    navigator.dispatch(
        NavigationActions.navigate({
            routeName,
            params,
        })
    );
}

function popToTop() {
    navigator.dispatch(StackActions.popToTop());
}

function resetTo(routeName) {
    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName})],
    });
    navigator.dispatch(resetAction);
}

function resetToWithParams(routeName, params) {
    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName, params})],
    });
    navigator.dispatch(resetAction);
}

// add other navigation functions that you need and export them

export default {
    navigate,
    setTopLevelNavigator,
    resetTo,
    popToTop,
    resetToWithParams,
};
