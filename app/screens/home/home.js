/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import {
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Image,
    View,
} from 'react-native';
import PropTypes from 'prop-types';

// import firestore from '@react-native-firebase/firestore';
// import moment from 'moment';

import Header from './header';
import CarouselCmp from 'app/components/carousel';
import Device from 'app/utils/device';

// import {loadBannerAd, requestAdsConsent} from 'app/firebase/admob';
// import DeviceInfo from 'react-native-device-info';
import BannerFbAds from 'app/firebase/facebookads/bannerView';

// import InterstitialFbAds from 'app/firebase/facebookads/interstitialAds';
// import {InterstitialAdManager, AdSettings} from 'react-native-fbads';
// import Config from 'react-native-config';

class Home extends React.PureComponent {
    constructor(props) {
        super(props);
        props.navigation.addListener('willFocus', () => {
            StatusBar.setHidden(false);
        });

        // requestAdsConsent();
    }

    async componentDidMount() {
        const {actions, user} = this.props;
        if (user.id) {
            actions.fetchStoriesByUserId(user.id);
            actions.updateUserLocale();
            this.getQuote();
        }

        // const deviceId = await DeviceInfo.getUniqueId();
        // console.log(deviceId);
    }

    getQuote = () => {
        const {actions} = this.props;
        actions.fetchQuoteIfNecessary();
    }

    // isInRange = (now, lastTime, quoteTime) => {
    //     if ((quoteTime > lastTime && quoteTime <= now) || (quoteTime < lastTime && quoteTime >= now)) {
    //         return true;
    //     }
    //     return false;
    // }

    onNavigateToStoryDetail(storyId) {
        this.props.navigation.navigate(
            'StoryDetails',
            {
                storyId,
            }
        );
    }

    handleOnEndReached = () => {
        const {actions, user} = this.props;

        actions.loadMoreUserStories(user.id);
    }

    render() {
        const {navigation, screenProps, stories, loadingStatus, currentQuote} = this.props;
        const ImageBG = (
            <View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    width: Device.screen.width,
                    height: Device.screen.height / 2,
                }}
                pointerEvents='none'
            >
                <Image
                    source={require('assets/images/bg-home-1.png')}
                    style={{
                        flex: 1,
                        width: null,
                        height: null,
                    }}
                    resizeMode='cover'
                />
            </View>
        );

        const Content = (
            <CarouselCmp
                onNavigateToStoryDetail={(storyId) => this.onNavigateToStoryDetail(storyId)}
                data={stories}
                handleOnEndReached={() => this.handleOnEndReached()}
                carouselHeader={true}
                quote={currentQuote.quote}
            />
        );

        return (
            <SafeAreaView
                style={styles.container}
            >
                {ImageBG}
                <Header
                    navigation={navigation}
                    intl={screenProps.intl}
                />
                {Content}
                {/* {loadBannerAd()} */}
                <BannerFbAds/>
                {/* <InterstitialFbAds/> */}

            </SafeAreaView>

        );
    }
}

Home.propTypes = {
    actions: PropTypes.object,
    currentQuote: PropTypes.object,
    loadingStatus: PropTypes.bool,
    navigation: PropTypes.object,
    screenProps: PropTypes.object,
    stories: PropTypes.array,
    user: PropTypes.object,
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
});

