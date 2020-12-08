/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {createAppContainer, createSwitchNavigator} from 'react-navigation';

import AuthLoading from 'app/screens/auth_loading';
import AppMain from 'app/navigation/app_main';
import LoginStack from './login_stack';

export default createAppContainer(
    createSwitchNavigator(
        {
            AuthLoading,
            AppMain,
            LoginStack,
        },
        {
            initialRouteName: 'AuthLoading',
        }
    )
);
