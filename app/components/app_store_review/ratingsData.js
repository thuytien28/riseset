/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import AsyncStorage from '@react-native-community/async-storage';

const keyPrefix = '@RatingRequestData.';
const eventCountKey = keyPrefix + 'positiveEventCount';
const ratedTimestamp = keyPrefix + 'ratedTimestamp';
const declinedTimestamp = keyPrefix + 'declinedTimestamp';
const countShow = keyPrefix + 'countShow';

/**
 * Private class that let's us interact with AsyncStorage on the device
 * @class
 */
class RatingsData {
    constructor() {
        this.initialize();
    }

    // Get current count of positive events
    async getCount() {
        try {
            const countString = await AsyncStorage.getItem(eventCountKey);
            return parseInt(countString, 10);
        } catch (ex) {
            console.log('Couldn\'t retrieve positive events count. Error:', ex);
        }
    }

    // Increment count of positive events
    async incrementCount() {
        try {
            const currentCount = await this.getCount();
            await AsyncStorage.setItem(eventCountKey, (currentCount + 1).toString());

            return currentCount + 1;
        } catch (ex) {
            console.log('Could not increment count. Error:', ex);
        }
    }

    async getCountShow() {
        try {
            const countString = await AsyncStorage.getItem(countShow);
            return parseInt(countString, 10);
        } catch (ex) {
            console.log('Couldn\'t retrieve show count. Error:', ex);
        }
    }

    async incrementCountShow() {
        try {
            const currentCount = await this.getCountShow();
            await AsyncStorage.setItem(countShow, (currentCount + 1).toString());

            return currentCount + 1;
        } catch (ex) {
            console.log('Could not increment count. Error:', ex);
        }
    }
    async getActionTimestamps() {
        try {
            const timestamps = await AsyncStorage.multiGet([ratedTimestamp, declinedTimestamp]);

            return timestamps;
        } catch (ex) {
            console.log('Could not retrieve rated or declined timestamps.', ex);
        }
    }

    async recordDecline() {
        try {
            await AsyncStorage.setItem(declinedTimestamp, Date.now().toString());
        } catch (ex) {
            console.log('Couldn\'t set declined timestamp.', ex);
        }
    }

    async recordRated() {
        try {
            await AsyncStorage.setItem(ratedTimestamp, Date.now().toString());
        } catch (ex) {
            console.log('Couldn\'t set rated timestamp.', ex);
        }
    }

    // Initialize keys, if necessary
    async initialize() {
        try {
            const keys = await AsyncStorage.getAllKeys();

            if (!keys.some((key) => key === eventCountKey)) {
                await AsyncStorage.setItem(eventCountKey, '0');
            }
            if (!keys.some((key) => key === countShow)) {
                await AsyncStorage.setItem(countShow, '0');
            }
        } catch (ex) {
            // report error or maybe just initialize the values?
            console.log('Uh oh, something went wrong initializing values!', ex);
        }
    }
}

export default new RatingsData();
