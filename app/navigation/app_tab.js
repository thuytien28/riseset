/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import AppIcon from 'assets/icons/AppIcon';
import GoldenMomentStack from './golden_moment_stack';
import Camera from 'app/screens/camera';

import HomeIconActive from 'app/components/svg/home_icon_active';
import GMIconActive from 'app/components/svg/gm_icon_active';
import NavigationService from './NavigationService';
import AppTabComponent from 'app/components/app_tab';
import Home from 'app/screens/home';

const AppTab = createBottomTabNavigator(
    {
        Home: {
            screen: Home,
            navigationOptions: {
                tabBarIcon: ({focused, tintColor}) => {
                    if (focused) {
                        return <HomeIconActive/>;
                    }
                    return (
                        <AppIcon
                            name={'home'}
                            size={(32)}
                            color={tintColor}
                        />
                    );
                },
            },
        },
        Camera: {
            screen: Camera,
            navigationOptions: {
                tabBarIcon: ({focused, tintColor}) => (
                    <AppIcon
                        name={'add-new'}
                        size={(32)}
                        color={tintColor}
                    />
                ),
                tabBarOnPress: () => {
                    NavigationService.navigate('MediaStack');
                },
                tabBarVisible: false,
            },
        },
        GoldenMoment: {
            screen: GoldenMomentStack,
            navigationOptions: {
                tabBarIcon: ({focused, tintColor}) => {
                    if (focused) {
                        return <GMIconActive/>;
                    }
                    return (
                        <AppIcon
                            name={'gm-tab'}
                            size={(32)}
                            color={tintColor}
                        />
                    );
                },
            },
        },
    },
    {
        initialRouteName: 'Home',
        tabBarComponent: AppTabComponent,
        tabBarOptions: {
            showIcon: true,
            showLabel: false,
            inactiveTintColor: 'rgba(0,0,0,0.6)',
        },
    }
);

export default AppTab;
