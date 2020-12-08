/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Animated,
    AppState,
} from 'react-native';

import PropTypes from 'prop-types';
import Share from 'react-native-share';

import AppIcon from 'assets/icons/AppIcon';
import AppText from 'app/components/app_text';
import {loadInterstitialAd} from 'app/firebase/admob';

class Header extends React.PureComponent<Props> {
    static propTypes = {
        actions: PropTypes.object,
        intl: PropTypes.object,
        navigation: PropTypes.object,
        onLeftIcon: PropTypes.func,
        onNavigateToEditNote: PropTypes.func,
        opacity: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
        storyId: PropTypes.string,
        locationId: PropTypes.string,
        userId: PropTypes.string,
    };

    state = {
        effectImageLink: '',
        effect: null,
        imageRef: null,
        isPressedShare: false,
        appState: AppState.currentState,
        openedShare: false,
    };

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
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

    componentDidUpdate(prevProps, prevState) {
        const {downloadState, intl, path, loading} = this.props;
        const {isPressedShare} = this.state;
        if (isPressedShare) {
            if (downloadState === 'completed') {
                if (path !== '') {
                    this.share(path, intl);
                }
            } else if (downloadState === 'downloading') {
                loading.start();
            }
        }
    }

    handleDeleteStory = () => {
        const {actions, navigation, storyId, locationId, userId} = this.props;
        actions.deleteStory(storyId, locationId, userId);
        navigation.goBack();
    }

    onDeleteStory = () => {
        const {intl} = this.props;
        Alert.alert(
            intl.formatMessage({id: 'deleteStory', defaultMessage: 'DELETE'}),
            intl.formatMessage({id: 'deleteStoryDesc', defaultMessage: 'Are you sure you want to delete this story?'}),
            [
                {
                    text: intl.formatMessage({id: 'button.cancel', defaultMessage: 'Cancel'}),
                },
                {
                    text: intl.formatMessage({id: 'button.ok', defaultMessage: 'Ok'}),
                    onPress: () => this.handleDeleteStory(),
                },
            ]
        );
    }

    share = (path, intl) => {
        const shareOptions = {
            title: intl.formatMessage({id: 'share_title', defaultMessage: 'Select an application to share'}),
            url: path,
        };
        Share.open(shareOptions).
            then((res) => {
                // Update state then used to load ads
                this.setState({
                    openedShare: true,
                });
            }).
            catch((err) => {
                console.log('share failed');
            });
        this.setState({
            isPressedShare: false,
        });
    }
    onPressShare = () => {
        this.setState({
            isPressedShare: true,
        });
    }

    render() {
        const {onLeftIcon, intl, opacity} = this.props;
        const Left = (
            <TouchableOpacity
                style={styles.LeftContainer}
                onPress={onLeftIcon}
            >
                <View style={styles.iconBack}>
                    <AppIcon
                        color={'#FFF'}
                        name={'arow-left'}
                        size={(20)}
                    />
                </View>

                <AppText
                    fontText={'SF-Pro-Display-Regular'}
                    style={styles.title}
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}
                    value={intl.formatMessage({id: 'back', defaultMessage: 'Back'})}
                />

            </TouchableOpacity>
        );

        const Right = (
            <View style={styles.rightHeader}>
                <TouchableOpacity
                    style={[styles.iconCtn, {paddingRight: 10}]}
                    onPress={() => this.onDeleteStory()}
                >
                    <View style={styles.icon}>
                        <AppIcon
                            name={'bin'}
                            color={'#FFF'}
                            size={(20)}
                        />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.iconCtn]}
                    onPress={() => this.props.onNavigateToEditNote()}
                >
                    <View style={styles.icon}>
                        <AppIcon
                            name={'edit'}
                            color={'#FFF'}
                            size={(20)}
                        />
                    </View>

                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.iconCtn]}
                    onPress={() => this.onPressShare()}
                >
                    <View style={styles.icon}>
                        <AppIcon
                            name={'share'}
                            color={'#FFF'}
                            size={(20)}
                        />
                    </View>

                </TouchableOpacity>
            </View>
        );
        return (
            <Animated.View style={[styles.container, {opacity}]}>
                {Left}
                {Right}
            </Animated.View>
        );
    }
}

export default Header;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 60,
        zIndex: 10,
    },

    title: {
        fontWeight: '300',
        includeFontPadding: false,
        fontSize: (20),
        color: '#FFF',
    },

    btnContainer: {
        height: '100%',
        paddingRight: (16),
        paddingLeft: (5),
        justifyContent: 'center',
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

    rightHeader: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
    },
    icon: {
        height: (30),
        width: (30),

        // borderRadius: (30 / 2),
        // borderColor: '#DFDDDD',
        // borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCtn: {
        height: '100%',
        justifyContent: 'center',
        paddingHorizontal: 5,
    },
});
