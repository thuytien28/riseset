/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import PropTypes from 'prop-types';
import AppIcon from 'assets/icons/AppIcon';
import AppText from 'app/components/app_text';
import Slider from 'react-native-slider';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Device from 'app/utils/device';
import HeaderRight from 'app/components/common/header_right';

class Custom extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            timeSunrise: 60,
            timeSunset: 60,
            max: 60,
            isRemindSunrise: false,
            isRemindSunset: false,
            modalVisible: false,
        };
    }

    static navigationOptions = ({ navigation, screenProps }) => {
        const { params = {} } = navigation.state;
        return {
            headerTitle: <AppText
                fontText={'SF-Pro-Display-Medium'}
                style={{ fontSize: 17 }}
                value={screenProps.intl.formatMessage({ id: 'goldenMoment.reminder', defaultMessage: 'Reminder' })}
            />,
            headerRight: (
                <HeaderRight
                    id='save'
                    defaultMessage='Save'
                    onPress={() => {
                        params.handleThis();
                    }}
                />
            ),
            headerStyle: {
                marginBottom: 33,
            },
        };
    };

    componentDidMount() {
        const { navigation } = this.props;
        const remind = navigation.getParam('remind');
        this.props.navigation.setParams({
            handleThis: this.onSave.bind(this),
        });

        if (remind) {
            const { isRemindSunrise, isRemindSunset, timeSunrise, timeSunset } = remind;

            this.setState({
                isRemindSunrise,
                isRemindSunset,
                timeSunrise,
                timeSunset,
            });
        }
    }
    onChangeValue(str, val) {
        if (str === 'Sunrise') {
            this.setState({
                timeSunrise: 60 - val,
            });
        } else {
            this.setState({
                timeSunset: 60 - val,
            });
        }
    }
    renderItem(str, time) {
        const { screenProps } = this.props;
        const { isRemindSunrise, isRemindSunset } = this.state;
        const value = str === 'Sunrise' ? isRemindSunrise : isRemindSunset;
        const title = str === 'Sunrise' ? 'Sunrise notification' : 'Sunset notification';
        const color = str === 'Sunrise' ? '#FC7901' : '#B00E00';
        const icon = str === 'Sunrise' ? require('assets/images/sunrise.png') : require('assets/images/sunset.png');

        const marginLeft = time ? ((60 - Math.abs(time)) * 4) - (60 - Math.abs(time)) : 0;

        // const marginLeft = 0;

        return (
            <View style={styles.bodyItem}>
                <View style={styles.title}>
                    <View style={{ flexDirection: 'row' }}>
                        <AppIcon
                            name={'bell'}
                            color={'#ba2e22'}
                            size={15}
                        />
                        <AppText
                            fontText={'SF-Pro-Display-Regular'}
                            style={styles.sunrise}
                            value={screenProps.intl.formatMessage({ id: 'goldenMoment.title', defaultMessage: title })}
                        />
                    </View>

                    <Switch
                        style={styles.switchWrapper}
                        thumbColor={'#FFF'}
                        trackColor={{ true: '#4CD964' }}
                        onValueChange={(v) => this.toggleSwitch(str, v)}
                        value={value}
                    />
                </View>

                <View style={styles.sliderContainer} >
                    <Slider
                        style={styles.slider}
                        value={60 - time}
                        minimumValue={0}
                        maximumValue={60}
                        step={1}
                        minimumTrackTintColor='#EFEFEF'
                        maximumTrackTintColor='#EFEFEF'
                        trackStyle={styles.trackStyle}
                        thumbStyle={styles.thumbStyle}
                        thumbImage={icon}
                        onValueChange={(val) => this.onChangeValue(str, val)}
                    />
                    <View style={styles.iconSun}>
                        <AppIcon
                            name={'sun-rise'}
                            color={'#EFEFEF'}
                            size={30}
                        />
                    </View>
                    <View style={[styles.rightSilder, { backgroundColor: color }]} />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.time}>
                        {/* {
                            time
                        } */}
                        <AppText
                            fontText={'SF-Pro-Display-Regular'}
                            style={{ fontSize: 17, width: 32 }}
                            value={"-60'"}
                        />

                        {
                            time != 0 && time != 60 &&
                            <AppText
                                fontText={'SF-Pro-Display-Regular'}
                                style={{ fontSize: 17, marginLeft }}
                                value={'-' + time + "'"}
                            />
                        }

                    </View>
                    <AppText
                        fontText={'SF-Pro-Display-Regular'}
                        style={{ fontSize: 15 }}
                        value={screenProps.intl.formatMessage({ id: str, defaultMessage: str })}
                    />
                </View>
            </View>
        );
    }

    toggleSwitch = (str, value) => {
        if (str === 'Sunrise') {
            this.setState({
                isRemindSunrise: value,
            });
        } else {
            this.setState({
                isRemindSunset: value,
            });
        }
    }

    onSave() {
        const { navigation } = this.props;
        const { timeSunrise, timeSunset, isRemindSunrise, isRemindSunset } = this.state;
        navigation.state.params.onToggleRemind(timeSunrise, timeSunset, isRemindSunrise, isRemindSunset);
    }

    render() {
        const { timeSunrise, timeSunset } = this.state;

        const { navigation, screenProps } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.item}>
                    {this.renderItem('Sunrise', timeSunrise)}
                    {this.renderItem('Sunset', timeSunset)}
                </View>
                <View style={styles.bottom}>
                    <AppText
                        fontText={'SF-Pro-Display-Regular'}
                        style={styles.text}
                        value={screenProps.intl.formatMessage({ id: 'goldenMoment.bottom_custom', defaultMessage: 'The most effective time to photograph the sunse and sunrise is 30 minutes before and after these two times.' })}
                    />
                    <TouchableOpacity
                        onPress={() => navigation.navigate('MoreInfo')}
                    >
                        <AppText
                            fontText={'SF-Pro-Display-Regular'}
                            style={[styles.text, { color: '#5AC8FA' }]}
                            value={screenProps.intl.formatMessage({ id: 'goldenMoment.more_info', defaultMessage: 'More informations' })}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

Custom.propTypes = {
    navigation: PropTypes.object,
    screenProps: PropTypes.object,
};

export default Custom;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    rightHeader: {
        marginRight: 16,
    },
    item: {
        paddingHorizontal: 10,
    },
    bodyItem: {
        height: ((Device.screen.width - 20) * 151) / 354,
        width: Device.screen.width - 20,
        flexDirection: 'column',
        paddingHorizontal: 10,
        marginBottom: 10,
        borderRadius: 5,
        elevation: 3,
        backgroundColor: '#FFF',
    },
    title: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sunrise: {
        fontSize: 17,
        marginLeft: 10,
        marginTop: -5,
        marginBottom: 20,
    },
    right: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#EFEFEF',
        marginTop: -10,
    },
    switchWrapper: {
        marginTop: -20,
        width: 100,
    },
    sliderContainer: {

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

        // marginTop: 42,
        marginBottom: 15,

        // height: 5,
        // backgroundColor: '#EFEFEF',
        // borderRadius: 8,
    },
    slider: {
        width: ((Device.screen.width - 40) * 233) / 335,
    },
    trackStyle: {
        backgroundColor: '#EFEFEF',
        height: 5,
    },
    thumbStyle: {
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        width: 25,
        height: 25,
    },

    iconSun: {
        marginLeft: -27,
        zIndex: -1,
    },

    rightSilder: {
        width: ((Device.screen.width - 40) * 111) / 335,
        height: 5,
        borderRadius: 5,
        marginLeft: -9,
    },
    time: {
        flexDirection: 'row',
        width: '63%',
        marginLeft: -10,
    },
    bottom: {
        paddingHorizontal: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 13,
    },
});

