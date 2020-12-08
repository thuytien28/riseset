/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {createStackNavigator} from 'react-navigation-stack';

import {
    fadeIn, fromRight, fadeOut, fromBottom,
} from 'react-navigation-transitions';
import Library from 'app/screens/library';
import Camera from 'app/screens/camera';
import FiltersPhoto from 'app/screens/filters_photo';
import LocationSearch from 'app/screens/location_search';
import YourStory from 'app/screens/your_story';
import CreateSignature from 'app/screens/create_signature';
import SunEffects from 'app/screens/sun_effects';
import Device from 'app/utils/device';

const MediaStack = createStackNavigator(
    {
        Library: {
            screen: Library,
        },
        Camera: {
            screen: Camera,
            navigationOptions: {
                header: null,
            },
        },
        SunEffects: {
            screen: SunEffects,
            navigationOptions: {
                gesturesEnabled: false,
            },
        },
        FiltersPhoto: {
            screen: FiltersPhoto,
        },
        LocationSearch: {
            screen: LocationSearch,
        },
        YourStory: {
            screen: YourStory,
        },
        CreateSignature: {
            screen: CreateSignature,
        },
    },
    {

        transitionConfig: (nav) => ({
            ...handleCustomTransition(nav),
        }),
        defaultNavigationOptions: ({screenProps}) => {
            const headerTitleStyle = {};
            if (Device.os === 'android') {
                headerTitleStyle.marginLeft = 0;
                headerTitleStyle.fontFamily = 'SF-Pro-Display-Medium';
            }
            return {
                gesturesEnabled: false,
                headerBackTitle: screenProps.intl.formatMessage({id: 'back', defaultMessage: 'Back'}),
                headerBackTitleStyle: {
                    color: '#000',
                },
                headerTintColor: '#000',

                headerStyle: {
                    borderBottomWidth: 0,
                    shadowColor: 'rgba(0,0,0,0.15)',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 1,
                    shadowRadius: 3,
                    elevation: 5,
                },
                headerTitleStyle,
            };
        },
    }
);

const handleCustomTransition = ({scenes}) => {
    const prevScene = scenes[scenes.length - 2];
    const nextScene = scenes[scenes.length - 1];

    // Custom transitions go there
    // if (prevScene &&
    //     prevScene.route.routeName === 'Camera' &&
    //     nextScene.route.routeName === 'SunEffects') {
    //     return fadeIn();
    // }
    if (Device.os === 'android') {
        return fromRight();
    }
    if (Device.os === 'ios') {
        if (prevScene &&
            prevScene.route.routeName === 'SunEffects' &&
            nextScene.route.routeName === 'Library') {
            return fadeOut();
        }
        if (prevScene &&
            prevScene.route.routeName === 'Library' &&
            nextScene.route.routeName === 'Camera') {
            return fromBottom();
        }
    }
};

export default MediaStack;
