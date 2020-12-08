/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {createStackNavigator} from 'react-navigation-stack';
import GoldenMoment from 'app/screens/golden_moment';
import ViewAll from 'app/screens/golden_moment/view_all';
import Custom from 'app/screens/golden_moment/custom';
import MoreInfo from 'app/screens/golden_moment/custom/more_info';
import CalendarComponent from 'app/screens/golden_moment/calendar';
import Device from 'app/utils/device';
import {fromRight} from 'react-navigation-transitions';

const GoldenMomentStack = createStackNavigator(
    {
        GoldenMoment: {
            screen: GoldenMoment,

            // navigationOptions: {
            //     header: null,
            // },
        },
        ViewAll: {
            screen: ViewAll,
        },
        Custom: {
            screen: Custom,
        },
        MoreInfo: {
            screen: MoreInfo,
        },
        CalendarComponent: {
            screen: CalendarComponent,
        },
    },
    {
        transitionConfig: (nav) => ({
            ...handleCustomTransition(nav),
        }),
        defaultNavigationOptions: ({screenProps}) => ({
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
        }),
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
};

export default GoldenMomentStack;
