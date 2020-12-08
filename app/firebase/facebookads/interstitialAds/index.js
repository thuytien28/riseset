/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {Dimensions, View, TouchableHighlight, Text, StyleSheet} from 'react-native';
import {InterstitialAdManager, AdSettings} from 'react-native-fbads';
import Config from 'react-native-config';

const {width} = Dimensions.get('window');

class InterstitialFbAds extends React.PureComponent {
    componentDidMount() {
        if (__DEV__) {
            AdSettings.addTestDevice(AdSettings.currentDeviceHash);
        }
    }

    showAds() {
        InterstitialAdManager.showAd(Config.ANDROID_FACEBOOK_INTERSTITIAL_AD_ID).
            then(() => {}).
            catch((err) => {
                // console.log('Error: ', err);
            });
    }

    render() {
        return (
            <View style={styles.container}>
                {/* <TouchableHighlight
                    underlayColor="#b2bbbc"
                    style={styles.button}
                    onPress={this.showAds}
                >
                    <Text style={styles.buttonText}>Show Interstitial Ad</Text>
                </TouchableHighlight> */}
                {this.showAds()}
            </View>
        );
    }
}

export default InterstitialFbAds;

const styles = StyleSheet.create({
    container: {
        width,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        elevation: 3,
        borderRadius: 10,
        paddingVertical: 10,
        width: width - 80,
        alignItems: 'center',
        marginVertical: 5,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#a70f0a',
    },
});