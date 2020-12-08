/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import {Animated, StyleSheet, View, TouchableOpacity} from 'react-native';

import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';

import AppText from 'app/components/app_text';
import Device from 'app/utils/device';
import AppIcon from 'assets/icons/AppIcon';

class Quote extends React.PureComponent {
    constructor(props) {
        super(props);

        this.textAnimation = new Animated.Value(0);
        this.imageAnimation = new Animated.Value(0);
    }
    renderTime() {
        const {screenProps} = this.props;
        return (
            <View
                style={styles.timeCtn}
            >
                <AppText
                    value={screenProps.intl.formatMessage({id: 'quote', defaultMessage: 'QUOTES'})}
                    style={styles.quotes}
                    fontText={'SF-Pro-Display-Light'}
                />
            </View>
        );
    }

    renderQuote = () => {
        const {navigation} = this.props;
        let author = '';
        let quote = '';
        if (navigation.getParam('quote').quote && navigation.getParam('quote').author) {
            author = '- ' + navigation.getParam('quote').author + ' -';
            quote = '"' + navigation.getParam('quote').quote + '"';
        }
        return (
            <View
                style={styles.text}
            >
                <AppText
                    value={quote}
                    style={styles.quoteText}
                    numberOfLines={6}
                    adjustsFontSizeToFit={true}
                    ellipsizeMode='tail'
                    fontText={'SF-Pro-Display-Light'}
                />
                <AppText
                    value={author}
                    style={[styles.quoteText, {paddingTop: 15, fontStyle: 'italic'}]}
                    adjustsFontSizeToFit={true}
                    ellipsizeMode='tail'
                    fontText={'SF-Pro-Display-Light'}
                />
            </View>
        );
    }

    render() {
        const {navigation, screenProps} = this.props;
        const opacityFullImage = this.imageAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
        });
        return (
            <View style={styles.container}>
                <Animated.View style={[styles.headerContainer, opacityFullImage]}>
                    <TouchableOpacity
                        style={styles.LeftContainer}
                        onPress={() => {
                            navigation.goBack();
                        }}
                    >
                        <View style={styles.iconBack}>
                            <AppIcon
                                color={'#FFF'}
                                name={'arow-left'}
                                size={(20)}
                            />
                        </View>

                        <AppText
                            fontText={'SF-Pro-Display-Thin'}
                            style={styles.title}
                            numberOfLines={1}
                            adjustsFontSizeToFit={true}
                            value={screenProps.intl.formatMessage({id: 'back', defaultMessage: 'Back'})}
                        />

                    </TouchableOpacity>
                </Animated.View>
                <FastImage
                    style={[styles.storieImage]}
                    source={navigation.getParam('quoteImage')}
                    resizeMode={FastImage.resizeMode.cover}
                />
                {this.renderQuote()}
                {this.renderTime()}
            </View>
        );
    }
}

Quote.propTypes = {
    intl: PropTypes.object,
    navigation: PropTypes.object,
    screenProps: PropTypes.object,
};

export default Quote;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },

    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 60,
    },

    LeftContainer: {
        flexDirection: 'row',
        height: '100%',
        alignItems: 'center',
    },

    iconBack: {
        paddingLeft: (16),
        paddingRight: (10),
    },

    title: {
        fontWeight: '300',
        includeFontPadding: false,
        fontSize: (20),
        color: '#FFF',
    },

    timeCtn: {
        height: 100,
        width: 100,
        position: 'absolute',
        top: 15,
        left: 15,
    },

    quoteText: {
        fontFamily: 'BaiJamjuree-Light',
        color: '#FFFFFF',
        fontWeight: '300',
        textAlign: 'center',
        fontSize: 14,
        letterSpacing: 0.631806,
    },

    quotes: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 15,
    },

    storieImage: {
        flex: 1,
    },

    text: {
        position: 'absolute',
        height: (3 * Device.screen.height) / 3,
        marginHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
});