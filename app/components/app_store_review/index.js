/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import {Platform, Alert, Linking} from 'react-native';
import * as StoreReview from 'react-native-store-review';
import RatingsData from './ratingsData';
import Device from 'app/utils/device';
import Config from 'react-native-config';

export const buttonTypes = {
    NEUTRAL_DELAY: 'NEUTRAL_DELAY',
    NEGATIVE_DECLINE: 'NEGATIVE_DECLINE',
    POSITIVE_ACCEPT: 'POSITIVE_ACCEPT',
};

const config = {
    title: '',
    message: '',
    appStoreId: Config.APPSTORE_ID,
    actionLabels: {
        decline: '',
        delay: '',
        accept: '',
    },
    timingFunction(currentCount) {
        return (
            currentCount > 1 &&
      (Math.log(currentCount) / Math.log(3)).toFixed(4) % 1 === 0
        );
    },
    buttonOrder: {
        ios: [
            buttonTypes.NEGATIVE_DECLINE,
            buttonTypes.NEUTRAL_DELAY,
            buttonTypes.POSITIVE_ACCEPT,
        ],
        android: [
            buttonTypes.NEGATIVE_DECLINE,
            buttonTypes.NEUTRAL_DELAY,
            buttonTypes.POSITIVE_ACCEPT,
        ],
    },
    shouldBoldLastButton: true,
    storeCountry: Device.country,
    handleRate: false,
};

async function isAwaitingRating() {
    const timestamps = await RatingsData.getActionTimestamps();

    // If no timestamps have been set yet we are still awaiting the user, return true
    return timestamps.every((timestamp) => {
        return timestamp[1] === null;
    });
}

/**
 * Creates the RatingRequestor object you interact with
 * @class
 */
export default class RatingRequestor {
    /**
   * @param  {object} intl
   * @param  {object} options
   */

    constructor(intl, options) {
        if (!config.appStoreId) {
            throw "You must specify your app's store ID on construction to use the Rating Requestor.";
        }

        Object.assign(config, options);
        config.title = intl.formatMessage({
            id: 'app.rate.title',
            defaultMessage: 'Rate me',
        });
        config.message = intl.formatMessage({
            id: 'app.rate.message',
            defaultMessage: "We hope you're loving our app. If you are, would you mind taking a quick moment to leave us a positive review?",
        });
        config.actionLabels = {
            decline: intl.formatMessage({
                id: 'app.rate.dontask',
                defaultMessage: "Don't ask again",
            }),
            delay: intl.formatMessage({
                id: 'app.rate.later',
                defaultMessage: 'Maybe later...',
            }),
            accept: intl.formatMessage({
                id: 'app.rate.accept',
                defaultMessage: 'Sure!',
            }),
        };

        this.storeUrl = Platform.select({
            ios: `https://itunes.apple.com/${config.storeCountry}/app/riseset-journal/id${config.appStoreId}`,
            android: 'market://details?id=com.risesetjournal',
        });
    }

    /**
   * Shows the rating dialog when called. Normally called by `handlePositiveEvent()`, but
   * can be called on its own as well. Use caution when doing so--you don't want to ask
   * the user for a rating too frequently or you might annoy them. (This is handy, however,
   * if the user proactively seeks out something in your app to leave a rating, for example.)
   *
   * @param {function(didAppear: boolean, result: string)} callback Optional. Callback that reports whether the dialog appeared and what the result was.
   */
    showRatingDialog(callback = () => { }) {
        const buttonDefaults = {
            NEGATIVE_DECLINE: {
                text: config.actionLabels.decline,
                onPress: () => {
                    RatingsData.recordDecline();
                    callback(true, 'decline');
                },
            },
            NEUTRAL_DELAY: {
                text: config.actionLabels.delay,
                onPress: () => {
                    callback(true, 'delay');
                },
            },
            POSITIVE_ACCEPT: {
                text: config.actionLabels.accept,
                onPress: () => {
                    Platform.OS === 'android' && RatingsData.recordRated();
                    callback(true, 'accept');

                    // This API is only available on iOS 10.3 or later
                    if (Platform.OS === 'ios' && StoreReview.isAvailable) {
                        StoreReview.requestReview();
                    } else {
                        Linking.openURL(this.storeUrl);
                    }
                },
                style: 'default',
            },
        };

        const buttons = Platform.select(config.buttonOrder).map((bo) => buttonDefaults[bo]);

        if (config.shouldBoldLastButton) {
            buttons[2].style = 'cancel';
        }

        Alert.alert(
            config.title,
            config.message,
            buttons.filter((e) => e.text === config.actionLabels.delay || e.text === config.actionLabels.accept),
        );
    }

    

    /**
   * Call when a positive interaction has occurred within your application. Depending on the number
   * of times this has occurred and your timing function, this may display a rating request dialog.
   *
   * @param {function(didAppear: boolean, result: string)} callback Optional. Callback that reports whether the dialog appeared and what the result was.
   */
    async handlePositiveEvent(callback = () => { }) {
        // const countShow = await RatingsData.getCountShow();

        // if ((countShow < 3 && !config.handleRate) || config.handleRate) {
        //     const currentCount = await RatingsData.incrementCount();

        //     if (config.timingFunction(currentCount)) {
        //         await RatingsData.incrementCountShow();
        //         this.showRatingDialog(callback);
        //     } else {
        //         callback(false);
        //     }
        // } else {
        //     callback(false);
        // }
        if (await isAwaitingRating()) {
            const currentCount = await RatingsData.incrementCount();

            if (config.timingFunction(currentCount)) {
                this.showRatingDialog(callback);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }

    }
}
