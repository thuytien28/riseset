/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {createStackNavigator} from 'react-navigation-stack';
import Login from 'app/screens/login';
import PrivacyPolicy from 'app/screens/privacy_policy/privacy_policy';
import TermsOfService from 'app/screens/terms_of_service/terms_of_service';
import Device from 'app/utils/device';
import {fromRight} from 'react-navigation-transitions';

const LoginStack = createStackNavigator(
    {
        Login: {
            screen: Login,
            navigationOptions: {
                header: null,
            },
        },
        PrivacyPolicy: {
            screen: PrivacyPolicy,
        },
        TermsOfService: {
            screen: TermsOfService,
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

export default LoginStack;
