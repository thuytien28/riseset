/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {Easing, Animated} from 'react-native';
import {
    fromBottom, fromRight,
} from 'react-navigation-transitions';

import AppTab from 'app/navigation/app_tab';
import PhotographyTips from 'app/screens/photography_tips';
import StoryDetails from 'app/screens/story_details';
import MapDiscover from 'app/screens/map_discover';
import Device from 'app/utils/device';
import LocationSearch from 'app/screens/location_search';
import Content from 'app/components/drawer_content';
import MediaStack from './media_stack';
import YourStory from 'app/screens/your_story';
import Profile from 'app/screens/profile';
import EditProfile from 'app/screens/edit_profile';
import PlaceList from 'app/screens/place_list';
import PlaceDetails from 'app/screens/place_details';
import PrivacyPolicy from 'app/screens/privacy_policy/privacy_policy';
import TermsOfService from 'app/screens/terms_of_service/terms_of_service';
import Quote from 'app/screens/quote';
import Library from 'app/screens/library';

const Screens =
    createStackNavigator(
        {
            AppTab: {
                screen: AppTab,
                navigationOptions: {
                    header: null,
                },
            },
            MapDiscover: {
                screen: MapDiscover,
                navigationOptions: {
                    header: null,
                },
            },
            PhotographyTips: {
                screen: PhotographyTips,
            },
            StoryDetails: {
                screen: StoryDetails,
                navigationOptions: {
                    header: null,
                    headerStyle: {
                        backgroundColor: 'transparent',
                        borderBottomColor: 'transparent',
                        borderBottomWidth: 0,
                    },
                },
            },
            YourStory: {
                screen: YourStory,
            },
            MediaStack: {
                screen: MediaStack,
                navigationOptions: {
                    header: null,
                    gesturesEnabled: false, // Platform.select({ios: false, android: true}),
                },
            },
            LocationSearch: {
                screen: LocationSearch,
            },
            Profile: {
                screen: Profile,
                navigationOptions: {
                    drawerLockMode: 'unlocked',
                },
            },
            EditProfile: {
                screen: EditProfile,
            },
            PlaceList: {
                screen: PlaceList,
            },
            PlaceDetails: {
                screen: PlaceDetails,
            },
            PrivacyPolicy: {
                screen: PrivacyPolicy,
            },
            TermsOfService: {
                screen: TermsOfService,
            },
            Quote: {
                screen: Quote,
                navigationOptions: {
                    header: null,
                },
            },

            // Library: {
            //     screen: Library,
            // },

        },

        {

            // headerMode: 'none',
            navigationOptions: ({navigation}) => {
                let drawerLockMode = 'unlocked';
                if (getActiveRouteName(navigation.state) !== 'Profile') {
                    drawerLockMode = 'locked-closed';
                }

                return {
                    drawerLockMode,
                };
            },
            transitionConfig: (nav) => ({
                ...handleCustomTransition(nav),
                transitionSpec: {
                    duration: 200,
                    easing: Easing.out(Easing.poly(4)),
                    timing: Animated.timing,
                },
            }),
            defaultNavigationOptions: ({screenProps}) => ({
                gesturesEnabled: false,
                headerBackTitle: screenProps.intl.formatMessage({id: 'back', defaultMessage: 'Back'}),
                headerBackTitleStyle: {
                    color: '#000',
                },
                headerTintColor: '#000',
            }),
        }
    );

const AppMain = createDrawerNavigator(
    {
        Screens,
    },
    {
        drawerPosition: 'right',
        drawerLockMode: 'locked-closed',
        overlayColor: 'rgba(0,0,0,0.6)',
        contentComponent: Content,
        contentOptions: {
            activeTintColor: '#fff',
            activeBackgroundColor: 'rgba(0,0,0,0.6)',
        },
    }
);
const handleCustomTransition = ({scenes}) => {
    const prevScene = scenes[scenes.length - 2];
    const nextScene = scenes[scenes.length - 1];

    // Custom transitions go there
    if (prevScene &&
        prevScene.route.routeName === 'AppTab' &&
        nextScene.route.routeName === 'MediaStack' && Device.os === 'ios') {
        return fromBottom();
    }

    if (Device.os === 'android' && prevScene &&
        nextScene.route.routeName !== 'MediaStack') {
        return fromRight();
    }
};

const getActiveRouteName = (navigationState) => {
    if (!navigationState) {
        return null;
    }
    const route = navigationState.routes[navigationState.index];

    // dive into nested navigators
    if (route.routes) {
        return getActiveRouteName(route);
    }
    return route.routeName;
};

export default AppMain;
