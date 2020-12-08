/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {createStackNavigator, createDrawerNavigator} from 'react-navigation';
import Content from 'app/components/drawer_content';
import Profile from 'app/screens/profile';

const Screens =
    createStackNavigator(
        {
            Profile: {
                screen: Profile,
            },
        },

        {
            headerMode: 'none',

            // defaultNavigationOptions: ({screenProps}) => ({
            //     headerBackTitle: screenProps.intl.formatMessage({id: 'back', defaultMessage: 'Back'}),
            //     headerBackTitleStyle: {
            //         color: '#000',
            //     },
            //     headerTintColor: '#000',
            // }),
        }
    );

const ProfileStack = createDrawerNavigator(
    {
        Screens,
    },
    {
        drawerPosition: 'right',
        drawerLockMode: 'locked-closed',
        overlayColor: 'rgba(36, 37, 61, 0.87)',
        drawerType: 'slide',
        contentComponent: Content,
        contentOptions: {
            activeTintColor: '#fff',
            activeBackgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
    }
);

export default ProfileStack;
