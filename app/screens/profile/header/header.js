/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Alert,
} from 'react-native';

import PropTypes from 'prop-types';

import Avatar from 'app/components/avatar';
import AppText from 'app/components/app_text';
import Device from 'app/utils/device';
import {loadBannerAd} from 'app/firebase/admob';
import BannerFbAds from 'app/firebase/facebookads/bannerView';



class Header extends React.PureComponent {
    static propTypes = {
        userPicture: PropTypes.string,
        count: PropTypes.object,
        intl: PropTypes.object,
        username: PropTypes.string,
        navigation: PropTypes.object,
        user: PropTypes.object,
        actions: PropTypes.object,
    };

    componentDidMount() {
        const {actions, user} = this.props;
        actions.countStoriesAndImagesByUser(user.id);
    }
    renderItem = (str, value = 0, color) => {
        const {intl} = this.props;
        return (
            <View style={styles.statistics}>
                <AppText
                    fontText={'SF-Pro-Display-Regular'}
                    style={styles.text}
                    value={intl.formatMessage({id: str, defaultMessage: str})}
                />
                <AppText
                    fontText={'SF-Pro-Display-Medium'}
                    style={{fontSize: 24, color}}
                    value={value.toString()}
                />
            </View>
        );
    };

    onViewAll = () => {
        this.props.navigation.navigate('PlaceList');
    }

    render() {
        const {userPicture, username, intl, count, setModalVisible, isLogin} = this.props;
        
        const {stories, images, places} = count;
        return (
            <View style={styles.container}>
                <View style={styles.topBody}>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Avatar
                            ava={userPicture}
                            name={username}
                            color={'#FFF'}
                        />
                        {
                            !isLogin && 
                            <>
                                <AppText
                                    style={styles.warning}
                                    value={intl.formatMessage({id: 'profile_warning_1', defaultMessage: "You're using an anonymous account.\nPlease create an account to protect your data"})}
                                />
                                <TouchableOpacity 
                                    style={styles.button}
                                    onPress={() => setModalVisible(true)}
                                >
                                    <AppText
                                        style={{fontSize: 14, color: '#E53D01'}}
                                        value={intl.formatMessage({id: 'profile_warning_2', defaultMessage: "Create an Account"})}
                                    />
                                </TouchableOpacity>
                            </>
                        }
                    </View>
                    <View style={styles.statisticsContainer} >
                        {this.renderItem('Stories', stories, '#21C9A0')}
                        {this.renderItem('Images', images, '#F94135')}
                        {this.renderItem('Places', places, '#9B2F96')}
                    </View>
                </View>
                {/* {loadBannerAd()} */}
                <BannerFbAds/>
                <View style={styles.yourPlaces} >
                    <AppText
                        fontText={'SF-Pro-Display-Regular'}
                        style={{fontSize: 17, marginTop: 3}}
                        value={intl.formatMessage({id: 'your_places', defaultMessage: 'Your places'})}
                    />
                    {
                        places > 0 &&
                        <TouchableOpacity
                            style={styles.viewAll}
                            onPress={() => this.onViewAll()}
                        >
                            <AppText
                                fontText={'SF-Pro-Display-Regular'}
                                style={{fontSize: 13, color: 'rgba(36, 37, 61, 0.5)'}}
                                value={intl.formatMessage({id: 'view_all_2', defaultMessage: 'View all'})}
                            />
                        </TouchableOpacity>
                    }

                </View>
                <View style={{paddingTop: 20}}/>

            </View>
        );
    }
}

export default Header;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
    },
    warning: {
        fontSize: 14,
        textAlign: 'center',
        color: '#FC7901',
        marginTop: 20,
    },
    button: {
        width: 136,
        height: 32,
        borderRadius: 20,
        elevation: 3,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    statisticsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 38,
        paddingHorizontal: 20,
        marginBottom: 10,
    },

    statistics: {
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
        width: 100,
        elevation: 5,
        borderRadius: 8,
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 2,
    },
    text: {
        fontSize: 15,
        marginBottom: 7,
    },

    yourPlaces: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingHorizontal: 20,
    },

    viewAll: {
        width: 77,
        height: 26,
        borderRadius: 30,
        elevation: 5,
        backgroundColor: '#FFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 2,
    },
});