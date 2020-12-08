/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import {View, StyleSheet, TouchableOpacity, AppState} from 'react-native';
import PropTypes from 'prop-types';

import FastImage from 'react-native-fast-image';
import {injectIntl} from 'react-intl';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';

import AppText from 'app/components/app_text';
import Device from 'app/utils/device';
import AppIcon from 'assets/icons/AppIcon';
import Toast from 'app/components/toast';
import {loadInterstitialAd} from 'app/firebase/admob';

class CarouselHeaderItem extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            shareImage: '',
            isShareClick: false,
            appState: AppState.currentState,
            openedShare: false,
        };
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
        this.removeCacheImage();
    }

    _handleAppStateChange = (nextAppState) => {
        // After opening the app which selected to share and back
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            if (this.state.openedShare) {
                this.setState({
                    openedShare: false,
                });
                loadInterstitialAd();
            }
        }
        this.setState({appState: nextAppState});
    }

    removeCacheImage = () => {
        const {shareImage} = this.state;
        if (!shareImage) {
            return;
        }
        RNFS.unlink(shareImage).
            then(() => {
                // console.log('sucess');
            }).
            catch((err) => {
                // console.log(err.message);
            });
    }

    renderQuoteTitle() {
        const {intl} = this.props;
        return (
            <View
                style={styles.timeCtn}
            >
                <AppText
                    value={intl.formatMessage({id: 'quotes', defaultMessage: 'QUOTES'})}
                    style={styles.quotes}
                    fontText={'SF-Pro-Display-Light'}
                />
            </View>
        );
    }

    renderShare = () => {
        return (
            <TouchableOpacity
                style={[styles.iconCtn]}
                onPress={() => this.onPressShare()}
            >
                <AppIcon
                    name={'share'}
                    color={'rgba(255, 255, 255, 0.5)'}
                    size={(20)}
                />

            </TouchableOpacity>
        );
    }

    onPressShare = () => {
        this.setState({
            isShareClick: true,
        }, () => {
            this.refs.viewShot.capture().then((uri) => {
                this.setState({
                    shareImage: uri,
                });

                const shareOptions = {
                    title: this.props.intl.formatMessage({id: 'share_title', defaultMessage: 'Select an application to share'}),
                    url: this.state.shareImage,
                };

                Share.open(shareOptions).
                    then((res) => {
                        // Update state then used to load ads
                        this.setState({
                            openedShare: true,
                        });
                    }).
                    catch((err) => {
                        console.log(err);
                    });
                this.setState({
                    isShareClick: false,
                });
            });
        });
    }

    renderQuote = () => {
        const {quote} = this.props;
        if (!quote) {
            return null;
        }
        const author = quote.author ? ('- ' + quote.author + ' -') : '';
        const quoteContent = quote.content ? ('"' + quote.content + '"') : '';

        return (
            <View
                style={styles.text}
            >
                <AppText
                    value={quoteContent}
                    style={[styles.quoteText, {fontSize: 14}]}

                    // numberOfLines={6}
                    // adjustsFontSizeToFit={true}
                    ellipsizeMode='tail'
                    fontText={'SF-Pro-Display-Light'}
                />
                <AppText
                    value={author}
                    style={[styles.quoteText, {paddingTop: 15, fontStyle: 'italic', fontSize: 15}]}

                    // adjustsFontSizeToFit={true}
                    ellipsizeMode='tail'
                    fontText={'SF-Pro-Display-Light'}
                />
            </View>
        );
    }

    render() {
        // console.log(this.state.isShareClick);
        if (!this.state.isShareClick) {
            return (
                <>
                    <FastImage
                        style={[styles.storieImage]}
                        source={this.props.bgImage}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                    {this.renderQuote()}
                    {this.renderQuoteTitle()}
                    {this.renderShare()}
                </>
            );
        }
        return (
            <>
                <ViewShot
                    ref='viewShot'
                    options={{format: 'jpg', quality: 0.9}}
                    style={{flex: 1, borderRadius: 10}}
                >
                    <FastImage
                        style={{flex: 1}}
                        source={this.props.bgImage}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                    {this.renderQuote()}
                    {this.renderQuoteTitle()}
                </ViewShot>
                {this.renderShare()}
                <Toast
                    refs={(ref) => {
                        this.toast = ref;
                    }}
                />
            </>
        );
    }
}

CarouselHeaderItem.propTypes = {
    intl: PropTypes.object,
    quote: PropTypes.object,
};

export default injectIntl(CarouselHeaderItem);

const styles = StyleSheet.create({
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
        letterSpacing: 0.631806,
    },

    quotes: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 15,
    },

    iconCtn: {
        position: 'absolute',
        top: 15,
        right: 15,
    },

    storieImage: {
        borderRadius: 10,
        flex: 1,
    },

    text: {
        position: 'absolute',
        height: (3 * Device.screen.height) / 5,
        marginHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
});