/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {
    View,
    FlatList,
    Text,
    ActivityIndicator,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    PermissionsAndroid,
    ScrollView,
    Platform,
    Alert,
} from 'react-native';

import uuidv4 from 'uuid/v4';
import Geolocation from 'react-native-geolocation-service';
import PropTypes from 'prop-types';
import {request, openSettings, PERMISSIONS, RESULTS, check} from 'react-native-permissions';

import FormattedText from 'app/components/formatted_text';
import Item from './item';
import {autocompleteSearch, getPlaceByCoordinate, getPlaceDetails} from 'app/utils/fetch_google_api';
import SearchBar from './search_bar';
import AppIcon from 'assets/icons/AppIcon';
import AppText from 'app/components/app_text';
import PlaceList from 'app/components/place_list';
import {loadBannerAd} from 'app/firebase/admob';

class LocationSearch extends React.PureComponent {
    static navigationOptions = ({screenProps}) => {
        const {intl} = screenProps;
        const title = intl.formatMessage({id: 'header.title.searchLocation', defaultMessage: 'Search Locations'});
        return {
            title,
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            searchName: '',
            locations: [],
            loading: false,
            sessionToken: uuidv4(),
            currentLocation: null,
        };
    }

    onCurrentLocationPress = async () => {
        this.requestLocationPermission();
    }

    async requestLocationPermission() {
        try {
            const {intl} = this.props.screenProps;
            const locationStatus = await request(Platform.select({
                ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
                android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            }));

            switch (locationStatus) {
            case RESULTS.DENIED:
                Alert.alert(
                    intl.formatMessage({id: 'filterPhoto.enableLocationAccessTitle', defaultMessage: 'Permission denied.'}),
                    intl.formatMessage({id: 'filterPhoto.enableLocationAccessMessage', defaultMessage: 'We can not update your current location.'}),
                    [
                        {
                            text: intl.formatMessage({id: 'button.ok', defaultMessage: 'Ok'}),
                        },
                    ]
                );
                break;
            case RESULTS.GRANTED:
                this.loadCurrentLocation();
                break;
            case RESULTS.BLOCKED, RESULTS.UNAVAILABLE:
                Alert.alert(
                    intl.formatMessage({id: 'blockLocationAccessTitle', defaultMessage: 'Enable permission access your location.'}),
                    intl.formatMessage({id: 'blockLocationAccessMessage', defaultMessage: 'We need your permission to use your location.'}),
                    [
                        {
                            text: intl.formatMessage({id: 'button.cancel', defaultMessage: 'Cancel'}),
                        },
                        {
                            text: intl.formatMessage({id: 'button.ok', defaultMessage: 'Ok'}),
                            onPress: () => this.onOpenSettings(),
                        },
                    ]
                );
                break;
            }
        } catch (err) {
            // console.log('This is error:', err);
        }
    }

    onOpenSettings = async () => {
        try {
            await openSettings();
        } catch (error) {
            console.log('error', error);
        }
    }

    loadCurrentLocation = () => {
        const {navigation} = this.props;
        Geolocation.getCurrentPosition(
            async (position) => {
                const currentLocation = await getPlaceByCoordinate(position.coords.latitude, position.coords.longitude);
                this.setState({
                    currentLocation,
                }, () => {
                    // console.warn(currentLocation);
                    navigation.state.params.chooseExistsLocation(currentLocation);
                    navigation.goBack();
                });
            },
            (error) => console.log('Error', JSON.stringify(error)),
            {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
        );
    };

    onChangeSearchName = (text) => {
        this.setState({searchName: text}, () => {
            if (this.state.searchName === '') {
                this.setState({locations: []});
            } else if (this.state.searchName.length >= 3) {
                this.loadLocations(this.state.searchName);
            }
        });
    }

    loadLocations = async () => {
        const {searchName} = this.state;
        const {sessionToken} = this.state;
        this.setState({
            loading: true,
        });

        try {
            const data = await autocompleteSearch(searchName, sessionToken);
            this.setState({
                locations: data,
                loading: false,
            });
        } catch (err) {
            // console.log(err);
        }
    }

    renderPredictions = ({item}) => {
        return (
            <Item
                leftIcon='place'
                title={item.primaryText}
                details={item.secondaryText}
                onItem={() => this.onPredictionItem(item)}
            />
        );
    };

    onRecentItem = async (item) => {
        const {navigation} = this.props;
        const location = await getPlaceDetails(item.location.id, item.location.name);
        navigation.state.params.chooseExistsLocation(location);
        navigation.goBack();
    }

    onPredictionItem = async (item) => {
        const {navigation} = this.props;
        const location = await getPlaceDetails(item.id, item.primaryText);
        if (location) {
            navigation.state.params.chooseExistsLocation(location);
            navigation.goBack();
        }
    }

    render() {
        const {intl} = this.props.screenProps;
        const {
            searchName,
            locations,
            loading,
            currentLocation,
        } = this.state;
        let numberResult = null;

        let resultsList = null;
        if (locations.length < 10) {
            numberResult = '0' + locations.length;
        } else {
            numberResult = locations.length;
        }

        if (searchName.length < 3) {
            resultsList = (
                <PlaceList
                    lastImageVisible={false}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps='handled'
                    keyboardDismissMode='on-drag'
                    listHeaderComponent={
                        <View style={{paddingHorizontal: 20, paddingBottom: 15}}>
                            <AppText
                                fontText={'SF-Pro-Display-Medium'}
                                style={[styles.recentText]}
                                value={intl.formatMessage({id: 'locationSearch.label.recent', defaultMessage: 'Recent:'})}
                            />
                        </View>
                    }
                    onItemPress={this.onRecentItem}
                    itemSeparatorComponent={
                        () => (
                            <View style={styles.separator}/>
                        )
                    }
                    intl={intl}
                />

            );
        } else if (searchName !== '' && loading === true) {
            resultsList = (
                <View style={{flexDirection: 'row', justifyContent: 'center', paddingTop: 20, paddingHorizontal: 20}}>
                    <ActivityIndicator/>
                    <View style={{width: 5}}/>
                    <FormattedText
                        id='common.label.searching'
                        defaultMessage='Searching'
                    />
                </View>
            );
        } else if (
            searchName !== '' &&
            loading === false &&
            locations.length === 0
        ) {
            resultsList = (
                <React.Fragment>
                    <View style={{flexDirection: 'row', justifyContent: 'center', paddingTop: 20}}>
                        <FormattedText
                            id='common.label.resultNotFound'
                            defaultMessage='Result not found.'
                        />
                    </View>
                </React.Fragment>
            );
        } else {
            resultsList = (
                <FlatList
                    data={locations}
                    keyExtractor={(item) => item.id || item.placeId}
                    renderItem={this.renderPredictions.bind(this)}
                    keyboardShouldPersistTaps='always'
                    keyboardDismissMode='on-drag'
                    ListHeaderComponent={() => (
                        <View style={{flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 10}}>
                            <AppText
                                fontText={'SF-Pro-Display-Medium'}
                                style={styles.resultText}
                                value={intl.formatMessage({id: 'locationSearch.label.result', defaultMessage: 'Result: '})}
                            />
                            <AppText
                                fontText={'SF-Pro-Display-Medium'}
                                style={styles.resultText}
                                value={numberResult}
                            />
                        </View>
                    )}
                    ItemSeparatorComponent={
                        () => (
                            <View style={styles.separator}/>
                        )
                    }
                    intl={intl}
                />

            );
        }

        return (
            <SafeAreaView style={styles.container}>
                <SearchBar
                    searchValue={searchName}
                    searchPlaceholder={intl.formatMessage({id: 'enter_at_least_3_characters', defaultMessage: 'Enter at least 3 characters'})}
                    searchOnChange={this.onChangeSearchName.bind(this)}
                />
                <View style={{paddingHorizontal: 20}}>
                    <TouchableOpacity
                        onPress={() => this.onCurrentLocationPress(currentLocation)}
                        style={styles.currentPlaceView}
                    >
                        <View style={styles.leftIcon}>
                            <AppIcon
                                name='place'
                                size={(17)}
                                color='#e53d01'
                            />
                        </View>
                        <AppText
                            fontText={'SF-Pro-Display'}
                            style={styles.title}
                            value={intl.formatMessage({id: 'locationSearch.currentPlace', defaultMessage: 'CURRENT PLACE'})}
                        />
                    </TouchableOpacity>
                </View>
                {resultsList}
                {/* {loadBannerAd()} */}
            </SafeAreaView>
        );
    }
}

LocationSearch.propTypes = {
    actions: PropTypes.object,
    locations: PropTypes.object,
    navigation: PropTypes.object,
    screenProps: PropTypes.object,
};

export default LocationSearch;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    header: {
        flexDirection: 'row',
        paddingVertical: (20),
        paddingRight: 20,
    },

    iconLeftContainer: {
        paddingHorizontal: 16,
        justifyContent: 'center',
    },

    currentPlaceView: {
        flexDirection: 'row',
        paddingVertical: 2.5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 0.5,
        borderColor: '#EFEFEF',
        borderRadius: 4,
        marginBottom: 10,
    },

    title: {
        color: '#e53d01',
        fontSize: 13,
    },

    leftIcon: {
        paddingVertical: 10,
        marginRight: (10),
    },

    recent: {
        fontSize: 20,
        alignItems: 'center',
        flexDirection: 'row',
    },

    recentText: {
        fontSize: 20,
        fontWeight: '300',
        marginTop: 10,
    },
    resultText: {
        fontSize: 20,
        fontWeight: '300',
        marginTop: 10,
    },

    separator: {
        height: 1,
        backgroundColor: '#EFEFEF',
        marginHorizontal: 20,
    },

});