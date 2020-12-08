/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    Platform,
    Linking,
    Alert,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import LogoutButton from 'app/components/logout_button';
import AppText from '../app_text';
import Avatar from 'app/components/avatar';
import RatingRequestor from 'app/components/app_store_review';
import Share from 'react-native-share';
import Config from 'react-native-config';
import Device from 'app/utils/device';
import {LinkCommunityVN, LinkCommunity} from 'assets/config.json';

const linkCommunity = Device.country === 'VN' ? LinkCommunityVN : LinkCommunity;

const config = {
    appStoreId: Config.APPSTORE_ID,
    storeAppName: 'riseset-journal',
    storeCountry: Device.country,
};
class Content extends React.PureComponent {
    state = {
        isVisible: false,
    }
    handleStoreReviewDisplay = async () => {
        const {intl} = this.props.screenProps;
        const RatingTracker = new RatingRequestor(intl, {
            timingFunction: () => {
                return true;
            },
            handleRate: true,
        });
        await RatingTracker.handlePositiveEvent();
    }
    onPressShare = () => {
        const path = Platform.select({
            ios: `https://itunes.apple.com/${config.storeCountry}/app/${config.storeAppName}/id${config.appStoreId}`,
            android: 'https://play.google.com/store/apps/details?id=com.risesetjournal',
        });

        const shareOptions = {
            title: this.props.screenProps.intl.formatMessage({id: 'share_title', defaultMessage: 'Select an application to share'}),
            url: path,
        };
        Share.open(shareOptions).
            then((res) => {
            }).
            catch((err) => {
                console.log(err);
            });
    }

    handleFollowApp = () => {
        const {intl} = this.props.screenProps;
        Alert.alert(
            intl.formatMessage({id: 'follow_us_on_instagram', defaultMessage: 'Follow us on Instagram'}),
            intl.formatMessage({id: 'are_you_sure_open_instagram?', defaultMessage: 'Are you sure you want to open Instagram app or browser?'}),
            [
                {
                    text: intl.formatMessage({id: 'button.cancel', defaultMessage: 'Cancel'}),
                },
                {
                    text: intl.formatMessage({id: 'button.ok', defaultMessage: 'Ok'}),
                    onPress: () => this.linkingTo('https://www.instagram.com/risesetjournalapp'),
                },
            ]
        );
    }

    linkingTo = (url) => {
        const {intl} = this.props.screenProps;

        Linking.canOpenURL(url).
            then((supported) => {
                if (supported) {
                    return Linking.openURL(url);
                }
                Alert.alert(
                    'RiseSet Journal',
                    intl.formatMessage({
                        id: 'linking.cannot_open_link',
                        defaultMessage: 'Sorry, cannot open link!',
                    }),
                    [
                        {
                            text: intl.formatMessage({id: 'button.ok', defaultMessage: 'Ok'}),
                        },
                    ]
                );
                return false;
            }).
            catch((err) => {
                console.log('An error occurred', err);
                Alert.alert(
                    'RiseSet Journal',
                    intl.formatMessage({
                        id: 'linking.cannot_open_link',
                        defaultMessage: 'Sorry, cannot open Link!',
                    }),
                    [
                        {
                            text: intl.formatMessage({id: 'button.ok', defaultMessage: 'Ok'}),
                        },
                    ]
                );
            });
    }

    handleJoinCommunity = () => {
        this.setState({
            isVisible: true,
        });
    }

    renderItem = (id, message, style, onPress) => {
        const {screenProps} = this.props;
        return (
            <TouchableOpacity
                onPress={() => onPress()}
                style={style}
            >
                <AppText
                    fontText={'SF-Pro-Display-Regular'}
                    style={styles.text}
                    value={screenProps.intl.formatMessage({id, defaultMessage: message})}
                />
            </TouchableOpacity>
        );
    }
    renderList() {
        const {navigation} = this.props;
        return (
            <View style={styles.list}>
                {
                    this.renderItem(
                        'edit_profile',
                        'Edit profile',
                        styles.borderBottom,
                        () => navigation.navigate('EditProfile')
                    )
                }
                {
                    this.renderItem(
                        'screenHeader.title.photographyTips',
                        'Photography tips',
                        {},
                        () => navigation.navigate('PhotographyTips')
                    )
                }
                {
                    this.renderItem(
                        'follow_us_on_instagram',
                        'Follow us on Instagram',
                        {},
                        () => this.handleFollowApp()
                    )
                }
                {
                    this.renderItem(
                        'join_the_community',
                        'Join the Community',
                        {},
                        () => this.handleJoinCommunity()
                    )
                }
                {
                    this.renderItem(
                        'share_this_app',
                        'Share this App',
                        {},
                        () => this.onPressShare()
                    )
                }
                {
                    this.renderItem(
                        'rating_and_feedback',
                        'Rate Us',
                        styles.borderBottom,
                        () => this.handleStoreReviewDisplay()
                    )
                }
                {
                    this.renderItem(
                        'privacy_policy',
                        'Privacy Policy',
                        {},
                        () => navigation.navigate('PrivacyPolicy')
                    )
                }
                {
                    this.renderItem(
                        'terms_of_service',
                        'Terms of service',
                        {},
                        () => navigation.navigate('TermsOfService')
                    )
                }
            </View>
        );
    }
    render() {
        const {user, screenProps} = this.props;
        const {isVisible} = this.state;
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.ava}>
                        <Avatar
                            ava={user.picture}
                            name={user.name}
                            styleUsername={{marginTop: -20}}
                        />
                    </View>
                    <View style={styles.body}>
                        {this.renderList()}
                        <LogoutButton/>
                    </View>
                </ScrollView>
                <Modal
                    isVisible={isVisible}
                    onBackdropPress={() => this.setState({isVisible: false})}
                    style={{justifyContent: 'center', alignItems: 'center'}}
                >
                    <View style={styles.modal}>
                        <AppText
                            fontText={'SF-Pro-Display-Medium'}
                            style={{fontSize: 22, marginTop: 40}}
                            value={screenProps.intl.formatMessage({id: 'join_the_community_2', defaultMessage: 'JOIN THE COMMUNITY'})}
                        />
                        <AppText
                            fontText={'SF-Pro-Display-Light'}
                            style={{fontSize: 20, textAlign: 'center', marginTop: 30}}
                            value={screenProps.intl.formatMessage({id: 'join_the_community_body_1', defaultMessage: ''})}
                        />
                        <AppText
                            fontText={'SF-Pro-Display-Light'}
                            style={{fontSize: 20, textAlign: 'center', marginTop: 25}}
                            value={screenProps.intl.formatMessage({id: 'join_the_community_body_2', defaultMessage: ''})}
                        />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                this.linkingTo(linkCommunity);
                                this.setState({
                                    isVisible: false,
                                });
                            }}
                        >
                            <AppText
                                fontText={'SF-Pro-Display-Light'}
                                style={styles.textButton}
                                value={screenProps.intl.formatMessage({id: 'join_the_community_button', defaultMessage: "LET'S DO IT!"})}
                            />
                        </TouchableOpacity>
                    </View>
                </Modal>
            </SafeAreaView>
        );
    }
}

Content.propTypes = {
    navigation: PropTypes.object,
    user: PropTypes.object,
    screenProps: PropTypes.object,
};

export default Content;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    ava: {
        marginTop: 35,
    },
    username: {
        fontSize: 17,
        marginTop: 15,
    },
    body: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    list: {
        marginTop: 20,
    },
    text: {
        fontSize: 17,
        marginVertical: 15,
        paddingLeft: 25,
        paddingRight: 10,
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: '#F1F1F1',
    },
    modal: {
        width: Device.screen.width - 60,
        paddingHorizontal: 20,
        backgroundColor: '#FFF',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        marginTop: 40,
        paddingBottom: 30,
        width: Device.screen.width - 60,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        backgroundColor: '#FF9500',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textButton: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 25,
        color: '#FFF',
        fontWeight: '500',
    },
});
