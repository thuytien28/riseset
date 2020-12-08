/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

/* eslint-disable multiline-ternary */

import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    SafeAreaView,
    Platform,
    Alert,
} from 'react-native';

import DateTimePicker from 'react-native-modal-datetime-picker';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import {Appearance} from 'react-native-appearance';
import {request, PERMISSIONS, RESULTS, check, openSettings} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import DropdownAlertHolder from 'app/utils/dropdown_alert_holder';

import AppText from 'app/components/app_text';
import AppIcon from 'assets/icons/AppIcon';
import FormattedDate from 'app/components/formatted_date';
import FormattedTime from 'app/components/formatted_time';
import Device from 'app/utils/device';
import HeaderRight from 'app/components/common/header_right';

import {getPlaceByCoordinate} from 'app/utils/fetch_google_api';
import {latinise} from 'app/utils/latinise';

const DEFAULT_SIGNATURE_FONT = 'SFProDisplay-Regular';
class FiltersPhoto extends React.PureComponent {
    static navigationOptions = ({screenProps, navigation}) => {
        const {intl} = screenProps;
        const {params} = navigation.state;

        // const title = intl.formatMessage({id: 'filterPhoto.timePlace', defaultMessage: 'Time/Place'});
        const headerTitle = (
            <AppText
                fontText={'SF-Pro-Display-Medium'}
                style={{fontSize: 17, fontWeight: '500'}}
                value={intl.formatMessage({id: 'filterPhoto.timePlace', defaultMessage: 'Time/Place'})}
            />
        );
        const headerRight = (
            <HeaderRight
                id='next'
                defaultMessage='Next'
                onPress={params && params.onGoWriteNote}
            />

        );
        return {

            // title,
            headerTitle,
            headerRight,
        };
    }
    constructor(props) {
        super(props);

        const {params} = props.navigation.state;
        const time = params ? new Date(params.timeTaken) : new Date().getTime();
        let isRiseSet = 'sunrise';

        if (time.getHours() >= 12) {
            isRiseSet = 'sunset';
        }
        let signature = '';
        if (props.user.name) {
            signature = latinise(props.user.name);
        }
        let signatureFont = DEFAULT_SIGNATURE_FONT;

        if (Object.values(props.userSignature).length > 0) {
            signature = props.userSignature.signature;
            signatureFont = props.userSignature.font;
        }

        this.state = {
            location: null,
            isRiseSet,
            time,
            isDateTimePickerVisible: false,
            signature,
            signatureFont,
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({
            onGoWriteNote: this.onGoWriteNote,
        });
        this.determineLocation();
    }

    determineLocation = async () => {
        const {params} = this.props.navigation.state;
        if (params && params.coordinate) {
            try {
                const currentLocation = await getPlaceByCoordinate(params.coordinate.lat, params.coordinate.lng);
                this.setState({
                    currentLocation,
                }, () => {
                    this.chooseExistsLocation(currentLocation);
                });
            } catch (error) {
                // handle error
                // console.log("error", error);
            }
        } else {
            this.requestLocationPermission();
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
        Geolocation.getCurrentPosition(
            async (position) => {
                const currentLocation = await getPlaceByCoordinate(position.coords.latitude, position.coords.longitude);
                this.setState({
                    currentLocation,
                }, () => {
                    this.chooseExistsLocation(currentLocation);
                });
            },
            (error) => console.log('Error', JSON.stringify(error)),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );
    };

    showDateTimePicker = () => {
        this.setState({isDateTimePickerVisible: true});
    }

    hideDateTimePicker = () => {
        this.setState({isDateTimePickerVisible: false});
    }

    handleDatePicked = (date) => {
        let isRiseSet = 'sunrise';
        if (date.getHours() >= 12) {
            isRiseSet = 'sunset';
        }
        this.setState({
            time: date,
            isDateTimePickerVisible: false,
            isRiseSet,
        });
    }

    chooseExistsLocation = (location) => {
        // console.warn(location);
        this.setState({
            location,
        });
    };

    onGoWriteNote = () => {
        const {navigation, screenProps} = this.props;
        const {imageTaken, effectName} = navigation.state.params;
        const {time, signature, signatureFont, isRiseSet, location} = this.state;
        const isNewNote = true;

        if (location) {
            const params = {
                isRiseSet,
                time: time.getTime(),
                imageTaken,
                signature,
                location,
                isNewNote,
                signatureFont,
            };
            if (effectName) {
                params.effectName = effectName;
            }
            navigation.navigate('YourStory', params);
        } else {
            DropdownAlertHolder.start('error', screenProps.intl.formatMessage({id: 'locationRequired', defaultMessage: 'Location is required'}));

        }
    }
    chooseSignature = (text, font) => {
        this.setState({
            signature: text,
            signatureFont: font,
        });
    }

    renderTime = () => {
        const {time} = this.state;
        const {intl} = this.props.screenProps;
        return (
            <View style={styles.timeView}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{marginRight: 10}}>
                        <AppIcon
                            name='clock'
                            size={(17)}
                            color={'red'}
                        />
                    </View>
                    <AppText
                        numberOfLines={1}
                        adjustsFontSizeToFit={true}
                    >
                        <FormattedTime
                            value={time}
                            hour={'2-digit'}
                            hour12={true}
                        />
                        <AppText>{', '}</AppText>
                        <FormattedDate
                            value={time}
                            year='numeric'
                            month='short'
                            day='2-digit'
                        />

                    </AppText>
                </View>
                <TouchableOpacity
                    style={styles.info}
                    onPress={() => this.showDateTimePicker()}
                >
                    <AppText
                        fontText={'SF-Pro-Display'}
                        value={intl.formatMessage({id: 'edit', defaultMessage: 'Edit'})}
                    />
                </TouchableOpacity>
            </View>
        );
    }

    renderLocation = () => {
        const {location} = this.state;
        const {navigation, screenProps, user} = this.props;
        const {intl} = screenProps;
        return (
            <View style={[styles.locationView, {marginBottom: (32)}]}>
                <View style={styles.location}>
                    <View style={{paddingRight: 10}}>
                        <AppIcon
                            name='place'
                            size={(17)}
                            color={'red'}
                        />
                    </View>

                    <View style={{paddingRight: 10}}>
                        <AppText
                            numberOfLines={1}
                            adjustsFontSizeToFit={true}
                            value={location ? location.name : ''}
                        />
                    </View>

                </View>
                <TouchableOpacity
                    style={[styles.info]}
                    onPress={() => {
                        navigation.push('LocationSearch', {
                            chooseExistsLocation: this.chooseExistsLocation,
                            userId: user.id,
                        });
                    }}
                >
                    <AppText
                        fontText={'SF-Pro-Display'}
                        value={intl.formatMessage({id: 'edit', defaultMessage: 'Edit'})}
                    />
                </TouchableOpacity>
            </View>
        );
    }

    renderSignature = () => {
        const {signature, signatureFont} = this.state;
        const {screenProps, navigation} = this.props;
        const {intl} = screenProps;

        const signatureStyle = {
            marginLeft: 5,
        };
        if (signatureFont) {
            signatureStyle.fontFamily = signatureFont;
        }
        return (
            <View style={styles.signatureCtn}>
                <View style={{flex: 1}}>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode={'tail'}
                    >
                        <AppText
                            style={styles.locationText}
                            value={intl.formatMessage({id: 'header.title.Signature', defaultMessage: 'Signature'}) + ':'}
                        />
                        <Text>{'  '}</Text>
                        <AppText
                            style={signatureStyle}
                            value={signature}
                            isSignature={true}
                        />
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.info}
                    onPress={() => {
                        navigation.navigate('CreateSignature', {
                            chooseSignature: this.chooseSignature,
                            signature: this.state.signature,
                            signatureFont: this.state.signatureFont,
                        });
                    }}
                >
                    <AppText
                        fontText={'SF-Pro-Display'}
                        value={intl.formatMessage({id: 'edit', defaultMessage: 'Edit'})}
                    />

                </TouchableOpacity>
            </View>
        );
    }

    renderImage = () => {
        const {navigation} = this.props;
        const {imageTaken} = navigation.state.params;

        return (
            <View
                style={styles.imageView}
                onPress={this.onEditImage}
            >
                <FastImage
                    source={{uri: imageTaken[0]}}
                    style={styles.image}
                    resizeMode='contain'
                    onLayout={this.onLayoutImage}
                />
            </View>
        );
    }

    onSunrise = () => {
        if (this.state.isRiseSet !== 'sunrise') {
            this.setState({isRiseSet: 'sunrise'});
        }
    }

    onSunset = () => {
        if (this.state.isRiseSet !== 'sunset') {
            this.setState({isRiseSet: 'sunset'});
        }
    }

    renderCheckBoxType = () => {
        const {intl} = this.props.screenProps;
        const {isRiseSet} = this.state;
        const SUNRISE = (
            <TouchableOpacity
                style={styles.checkBoxCtn}
                onPress={this.onSunrise}
            >
                <View
                    style={[styles.outCircle,
                        {
                            borderColor: isRiseSet === 'sunrise' ? '#e53d01' : '#efefef',
                        },
                    ]}
                >
                    <View
                        style={[styles.inCircle, {
                            backgroundColor: isRiseSet === 'sunrise' ? '#e53d01' : 'rgba(0,0,0,0)',

                        }]}
                    />
                </View>
                <AppText
                    style={styles.risetText}
                    value={intl.formatMessage({id: 'Sunrise', defaultMessage: 'sunrise'})}
                />

            </TouchableOpacity>
        );
        const SUNSET = (
            <TouchableOpacity
                style={styles.checkBoxCtn}
                onPress={this.onSunset}
            >
                <View
                    style={[styles.outCircle,
                        {
                            borderColor: isRiseSet === 'sunset' ? '#e53d01' : '#efefef',
                        },
                    ]}
                >
                    <View
                        style={[styles.inCircle, {
                            backgroundColor: isRiseSet === 'sunset' ? '#e53d01' : 'rgba(0,0,0,0)',

                        }]}
                    />
                </View>
                <AppText
                    style={styles.risetText}
                    value={intl.formatMessage({id: 'Sunset', defaultMessage: 'sunset'})}
                />

            </TouchableOpacity>
        );

        return (
            <View style={styles.isRiseSet}>
                {SUNRISE}
                <View style={{width: 30}}/>
                {SUNSET}
            </View>
        );
    }

    render() {
        const {time} = this.state;
        const {intl} = this.props.screenProps;
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.body}>
                    {this.renderImage()}
                    {this.renderCheckBoxType()}
                    {this.renderTime()}
                    {this.renderLocation()}
                    {this.renderSignature()}

                </View>
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked.bind(this)}
                    onCancel={this.hideDateTimePicker}
                    display={'spinner'}
                    headerTextIOS={intl.formatMessage({id: 'selectDateTime', defaultMessage: 'Select date time'})}
                    date={new Date(time)}
                    confirmTextIOS={intl.formatMessage({id: 'button.ok', defaultMessage: 'OK'})}
                    cancelTextIOS={intl.formatMessage({id: 'button.cancel', defaultMessage: 'Cancel'})}
                    mode='datetime'
                    minuteInterval={5}
                    is24Hour={false}
                    isDarkModeEnabled={Appearance.getColorScheme() === 'dark'}
                    locale={Device.locale}
                    maximumDate={new Date()}
                />
                {/* <DropdownAlert
                    ref={(ref) => {
                        this.dropDownAlertRef = ref;
                    }}
                /> */}
            </SafeAreaView>
        );
    }
}

FiltersPhoto.propTypes = {
    navigation: PropTypes.object,
    user: PropTypes.object,
    screenProps: PropTypes.object,
    userSignature: PropTypes.object,
};

export default FiltersPhoto;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    body: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 10,
    },

    imageView: {
        width: Device.screen.width - 32,
        alignSelf: 'center',
        flex: 1,
    },

    image: {
        width: null,
        height: null,
        flex: 1,
        marginBottom: 20,
    },

    isRiseSet: {
        height: (24),
        justifyContent: 'center',
        flexDirection: 'row',
    },

    outCircle: {
        width: (15),
        height: (15),
        borderRadius: (8.5),
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    inCircle: {
        backgroundColor: '#e53d01',
        width: 10,
        height: 10,
        borderRadius: (5.5),
    },

    timeView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginVertical: (32),
    },
    locationView: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    signatureCtn: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 5,
    },

    location: {
        flexDirection: 'row',
        flex: 1,
        marginRight: 20,
    },

    chooseLocationText: {
        width: 250,
    },

    info: {
        alignItems: 'center',
        justifyContent: 'center',
        width: (54),
        height: (26),
        backgroundColor: '#F1F1F1',
        borderRadius: (60),
    },

    checkBoxCtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    risetText: {
        marginLeft: 5,
    },
});
