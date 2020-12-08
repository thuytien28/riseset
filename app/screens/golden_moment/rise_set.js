/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import {
    StyleSheet,
    View,
    Image,
} from 'react-native';
import PropTypes from 'prop-types';
import AppText from 'app/components/app_text';
import AppTextSpecial from 'app/components/app_text_special';
import moment from 'moment';
import Device from 'app/utils/device';
import weatherIcons from 'app/components/weatherIcon';
import Icon from 'app/components/icon';

const sunriseImage = require('assets/images/golden_moment/sunrise.png');
const sunsetImage = require('assets/images/golden_moment/sunset.png');

class RiseSet extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            weather: {
                summary: '',
                temp: '',
                wind: '',
                visibility: '',
                cloudCover: '',
                precipProbability: '',
                icon: '',
            },
            timezone: 'Asia/Bangkok',
        };
    }

    componentDidMount() {
        const {location, sun} = this.props;
        const {lat, lng} = location;

        if (lat && lng && sun.goldenHour) {
            this.fetchWeather(lat, lng, sun);
        }
    }

    componentDidUpdate(prevProps) {
        const {location, sun} = this.props;
        if ((location && location != prevProps.location) || (sun && sun != prevProps.sun)) {
            const {lat, lng} = location;
            if (lat && lng && sun.goldenHour) {
                this.fetchWeather(lat, lng, sun);
            }
        }
    }
    onToggleNoti(date, isRiseSet) {
        this.props.onToggleNoti(date, isRiseSet);
    }

    checkSummary(summary) {
        return summary.slice(0, 1).toUpperCase() + summary.toString().slice(1, summary.length).toLowerCase();
    }

    fetchWeather = async (lat, lng, sun) => {
        const {changeTimezone} = this.props;
        const time = new Date(sun.goldenHour / 1000).getTime();
        const language = Device.locale;
        await fetch('https://api.darksky.net/forecast/86c3d5fa7efda554eccff4ff3e4d5870/' + lat + ',' + lng + ',' + time + '?units=si&exclude=hourly,flags,daily&lang=' + language).
            then((response) => response.json()).
            then((responseJson) => {
                const {summary, temperature, cloudCover, windSpeed, precipProbability, precipType, visibility, icon} = responseJson.currently;
                const precipProb = precipProbability && precipType ? precipProbability : 0;

                const weather = {
                    summary: this.checkSummary(summary),
                    precipProbability: (precipProb * 100).toFixed(0).toString(),
                    temp: temperature.toFixed(0).toString(),
                    cloudCover: (cloudCover * 100).toFixed(0).toString(),
                    wind: windSpeed.toFixed(1).toString(),
                    visibility: visibility ? visibility.toFixed(1).toString() : '0',
                    icon,
                };
                changeTimezone(responseJson.timezone);

                this.setState({
                    weather,
                    timezone: responseJson.timezone,
                });
            }).
            catch((error) => {
                console.error(error);
            });
    };

    renderTime() {
        const {sun} = this.props;
        const {timezone} = this.state;
        const start = moment(sun.start).tz(timezone).format('HH:mm');
        const end = moment(sun.end).tz(timezone).format('HH:mm');
        const goldenHour = moment(sun.goldenHour).tz(timezone).format('HH:mm');
        return (
            <View style={styles.time}>
                <AppText
                    fontText={'SF-Pro-Display-Medium'}
                    style={{fontSize: 17}}
                    value={start}
                />
                <AppText
                    fontText={'SF-Pro-Display-Medium'}
                    style={{fontSize: 17}}
                    value={goldenHour}
                />
                <AppText
                    fontText={'SF-Pro-Display-Medium'}
                    style={{fontSize: 17}}
                    value={end}
                />
            </View>
        );
    }

    renderTop() {
        const {isRiseSet, screenProps} = this.props;
        const title = (
            <AppText

                fontText={'SF-Pro-Display-Medium'}
                style={styles.titleTop}
                value={screenProps.intl.formatMessage({id: isRiseSet, defaultMessage: isRiseSet})}
            />
        );
        const image = (
            <View style={styles.image}>
                {
                    isRiseSet === 'Sunrise' ?
                        <Image
                            source={sunriseImage}
                            style={{width: null, flex: 1}}
                        /> : <Image
                            source={sunsetImage}
                            style={{width: null, flex: 1}}
                        />
                }
            </View>
        );
        const text = (
            <View style={styles.text} >
                <AppText
                    fontText={'SF-Pro-Display-Medium'}
                    style={{fontSize: 15}}
                    value={screenProps.intl.formatMessage({id: 'begin', defaultMessage: 'Begin'})}
                />
                <AppText
                    fontText={'SF-Pro-Display-Medium'}
                    style={{fontSize: 15}}
                    value={screenProps.intl.formatMessage({id: isRiseSet, defaultMessage: isRiseSet})}
                />
                <AppText
                    fontText={'SF-Pro-Display-Medium'}
                    style={{fontSize: 15}}
                    value={screenProps.intl.formatMessage({id: 'end', defaultMessage: 'End'})}
                />
            </View>
        );
        return (
            <React.Fragment>
                {title}
                {this.renderTime()}
                {image}
                {text}
            </React.Fragment>
        );
    }

    renderIconWeather() {
        const {weather} = this.state;
        const {icon} = weather;
        return (
            <React.Fragment>
                {weatherIcons[icon]}
            </React.Fragment>
        );
    }
    renderBottom() {
        const {weather} = this.state;
        const {temp, wind, summary, visibility, cloudCover, precipProbability} = weather;
        const {screenProps} = this.props;
        return (
            <View style={styles.weather}>
                <View style={styles.summary}>
                    {this.renderIconWeather()}
                    {
                        summary !== '' &&
                        <AppText
                            fontText={'SF-Pro-Display-Medium'}
                            style={{fontSize: 17}}
                            value={summary}
                        />
                    }
                    <View style={{flexDirection: 'row'}}>
                        <AppText
                            fontText={'SF-Pro-Display-Light'}
                            style={{fontSize: 17}}
                            value={screenProps.intl.formatMessage({id: 'chance_of_rain', defaultMessage: 'Chance of rain:'})}
                        />
                        <AppText
                            fontText={'SF-Pro-Display-Light'}
                            style={{fontSize: 17}}
                            value={' ' + precipProbability + '%'}
                        />
                    </View>
                </View>
                <View style={styles.elementContainer}>
                    <View style={styles.elementWeather}>
                        <Icon
                            type={'System'}
                            name={'temperature'}
                            size={22}
                            color={'rgba(36, 37, 61, 0.5)'}
                        />

                        <AppTextSpecial
                            style={styles.value}
                            value={temp}
                        />
                    </View>
                    <View style={styles.right}/>
                    <View style={styles.elementWeather}>
                        <Icon
                            type={'System'}
                            name={'cloud'}
                            size={22}
                            color={'rgba(36, 37, 61, 0.5)'}
                        />

                        <AppText
                            style={styles.value}
                            value={cloudCover + '%'}
                        />
                    </View>
                    <View style={styles.right}/>

                    <View style={styles.elementWeather}>
                        <Icon
                            type={'System'}
                            name={'eye'}
                            size={22}
                            color={'rgba(36, 37, 61, 0.5)'}
                        />

                        <View style={styles.unit}>
                            <AppText
                                style={styles.value}
                                value={visibility}
                            />
                            <AppText
                                style={styles.km}
                                value={' km'}
                            />
                        </View>
                    </View>
                    <View style={styles.right}/>
                    <View style={styles.elementWeather}>
                        <Icon
                            type={'System'}
                            name={'wind'}
                            size={22}
                            color={'rgba(36, 37, 61, 0.5)'}
                        />
                        {/* <Image
                            source={require('assets/images/golden_moment/wind.png')}
                            style={{width: 22, height: 22}}
                            resizeMode={'contain'}
                        /> */}
                        <View style={styles.unit}>
                            <AppText
                                style={styles.value}
                                value={wind}
                            />
                            <AppText
                                style={styles.km}
                                value={' km/h'}
                            />
                        </View>
                    </View>
                </View>
            </View>
        );
    }
    render() {
        return (
            <View style={styles.container}>
                {this.renderTop()}
                {this.renderBottom()}
            </View>
        );
    }
}

RiseSet.propTypes = {
    isRiseSet: PropTypes.string,
    location: PropTypes.object,
    onToggleNoti: PropTypes.func,
    screenProps: PropTypes.object,
    sun: PropTypes.object,
    changeTimezone: PropTypes.func,
};

export default RiseSet;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingTop: 20,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
        elevation: 5,
        backgroundColor: '#FFF',
        borderRadius: 8,
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 2,
    },
    titleTop: {
        fontSize: 17,
        color: '#FC7901',
        marginBottom: 30,
    },
    image: {
        width: Device.screen.width - 40,
        height: ((Device.screen.width - 40) * 59) / 335,
    },
    time: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    text: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    weather: {
        borderTopColor: '#EFEFEF',
        borderTopWidth: 1,
        marginTop: 30,
        paddingBottom: 36,
    },
    summary: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    elementContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',

        marginLeft: 30,
        marginRight: 30,
    },
    elementWeather: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    right: {
        width: 1,
        backgroundColor: '#EFEFEF',
        marginTop: 15,
    },
    unit: {
        flexDirection: 'row',
    },
    value: {
        fontSize: 20,
        marginTop: 10,
        color: 'rgba(36, 37, 61, 0.5)',
    },
    km: {
        fontSize: 17,
        marginTop: 12,
        color: 'rgba(36, 37, 61, 0.5)',
    },
});
