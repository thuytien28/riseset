/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import AppText from 'app/components/app_text';
import moment from 'moment';
import SunCalc from '../algorithms/suncalc';
import PropTypes from 'prop-types';

class Item extends React.PureComponent {
    render() {
        const {item, location, timezone} = this.props;
        const {lat, lng} = location;
        const time = moment(item).format('DD/MM');
        const timeSun = timeRiseSet(lat, lng, item, timezone);
        const {sunrise, sunset} = timeSun;

        return (
            <View style={styles.container}>
                <AppText
                    fontText={'SF-Pro-Display-Light'}
                    style={{fontSize: 17, width: 50}}
                    value={time}
                />
                <AppText
                    fontText='SF-Pro-Display-Light'
                    style={{fontSize: 17}}
                    value={sunrise}
                />
                <AppText
                    fontText='SF-Pro-Display-Light'
                    style={{fontSize: 17}}
                    value={sunset}
                />
            </View>
        );
    }
}

Item.propTypes = {
    item: PropTypes.any,
    location: PropTypes.any,
    timezone: PropTypes.any,
};

export default Item;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: (30),
        marginRight: (30),
        marginBottom: (20),
    },
});
const timeRiseSet = (lat, lng, time, timezone) => {
    const today = new Date(time);
    const tomorrow = new Date(time);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const di = SunCalc.getDayInfo(today, tomorrow, lat, lng);
    return {
        sunrise: moment(di.sunrise.goldenHour).tz(timezone).format('HH:mm'),
        sunset: moment(di.sunset.goldenHour).tz(timezone).format('HH:mm'),
    };
};
