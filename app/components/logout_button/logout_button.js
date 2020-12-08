/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {StyleSheet, TouchableOpacity, Alert} from 'react-native';

import {StackActions, NavigationActions, withNavigation} from 'react-navigation';
import {injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import {firebase} from '@react-native-firebase/auth';
import {LoginManager} from 'react-native-fbsdk';
import {GoogleSignin} from '@react-native-community/google-signin';

import AppText from 'app/components/app_text';

// import FormattedText from 'app/components/formatted_text';
import NavigationService from 'app/navigation/NavigationService';

// import Loading from 'app/components/loading';

class LogoutButton extends React.PureComponent {
    static propTypes = {
        actions: PropTypes.object,
        intl: PropTypes.object,
        providerId: PropTypes.string,
        navigation: PropTypes.object,
    };

    unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            // Signed in
        } else {
            // Signed out
            await firebase.auth().signOut();
        }
    });

    onLogout = () => {
        Alert.alert(
            this.props.intl.formatMessage({id: 'logout', defaultMessage: 'Logout'}),
            this.props.intl.formatMessage({id: 'are_you_sure_logout?', defaultMessage: 'Are you sure you want to logout?'}),
            [
                {
                    text: this.props.intl.formatMessage({id: 'button.cancel', defaultMessage: 'Cancel'}),
                },
                {
                    text: this.props.intl.formatMessage({id: 'button.ok', defaultMessage: 'Ok'}),
                    onPress: () => this.handleLogout(),
                },
            ]
        );
    }

    resetData = () => {
        this.unsubscribe();

        // this.loading.stop();
        NavigationService.navigate('AppTab');
        NavigationService.navigate('Login');

        // remove data in redux
        this.props.actions.logout();
    }

    handleLogout = async () => {
        // this.loading.start();
        const {providerId} = this.props;

        // remove accessToken 3rd lib
        if (providerId === 'facebook.com') {
            LoginManager.logOut();
            // this.resetData();
        } else if (providerId === 'google.com') {
            try {
                await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
                // this.resetData();
            } catch (error) {
                // console.log('error', error);
                // this.loading.stop();
            }
        }
        this.resetData();
    };

    render() {
        return (
            <React.Fragment>
                <TouchableOpacity
                    onPress={() => this.onLogout()}
                    style={styles.container}
                >
                    <AppText
                        style={{
                            color: '#FC7901',
                            fontSize: 17,
                        }}
                        fontText='SF-Pro-Display-Light'
                        value={this.props.intl.formatMessage({id: 'logout', defaultMessage: 'Logout'})}
                    />
                </TouchableOpacity>
                {/* <Loading
                    refs={(ref) => {
                        this.loading = ref;
                    }}
                /> */}
            </React.Fragment>
        );
    }
}

export default injectIntl(withNavigation(LogoutButton));

const styles = StyleSheet.create({
    container: {
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#F1F1F1',
    },
});
