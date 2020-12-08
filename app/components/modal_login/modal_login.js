/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {Text, TouchableOpacity, View, Alert, StyleSheet, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import {firebase} from '@react-native-firebase/auth';
import {AccessToken, LoginManager} from 'react-native-fbsdk';
import crashlytics from '@react-native-firebase/crashlytics';
import Modal from 'react-native-modal';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';

import LoadingHolder from 'app/utils/loading_holder';
import {changeOpacity} from 'app/utils/theme';
import AppText from 'app/components/app_text';
import Icon from 'app/components/icon';
import Device from 'app/utils/device';

GoogleSignin.configure();

class ModalLogin extends React.PureComponent<Props> {
    static propTypes = {}
    static defaultProps = {}

    onLoginWithGG = async () => {
        this.props.setModalVisible(false);
        try {
            await GoogleSignin.hasPlayServices();
            await GoogleSignin.signIn();

            const {accessToken, idToken} = await GoogleSignin.getTokens();

            const credential = firebase.auth.GoogleAuthProvider.credential(
                idToken,
                accessToken
            );

            // this.props.actions.createUser(user.name, user.photo, user.email);
            this.handleLoginFirebase(credential);
        } catch (error) {
            // this.loading.stop();

            // console.log('error', error);

            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (f.e. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                // Alert.alert(
                //     this.props.intl.formatMessage({id: 'error', defaultMessage: 'Error'}),
                //     this.props.intl.formatMessage({id: 'common.error', defaultMessage: 'Something wrong, Please try again.'}),
                //     [
                //         {
                //             text: this.props.intl.formatMessage({id: 'button.ok', defaultMessage: 'Ok'}),
                //         },
                //     ]
                // );
            }
        }
    };

    onFacebookLoginError = (error) => {
        // console.log('error', error);
        LoadingHolder.stop();
    };

    onFacebookLoginSuccess = (result) => {
        if (result.isCancelled) {
            // console.log('result', result);
        } else {
            AccessToken.getCurrentAccessToken().then((data) => {
                const credential = firebase.auth.FacebookAuthProvider.credential(
                    data.accessToken
                );
                this.handleLoginFirebase(credential);
            });
        }
    };

    onLoginWithFB = () => {
        this.props.setModalVisible(false);
        AccessToken.getCurrentAccessToken().
            then((data) => {
                const credential = firebase.auth.FacebookAuthProvider.credential(
                    data.accessToken
                );
                this.handleLoginFirebase(credential);
            }).
            catch(() => {
                LoginManager.logInWithPermissions(['public_profile', 'email']).
                    then(this.onFacebookLoginSuccess).
                    catch(this.onFacebookLoginError);
            });
    };

    handleCreateUser = async (userCredential) => {
        const {data, error} = await this.props.actions.createUser(userCredential);
        if (data) {
            this.handleLoginSuccess(data.info);
        }
        if (error) {
            LoadingHolder.stop();
            Alert.alert(
                this.props.intl.formatMessage({id: 'error', defaultMessage: 'Error'}),

                // JSON.stringify(error),
                this.props.intl.formatMessage({id: 'common.error', defaultMessage: 'Something wrong, Please try again.'}),

                [
                    {
                        text: this.props.intl.formatMessage({id: 'button.ok', defaultMessage: 'Ok'}),
                    },
                ]
            );
        }
    }
    handleLoginFirebase = async (credential) => {
        LoadingHolder.start();

        firebase.auth().currentUser.linkWithCredential(credential).then(async (userCredential) => {
            // console.log('Account linking success', userCredential);
            this.handleCreateUser(userCredential);

            // if (userCredential.additionalUserInfo.isNewUser) {
            //     this.handleCreateUser(userCredential);
            // } else {
            //     const {data, error} = await this.props.actions.fetchUser(userCredential.user.uid);
            //     if (data) {
            //         this.handleLoginSuccess(data.info);
            //     }
            //     if (error) {
            //         // handle when user document empty
            //         this.handleCreateUser(userCredential);
            //     }
            // }
        }, (error) => {
            LoadingHolder.stop();

            // console.log(error.code);
            if (error && error.message) {
                Alert.alert(
                    'Error',
                    error.message,
                );
            }
        });
    };

    handleLoginSuccess = async (user) => {
        const promise = [
            this.props.actions.updateFcmToken(),
            crashlytics().setUserId(user.id),
        ];
        if (user.email) {
            promise.push(crashlytics().setUserEmail(user.email));
        }

        await Promise.all(promise);

        LoadingHolder.stop();

        this.props.setModalVisible(false);
    }

    render() {
        const {modalVisible, intl, navigation} = this.props;

        return (
            <Modal
                isVisible={modalVisible}
                onBackdropPress={() => this.props.setModalVisible(false)}
                swipeDirection={['down']}
                style={{margin: 0, justifyContent: 'flex-end'}}
            >
                <View style={styles.container}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        <AppText
                            value={intl.formatMessage({id: 'create_your_account', defaultMessage: 'CREATE YOUR ACCOUNT'})}
                            style={styles.title}
                        />
                        <AppText
                            value={intl.formatMessage({id: 'text_modal_login_1', defaultMessage: 'Creating your own account will allow us to backup your precious moments.'})}
                            style={styles.text}
                        />
                        <AppText
                            value={intl.formatMessage({id: 'text_modal_login_2', defaultMessage: "So none of them ever go lost-event if you choose to switch phones in the future. Moreover, your journal can be safer and more secure. That's why we require you to create an account."})}
                            style={styles.text}
                        />
                        <TouchableOpacity
                            onPress={this.onLoginWithFB}
                            style={[styles.btnContainer, {
                                backgroundColor: '#3A559F',
                            }]}
                        >
                            <Icon
                                type='AntDesign'
                                name='facebook-square'
                                size={20}
                                color='#FFF'
                            />
                            <Text style={styles.txtBtnLogin}>{'Facebook'}</Text>
                        </TouchableOpacity>
                        <View style={{width: 40}}/>
                        <TouchableOpacity
                            onPress={this.onLoginWithGG}
                            style={[styles.btnContainer, {
                                backgroundColor: '#EA4335',
                            }]}
                        >
                            <Icon
                                type='AntDesign'
                                name='google'
                                size={20}
                                color='#FFF'
                            />
                            <Text style={styles.txtBtnLogin}>{'Google'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.skip}
                            onPress={() => this.props.setModalVisible(false)}
                        >
                            <AppText
                                value={intl.formatMessage({id: 'skip', defaultMessage: 'Skip'})}
                                style={{fontSize: 15, color: '#FFF'}}
                            />
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </Modal>
        );
    }
}
export default ModalLogin;

const styles = StyleSheet.create({
    container: {
        bottom: 0,
        backgroundColor: '#24253D',
        alignItems: 'center',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
    },
    title: {
        fontSize: 17,
        color: '#FFF',
        marginTop: 20,
        marginBottom: 20,
        textAlign: 'center',
    },
    text: {
        fontSize: 17,
        color: '#FFF',
        textAlign: 'center',
        lineHeight: 30,
        marginBottom: 20,
        paddingHorizontal: 32,
    },
    btnContainer: {
        marginHorizontal: 16,
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        marginBottom: 15,
        shadowColor: changeOpacity('#000', 0.1),
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 2,
        shadowRadius: 3,
        elevation: 3,
    },
    txtBtnLogin: {
        fontSize: 14,
        color: '#FFF',
        paddingLeft: 10,
    },

    textDesc: {
        lineHeight: (40),
        marginBottom: (34),
        fontSize: (18),
        fontWeight: '100',
        marginLeft: (30),
        paddingRight: (16),
    },

    logoContainer: {
        marginBottom: (20),
        marginLeft: (30),
    },
    skip: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
});

