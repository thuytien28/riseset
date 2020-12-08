/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {Platform} from 'react-native';
import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';

// import {InterstitialAd, TestIds, AdEventType, AdsConsent, AdsConsentStatus, AdsConsentDebugGeography} from '@react-native-firebase/admob';
import BannerAdCpn from 'app/firebase/admob/BannerAdCpn';

import LocalConfig from 'assets/config.json';

export const ADMOB = {
    INTERSTITIAL_AD_UNIT_ID: Platform.select({
        ios: Config.IOS_INTERSTITIAL_AD_UNIT_ID,
        android: Config.ANDROID_INTERSTITIAL_AD_UNIT_ID,
    }),
    BANNER_AD_UNIT_ID: Platform.select({
        ios: Config.IOS_BANNER_AD_UNIT_ID,
        android: Config.ANDROID_BANNER_AD_UNIT_ID,
    }),
};

export const loadInterstitialAd = async () => {
    return null;

    // const status = await AdsConsent.getStatus();
    // const interstitialAd = InterstitialAd.createForAdRequest(ADMOB.INTERSTITIAL_AD_UNIT_ID, {
    //     requestNonPersonalizedAdsOnly: status === AdsConsentStatus.NON_PERSONALIZED,
    // });

    // // const interstitialAd = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, {
    // //     requestNonPersonalizedAdsOnly: status === AdsConsentStatus.NON_PERSONALIZED,
    // // });

    // const unsubscribe = interstitialAd.onAdEvent((type, error) => {
    //     if (type === AdEventType.LOADED) {
    //         interstitialAd.show();
    //     }
    // });
    // interstitialAd.load();
};

export const loadBannerAd = () => {
    return null;

    // return (
    //     <BannerAdCpn/>
    // );
};

export const requestAdsConsent = async () => {
    // ***********************
    // to get advertisingID on ios:
    // insert code below to AppDelegate.m
    //     #import <AdSupport/AdSupport.h>
    // // ...
    // NSLog(@"Advertising ID: %@",
    //       ASIdentifierManager.sharedManager.advertisingIdentifier.UUIDString);
    // **********************

    // uncomment to test
    // const advertisingID = [
    //     '5F0F6613-87F7-48BA-973B-702ADA38D1A6', // ios device Thientv; simulator auto in test device.
    // ];

    try {
        // let uniqueId = DeviceInfo.getUniqueId(); // uncomment to test with real device
        // await AdsConsent.addTestDevices(uniqueId); // uncomment to test with real device
        // await AdsConsent.setDebugGeography(AdsConsentDebugGeography.EEA); // uncomment to test

        const consentInfo = await AdsConsent.requestInfoUpdate([Config.PUBLISHER_ID]);

        // console.log('consentInfo', consentInfo);

        if (
            consentInfo.isRequestLocationInEeaOrUnknown &&
            consentInfo.status === AdsConsentStatus.UNKNOWN
        ) {
            const formResult = await AdsConsent.showForm({
                privacyPolicy: LocalConfig.PrivacyPolicyLink,
                withPersonalizedAds: true,
                withNonPersonalizedAds: true,
                withAdFree: false,
            });
        }
    } catch (error) {
        console.log('error', error);
    }
};