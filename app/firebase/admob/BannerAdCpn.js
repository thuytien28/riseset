/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';

// import {BannerAdSize, TestIds, BannerAd, AdsConsentStatus, AdsConsent} from '@react-native-firebase/admob';

import {ADMOB} from 'app/firebase/admob';
class BannerAdCpn extends React.PureComponent {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         loadAdError: false,
    //         status: '',
    //     };
    //     this.getStatus();
    // }

    // getStatus = async () => {
    //     try {
    //         const status = await AdsConsent.getStatus();
    //         this.setState({status});
    //     } catch (error) {
    //         console.log('error', error);
    //     }
    // }

    // onAdFailedToLoad = (error) => {
    //     // console.log('Advert failed to load: ', error);
    //     this.setState({loadAdError: true});
    // }

    render() {
        return null;

        // const {loadAdError, status} = this.state;
        // let Content = null;

        // if (loadAdError) {
        //     Content = null;
        // } else {
        //     Content = (
        //         <BannerAd

        //             // Test
        //             // unitId={TestIds.BANNER}

        //             // Release
        //             unitId={ADMOB.BANNER_AD_UNIT_ID}
        //             size={BannerAdSize.SMART_BANNER}
        //             requestOptions={{
        //                 requestNonPersonalizedAdsOnly: status === AdsConsentStatus.NON_PERSONALIZED,
        //             }}
        //             onAdFailedToLoad={this.onAdFailedToLoad}

        //         // onAdLoaded={() => {
        //         //     console.log('Advert loaded');
        //         // }}
        //         />
        //     );
        // }
        // return Content;
    }
}
export default BannerAdCpn;