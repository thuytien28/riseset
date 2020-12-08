/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {createStackNavigator} from 'react-navigation-stack';
import Home from 'app/screens/home';
import Profile from 'app/screens/profile';
import EditProfile from 'app/screens/edit_profile';
import Statistical from 'app/screens/statistical';
import PlaceList from 'app/screens/place_list';
import PlaceDetails from 'app/screens/place_details';
import MapDiscover from 'app/screens/map_discover';

const HomeStack = createStackNavigator(
    {
        Home: {
            screen: Home,
            navigationOptions: {
                header: null,
            },
        },
        Profile: {
            screen: Profile,
        },
        EditProfile: {
            screen: EditProfile,
        },
        Statistical: {
            screen: Statistical,
        },
        PlaceList: {
            screen: PlaceList,
        },
        PlaceDetails: {
            screen: PlaceDetails,
        },
    },
    {

        // headerMode: 'none',
    }
);

export default HomeStack;
