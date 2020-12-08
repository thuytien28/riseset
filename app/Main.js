/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {Platform} from 'react-native';
import {injectIntl} from 'react-intl';
import {PersistGate} from 'redux-persist/integration/react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Orientation from 'react-native-orientation-locker';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import {requestNotifications, RESULTS} from 'react-native-permissions';

import AppNavigator from 'app/navigation';
import NavigationService from 'app/navigation/NavigationService';
import Loading from 'app/components/loading';
import {persistor} from 'app/store';
import {handleIgnoreAction} from 'app/utils/navigation';

import {storageFcmToken} from 'app/actions/fcm_token';
import {fetchQuoteByPressNoti} from 'app/actions/quote';
import NotifService from 'app/NotifService';

// import {requestNotifications} from 'react-native-permissions';
import LoadingHolder from 'app/utils/loading_holder';
import Uploading from 'app/components/uploading';
import UploadingHolder from 'app/utils/uploading_holder';
import DropdownAlert from 'react-native-dropdownalert';
import DropdownAlertHolder from 'app/utils/dropdown_alert_holder';
import Device from 'app/utils/device';

class Main extends React.PureComponent<Props> {
    constructor(props) {
        super(props);
        this.sendReport();
    }

    async componentDidMount() {
        this.requestNotificationPermission();
        Orientation.lockToPortrait();
    }
    sendReport() {
        crashlytics().recordError(new Error('Error with a stack trace'));
    }

    requestNotificationPermission = async () => {
        try {
            if (Device.os === 'android') {
                await messaging().registerForRemoteNotifications();
                const fcmToken = await messaging().getToken();

                // console.log('fcmToken', fcmToken);
                if (fcmToken) {
                    this.props.actions.storageFcmToken(fcmToken);
                }
            } else {
                const isIOSSimulator = await DeviceInfo.isEmulator();
                if (!isIOSSimulator) {
                    const {status} = await requestNotifications(['alert', 'sound']);
                    if (status === RESULTS.GRANTED) {
                        await messaging().registerForRemoteNotifications();
                        const fcmToken = await messaging().getToken();

                        // console.log('fcmToken', fcmToken);
                        if (fcmToken) {
                            this.props.actions.storageFcmToken(fcmToken);
                        }
                    }
                }
            }
            this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
        } catch (error) {
            console.log('error', error);
        }
    }

    onRegister(token) {
        // console.log(token);
    }

    onNotif(notif) {
        //  console.log('Notif: ', notif);
        const dataNotif = Platform.OS === 'ios' ? notif.data : notif;
        // console.log(dataNotif);

        // Process the data received from server: convert string to number
        const data = {};
        data.quoteNumber = parseInt(dataNotif.randNumString, 10);
        data.content = dataNotif.message;
        data.author = dataNotif.quoteAuthor;
        const timePushedNoti = parseInt(dataNotif.timePushedNotiString, 10);

        this.props.actions.fetchQuoteByPressNoti(data, timePushedNoti);
    }

    getActiveRouteName = (navigationState) => {
        if (!navigationState) {
            return null;
        }
        const route = navigationState.routes[navigationState.index];

        // dive into nested navigators
        if (route.routes) {
            return this.getActiveRouteName(route);
        }
        return route.routeName;
    }

    onNavigationStateChange = async (prevState, currentState, action) => {
        const currentScreen = this.getActiveRouteName(currentState);
        const prevScreen = this.getActiveRouteName(prevState);

        handleIgnoreAction(this.props.dispatch, action);

        if (prevScreen !== currentScreen) {
            await analytics().setCurrentScreen(currentScreen);
        }
    }

    render() {
        const {intl} = this.props;
        return (
            <PersistGate

                // loading={<Loading/>}
                persistor={persistor}
            >
                <AppNavigator
                    screenProps={{intl}}
                    ref={(navigatorRef) => {
                        NavigationService.setTopLevelNavigator(
                            navigatorRef
                        );
                    }}

                    onNavigationStateChange={this.onNavigationStateChange}
                />
                <Loading
                    refs={(ref) => {
                        LoadingHolder.setLoading(ref);
                    }}
                />
                <Uploading
                    refs={(ref) => {
                        UploadingHolder.setUploading(ref);
                    }}
                />
                <DropdownAlert
                    ref={(ref) => {
                        DropdownAlertHolder.setDropdownAlert(ref);
                    }}
                />
            </PersistGate>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(
            {
                storageFcmToken,
                fetchQuoteByPressNoti,
            },
            dispatch
        ),
        dispatch,
    };
};

export default connect(null, mapDispatchToProps)(injectIntl(Main));
