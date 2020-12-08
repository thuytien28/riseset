/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {
    StyleSheet,
    Platform,
    ScrollView,
    View,
    TouchableOpacity,
    SafeAreaView,
    Linking,
    Alert,
    StatusBar,
} from 'react-native';
import Header from './header';
import SunCalc from './algorithms/suncalc';
import PropTypes from 'prop-types';
import LoadingHolder from 'app/utils/loading_holder';
import AppIcon from 'assets/icons/AppIcon';
import AppText from 'app/components/app_text';
import RiseSet from './rise_set';
import moment from 'moment';
import FormattedDate from 'app/components/formatted_date';
import {request, PERMISSIONS, RESULTS, check, openSettings} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import {getPlaceByCoordinate} from 'app/utils/fetch_google_api';
import {loadBannerAd} from 'app/firebase/admob';
class GoldenMoment extends React.PureComponent {
    constructor(props) {
        super(props);
        const {user} = props;
        props.navigation.addListener('willFocus', () => {
            StatusBar.setHidden(false);
        });
        this.state = {
            day: new Date().getTime(),
            location: {},
            sunrise: {},
            sunset: {},
            nextMoment: {},
            remind: user.settings ? user.settings.remind : {
                timeSunrise: 60,
                timeSunset: 60,
                isRemindSunrise: false,
                isRemindSunset: false,
            },
            timezone: 'Asia/Bangkok',
            isFetchLocationSuccess: false,
        };
    }

    static navigationOptions = ({screenProps}) => {
        return {
            headerTitle: (
                <AppText
                    fontText={'SF-Pro-Display-Medium'}
                    style={styles.headerTitle}
                    value={screenProps.intl.formatMessage({id: 'screenHeader.title.goldenMoment', defaultMessage: 'Golden Moment'})}
                />
            ),
        };
    };

    componentDidMount() {
        const {location} = this.props;
        const {day} = this.state;
        this.fetchRiseSet(day, location);
        if (!location.name) {
            this.requestLocationPermission();
        }
    }

    componentDidUpdate(prevProps) {
        const {user, location} = this.props;
        if (prevProps.user.settings !== user.settings && user.settings) {
            this.setState({
                remind: user.settings.remind,
            });
        }
        if (location && location !== prevProps.location) {
            const {day} = this.state;
            this.fetchRiseSet(day, location);
        }
    }

    requestLocationPermission = async () => {
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
            case RESULTS.BLOCKED: {
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
            case RESULTS.UNAVAILABLE: {
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
        LoadingHolder.start();
        Geolocation.getCurrentPosition(
            async (position) => {
                const currentLocation = await getPlaceByCoordinate(position.coords.latitude, position.coords.longitude);
                this.setState({
                    currentLocation,
                }, () => {
                    this.chooseExistsLocation(currentLocation);
                });
            },
            (error) => {
                LoadingHolder.stop();
                console.log('Error', JSON.stringify(error));
            },
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );
    };

    onNavigateToLocationSearch() {
        const {navigation, user} = this.props;
        navigation.navigate(
            'LocationSearch',
            {
                chooseExistsLocation: (location) => this.chooseExistsLocation(location),
                userId: user.id,
            }
        );
    }
    onNavigateToViewAll() {
        const {navigation, user} = this.props;

        const {location, remind, timezone} = this.state;
        navigation.navigate(
            'ViewAll',
            {
                location,
                remind,
                timezone,
                user,
                chooseExistsLocation: (l) => this.chooseExistsLocation(l),
                onToggleRemind: (t1, t2, v1, v2) => this.onToggleRemind(t1, t2, v1, v2),
            }
        );
    }
    onNavigateToCustom() {
        const {navigation} = this.props;
        const {remind} = this.state;
        navigation.navigate(
            'Custom',
            {
                remind,
                onToggleRemind: (t1, t2, v1, v2) => this.onToggleRemind(t1, t2, v1, v2),
            }
        );
    }

    async chooseExistsLocation(location) {
        const {actions} = this.props;
        const {day} = this.state;
        this.fetchRiseSet(day, location);
        actions.updateUserLocation(
            location,
        );
    }

    onToggleRemind(timeSunrise, timeSunset, isRemindSunrise, isRemindSunset) {
        const {actions} = this.props;
        actions.updateUser(
            timeSunrise,
            timeSunset,
            isRemindSunrise,
            isRemindSunset,
        );
    }

    changeTimezone(timezone) {
        this.setState({
            timezone,
        });
    }

    renderRiseSet(str) {
        const {screenProps} = this.props;
        const {location, sunrise, sunset} = this.state;

        return (
            str === 'sunrise' ?
                <RiseSet
                    isRiseSet={'Sunrise'}
                    sun={sunrise}
                    weather={sunrise.weather}
                    screenProps={screenProps}
                    location={location}
                    changeTimezone={(tz) => this.changeTimezone(tz)}
                /> :
                <RiseSet
                    isRiseSet={'Sunset'}
                    sun={sunset}
                    weather={sunset.weather}
                    screenProps={screenProps}
                    location={location}
                    changeTimezone={(tz) => this.changeTimezone(tz)}
                />
        );
    }

    fetchRiseSet(day, location) {
        if (!location) {
            LoadingHolder.stop();
            return null;
        }    
        const {lat, lng} = location;
        const tomorrow = new Date(day);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const di = SunCalc.getDayInfo(new Date(day), tomorrow, lat, lng);

        const {sunrise, sunset} = di;

        const nextMoment = sunrise.time > sunset.time ? sunset : sunrise;
        this.setState({
            sunrise,
            sunset,
            location,
            nextMoment,
            day: new Date(day).getTime()
        });
        LoadingHolder.stop();
    }

    onChangeDay(day) {
        const {location} = this.state;
        this.fetchRiseSet(day, location);
    }

    render() {
        const {remind, nextMoment, day, sunrise, sunset, timezone, isFetchLocationSuccess} = this.state;
        const date = moment(day).format('YYYY-MM-DD');
        const today = moment(new Date()).format('YYYY-MM-DD');
        const {screenProps, navigation, location} = this.props;
        const {name} = location;
        const {isRemindSunrise, isRemindSunset} = remind;
        const value = Boolean(isRemindSunrise || isRemindSunset);
        const rightIconColor = value ? '#FC7901' : 'rgba(36, 37, 61, 0.5)';

        return (
            <SafeAreaView style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <Header
                        screenProps={screenProps}
                        location={location}
                        colorRightHeader={rightIconColor}
                        onNavigateToCustom={() => this.onNavigateToCustom()}
                        onNavigateToLocationSearch={() => this.onNavigateToLocationSearch()}
                        nextMoment={nextMoment}
                        sunrise={sunrise}
                        sunset={sunset}
                        timezone={timezone}
                        isFetchLocationSuccess={isFetchLocationSuccess}
                    />
                    {
                        name &&
                        <React.Fragment>
                            <TouchableOpacity
                                style={styles.day}
                                onPress={() => navigation.navigate(
                                    'CalendarComponent',
                                    {
                                        onDayPress: (d) => this.onChangeDay(d),
                                        date,
                                    }
                                )}
                            >
                                <View style={{flexDirection: 'row'}}>
                                    {
                                        date === today &&
                                        <AppText
                                            fontText={'SF-Pro-Display-Medium'}
                                            style={{fontSize: 13}}
                                            value={screenProps.intl.formatMessage({id: 'today', defaultMessage: 'Today, '})}
                                        />

                                    }
                                    <FormattedDate
                                        value={day}
                                        year='numeric'
                                        month='short'
                                        day='2-digit'
                                        style={{fontSize: 13}}
                                        fontText={'SF-Pro-Display-Medium'}
                                    />
                                </View>

                                <AppIcon
                                    name={'calendar'}
                                    size={18}
                                />
                            </TouchableOpacity>
                            {this.renderRiseSet('sunrise')}
                            {this.renderRiseSet('sunset')}
                            <TouchableOpacity
                                style={styles.viewAll}
                                onPress={() => this.onNavigateToViewAll()}
                            >
                                <AppText
                                    fontText={'SF-Pro-Display-Light'}
                                    style={{fontSize: 13, color: '#FC5201'}}
                                    value={screenProps.intl.formatMessage({id: 'view_all', defaultMessage: 'VIEW ALL'})}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.weatherInfo}
                                onPress={() => {
                                    Linking.openURL('https://darksky.net/poweredby/');
                                }}
                            >
                                <AppText
                                    fontText={'SF-Pro-Display-Light'}
                                    style={styles.powered}
                                    value={screenProps.intl.formatMessage({id: 'weather_info', defaultMessage: 'Weather info Powered by Dark Sky'})}
                                />
                            </TouchableOpacity>
                        </React.Fragment>
                    }
                </ScrollView>
            </SafeAreaView>
        );
    }
}

GoldenMoment.propTypes = {
    actions: PropTypes.object,
    isfetchLocationSuccess: PropTypes.bool,
    location: PropTypes.object,
    navigation: PropTypes.object,
    screenProps: PropTypes.object,
    user: PropTypes.object,
};

export default GoldenMoment;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    headerTitle: {
        marginLeft: Platform.OS === 'android' ? 16 : 0,
        fontSize: 17,
    },
    day: {
        marginTop: 20,
        margin: 10,
        paddingHorizontal: 10,
        paddingTop: 13,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 5,
        backgroundColor: '#FFF',
        borderRadius: 8,
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 2,
    },
    viewAll: {
        margin: 10,
        marginBottom: 5,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        borderRadius: 8,
        elevation: 5,
        backgroundColor: '#FFF',
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 2,
    },
    powered: {
        fontSize: 10,
        color: 'rgba(0, 0, 0, 0.34)',
        marginRight: 10,
    },
    weatherInfo: {
        flexDirection: 'row-reverse',
        marginBottom: 10,
        padding: 10,
    },
});

