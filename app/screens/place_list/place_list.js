/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';

import PropTypes from 'prop-types';

import AppText from 'app/components/app_text';
import PlaceListCpn from 'app/components/place_list';
import {loadBannerAd} from 'app/firebase/admob';
import BannerFbAds from 'app/firebase/facebookads/bannerView';

class PlaceList extends React.PureComponent {
    static propTypes = {
        actions: PropTypes.object,
        navigation: PropTypes.object,
        screenProps: PropTypes.object,
    };
    static navigationOptions = ({screenProps}) => {
        return {
            headerTitle: (
                <AppText
                    style={{fontSize: 17}}
                    value={screenProps.intl.formatMessage({id: 'screenHeader.title.yourPlaces', defaultMessage: 'Your Places'})}
                />
            ),
        };
    };

    componentWillUnmount() {
        this.props.actions.resetLoadMoreLocations();
    }
    render() {
        const {navigation, screenProps} = this.props;

        return (
            <View style={styles.container}>
                <PlaceListCpn
                    onItemPress={(item) => {
                        navigation.navigate('PlaceDetails', {
                            placeDetail: item.location,
                        });
                    }}
                    isLoadMore={true}
                    intl={screenProps.intl}
                    contentContainerStyle={{paddingTop: 20}}
                />
                {/* {loadBannerAd()} */}
                <BannerFbAds/>
            </View>
        );
    }
}

PlaceList.propTypes = {
    navigation: PropTypes.object,
};

export default PlaceList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    checkedIn: {
        fontSize: 17,
        marginTop: 20,
        marginLeft: 20,
        marginBottom: 25,
        fontWeight: '500',
    },
});
