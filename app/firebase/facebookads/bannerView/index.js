/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {StyleSheet, View, Platform} from 'react-native';
import {BannerView, AdSettings} from 'react-native-fbads';

import Config from 'react-native-config';

class BannerFbAds extends React.PureComponent {
    componentDidMount() {
        // console.log('hash', AdSettings.currentDeviceHash);
        AdSettings.clearTestDevices();
    }
    render() {
        return (
            <View style={styles.container}>
                <BannerView
                    placementId={
                        Platform.select({
                            ios: Config.IOS_FACEBOOK_BANNER_AD_ID,
                            android: Config.ANDROID_FACEBOOK_BANNER_AD_ID,
                        })
                    }
                    type='standard'

                    // onPress={() => console.log('click')}
                    // onError={(err) => console.log('error', err)}
                />
            </View>
        );
    }
}

export default BannerFbAds;

const styles = StyleSheet.create({
    container: {

        // justifyContent: 'center',

        // marginHorizontal: 10,
    },
});