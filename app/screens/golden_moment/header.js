/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {StyleSheet, View, TouchableOpacity, ImageBackground} from 'react-native';
import PropTypes from 'prop-types';
import AppText from 'app/components/app_text';
import AppIcon from 'assets/icons/AppIcon';
import CountDown from 'app/components/countdown';
import Device from 'app/utils/device';
import SunCalc from './algorithms/suncalc';
import moment from 'moment';
import Icon from 'app/components/icon';
import {loadBannerAd} from 'app/firebase/admob';
import BannerFbAds from 'app/firebase/facebookads/bannerView';

const BackgroundDay = require('assets/images/golden_moment/background-day.png');
const BackgroundNight = require('assets/images/golden_moment/background-night.png');

class Header extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            until: 0,
            isHappening: false,
            background: BackgroundDay,
        };
    }

    componentDidUpdate(prevProps) {
        const {sunrise, sunset, nextMoment} = this.props;

        if (nextMoment !== prevProps.nextMoment) {
            const current = new Date().getTime();

            if (nextMoment.name === 'sunrise') {
                const {start, end} = sunset;
                if (current >= new Date(start).getTime() && current <= new Date(end).getTime()) {
                    const s = subTime(end, new Date());
                    this.setState({
                        until: s,
                        isHappening: true,
                        background: BackgroundNight,
                    });
                } else {
                    this.setState({
                        until: nextMoment.time,
                        isHappening: false,
                        background: BackgroundNight,
                    });
                }
            } else {
                const {start, end} = sunrise;
                if (current >= new Date(start).getTime() && current <= new Date(end).getTime()) {
                    const s = subTime(end, new Date());
                    this.setState({
                        until: s,
                        isHappening: true,
                        background: BackgroundDay,
                    });
                } else {
                    this.setState({
                        until: nextMoment.time,
                        isHappening: false,
                        background: BackgroundDay,
                    });
                }
            }
        }
    }
    renderLocation() {
        const {location, screenProps, onNavigateToLocationSearch} = this.props;
        const {name} = location;
        let Content;

        if (name) {
            Content = (
                <AppText
                    fontText={'SF-Pro-Display-Medium'}
                    style={styles.textLocation}
                    value={name}
                    numberOfLines={1}
                />
            );
        } else {
            Content = (
                <AppText
                    fontText={'SF-Pro-Display-Medium'}
                    style={styles.textLocation}
                    value={screenProps.intl.formatMessage({id: 'goldenMoment_not_location', defaultMessage: 'You must select a location'})}
                />
            );
        }

        return (
            <View style={styles.location}>
                <TouchableOpacity
                    style={styles.nameLocation}
                    onPress={() => onNavigateToLocationSearch()}
                >
                    <View style={{marginRight: 10}}>
                        <AppIcon
                            name={'place'}
                            color={'rgba(36, 37, 61, 0.5)'}
                            size={18}
                        />
                    </View>
                    <View style={styles.icon}>
                        {Content}
                        <View style={{marginLeft: 5}}>
                            <Icon
                                type={'AntDesign'}
                                name={'down'}
                                size={10}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    nextCountdown() {
        const {nextMoment, location} = this.props;
        const {start, end, name} = nextMoment;

        const current = new Date().getTime();
        if (current >= new Date(start).getTime() && current <= new Date(end).getTime()) {
            if (name === 'sunrise') {
                this.setState({
                    until: nextMoment.period,
                    isHappening: true,
                    background: BackgroundDay,
                });
            } else {
                this.setState({
                    until: nextMoment.period,
                    isHappening: true,
                    background: BackgroundNight,
                });
            }
        } else {
            const {lat, lng} = location;
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const di = SunCalc.getDayInfo(new Date(), tomorrow, lat, lng);

            const {sunrise, sunset} = di;

            const until = sunrise.time > sunset.time ? sunset.time : sunrise.time;
            const background = sunrise.time > sunset.time ? BackgroundDay : BackgroundNight;
            this.setState({
                until,
                isHappening: false,
                background,
            });
        }
    }

    render() {
        const {until, isHappening, background} = this.state;
        const {screenProps, location} = this.props;
        const {name} = location;

        let Content = (
            <AppText
                fontText={'SF-Pro-Display-Light'}
                style={{fontSize: 15, marginTop: 30}}
                value={screenProps.intl.formatMessage({id: 'golden_moment_is_happening', defaultMessage: 'GOLDEN MOMENT IS HAPPENING'})}
            />
        );

        if (!isHappening) {
            Content = (
                <AppText
                    fontText={'SF-Pro-Display-Light'}
                    style={{fontSize: 15, marginTop: 30}}
                    value={screenProps.intl.formatMessage({id: 'golden_moment_is_comming', defaultMessage: 'GOLDEN MOMENT IS COMMING'})}
                />
            );
        }
        return (
            <View>
                {
                    !name &&
                    <View style={{marginVertical: 20}}>
                        {this.renderLocation()}
                    </View>
                }
                {
                    name &&
                    <ImageBackground
                        source={background}
                        style={styles.image}
                    >
                        {this.renderLocation()}
                        <View style={styles.countdown}>
                            <CountDown
                                size={40}
                                until={until}
                                timeToShow={['H', 'M', 'S']}
                                timeLabels={{m: null, s: null}}
                                showSeparator={true}
                                nextCountdown={() => this.nextCountdown()}
                            />
                            {Content}
                        </View>
                    </ImageBackground>
                }
                {/* {loadBannerAd()} */}
                <BannerFbAds/>
            </View>
        );
    }
}

Header.propTypes = {
    location: PropTypes.object,
    sunrise: PropTypes.object,
    sunset: PropTypes.object,
    nextMoment: PropTypes.object,
    onNavigateToLocationSearch: PropTypes.func,
    screenProps: PropTypes.object,
};

export default Header;

const styles = StyleSheet.create({
    image: {
        width: Device.screen.width,
        marginTop: 20.88,
        height: (Device.screen.width * 240) / 375,
    },
    location: {
        marginLeft: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    nameLocation: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textLocation: {
        fontSize: 15,
        fontWeight: '500',
    },
    countdown: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    icon: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },

});

const subTime = (start, end) => {
    const ms = moment(start, 'DD/MM/YYYY HH:mm:ss').diff(moment(end, 'DD/MM/YYYY HH:mm:ss'));
    const d = moment.duration(ms);
    const hours = d.hours();
    const minutes = d.minutes();
    const seconds = d.seconds();
    const s = hours * 3600 + minutes * 60 + seconds;

    // alert(s)
    return s;
};

