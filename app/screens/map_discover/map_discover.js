/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

import {moderateScale} from 'app/utils/scaling';
import AppIcon from 'assets/icons/AppIcon';

class MapDiscover extends React.PureComponent {
    static propTypes = {
        actions: PropTypes.object,
        locationDetails: PropTypes.object,
        navigation: PropTypes.object,
        loading: PropTypes.bool,
    };

    componentDidMount() {
        const {actions, navigation} = this.props;
        actions.fetchLocation(navigation.state.params.locationId);
    }

    render() {
        const {navigation, locationDetails, loading} = this.props;

        if (loading || !locationDetails || !locationDetails.lat) {
            return null;
        }
        const region = {
            latitude: locationDetails.lat,
            longitude: locationDetails.lng,
            latitudeDelta: 0.05,
            longitudeDelta: 0.09,
        };
        const MapCpn = (
            <MapView
                region={region}
                provider={PROVIDER_GOOGLE}
                style={{...StyleSheet.absoluteFillObject}}
            >
                <Marker
                    coordinate={{latitude: locationDetails.lat, longitude: locationDetails.lng}}
                />
            </MapView>
        );

        const BackBtn = (
            <TouchableOpacity
                style={styles.backContainer}
                onPress={() => navigation.goBack()}
            >
                <AppIcon
                    name='arow-left'
                    size={20}
                    color={'#24253D'}
                />
            </TouchableOpacity>
        );

        return (
            <View style={styles.container}>
                {MapCpn}
                <SafeAreaView>{BackBtn}</SafeAreaView>
            </View>
        );
    }
}

export default MapDiscover;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backContainer: {
        height: moderateScale(50),
        width: moderateScale(50),
        borderRadius: moderateScale(50) / 2,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: moderateScale(16),
        marginLeft: moderateScale(16),
    },
});
