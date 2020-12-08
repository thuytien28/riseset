/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Image,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';
import {injectIntl} from 'react-intl';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import AppIcon from 'assets/icons/AppIcon';
import SocialLogin from 'app/components/social_login';
import Device from 'app/utils/device';
import LoadingHolder from 'app/utils/loading_holder';
import AppText from 'app/components/app_text';
import {loginAnonymously} from 'app/actions/user';

const arraySlide = [
    {
        intl: {
            id: 'app_intro_1',
            defaultMessage: 'Each sunrise brings a new day with new hopes for a new beginning.',
        },
        image: require('assets/images/login/slide1.png'),
    },
    {
        intl: {
            id: 'app_intro_2',
            defaultMessage: 'Sunsets are proof that no matter what happens, everyday can end beautifully.',
        },
        image: require('assets/images/login/slide2.png'),
    },
    {
        intl: {
            id: 'app_intro_3',
            defaultMessage: 'Let\'s save the most beautiful moments of your day.',
        },
        image: require('assets/images/login/slide3.png'),
    },
];

const DEVICE_WIDTH = Dimensions.get('window').width;

class Login extends React.PureComponent {
    static propTypes = {
        intl: PropTypes.object,
        navigation: PropTypes.object,
    };
    state = {
        activeSlide: 0,
    }

    get pagination() {
        const {activeSlide} = this.state;

        return (
            <Pagination
                dotsLength={arraySlide.length}
                activeDotIndex={activeSlide}
                dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#C4C4C4',
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
                containerStyle={{
                    paddingTop: 10,
                    paddingBottom: 10,
                }}
            />
        );
    }

    renderItem = ({item, index}) => {
        const {title, image} = item;
        const {intl} = this.props;

        return (

            <View style={{height: Device.screen.height / 2}}>
                {/* <View style={{flex: 1}}> */}
                <Image
                    source={image}
                    style={{flex: 1, width: DEVICE_WIDTH}}
                    resizeMode={'stretch'}
                />
                <TouchableOpacity
                    style={styles.skip}
                    onPress={() => this.handleLoginAnonymously()}
                >
                    <AppText
                        value={intl.formatMessage({id: 'skip', defaultMessage: 'Skip'})}
                        style={{fontSize: 14}}
                    />
                </TouchableOpacity>
                {/* </View> */}
                <AppText
                    style={styles.txtSlide}
                    value={intl.formatMessage(item.intl)}

                    // numberOfLines={2}
                    // adjustsFontSizeToFit={true}
                />
            </View>
        );
    }

    handleLoginAnonymously = async () => {
        LoadingHolder.start();
        const result = await loginAnonymously();
        await this.props.actions.createUser(result);
        LoadingHolder.stop();
        this.props.navigation.navigate('Home');
    }
    render() {
        const {navigation, intl} = this.props;

        return (
            <SafeAreaView style={styles.container}>
                <View>
                    <Carousel
                        data={arraySlide}
                        renderItem={this.renderItem}
                        sliderWidth={DEVICE_WIDTH}
                        itemWidth={DEVICE_WIDTH}
                        onSnapToItem={(index) => this.setState({activeSlide: index})}
                        loop={true}
                    />
                    {this.pagination}
                </View>
                <SocialLogin
                    navigation={navigation}
                    intl={intl}
                />

                <View
                    style={styles.bottomCtn}
                >
                    <AppText
                        numberOfLines={1}
                        adjustsFontSizeToFit={true}
                        value={intl.formatMessage({id: 'login.footer.message.line1', defaultMessage: 'By continuing, you agree to our'})}
                    />
                    <View style={styles.wrapTextEndFooter}>
                        <TouchableOpacity onPress={() => navigation.navigate('TermsOfService')}>
                            <AppText
                                style={styles.txtLinkFooter}
                                value={intl.formatMessage({id: 'login.footer.terms', defaultMessage: 'Terms of Service'})}
                            />
                        </TouchableOpacity>
                        <AppText
                            style={styles.txtFooter}
                            value={intl.formatMessage({id: 'login.footer.and', defaultMessage: ' and '})}
                        />
                        <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
                            <AppText
                                style={styles.txtLinkFooter}
                                value={intl.formatMessage({id: 'login.footer.policy', defaultMessage: 'Privacy Policy'})}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

export default injectIntl(Login);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
    },
    bottomCtn: {
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    imageContainer: {
        width: Device.screen.width,
        height: (456),
    },
    image: {
        flex: 1,
        width: null,
        height: null,
    },
    txtSlide: {
        fontSize: 15,
        textAlign: 'center',
        paddingTop: 10,
        paddingHorizontal: 16,
    },

    wrapTextEndFooter: {
        flexDirection: 'row',
    },

    txtLinkFooter: {
        fontSize: 13,
        color: 'rgb(71,158,202)',
    },
    skip: {
        position: 'absolute',
        right: 0,
        top: 12,
        width: 57,
        height: 27,
        backgroundColor: '#FFF',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 20,
    },
});
