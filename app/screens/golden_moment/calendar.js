/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {Calendar} from 'react-native-calendars';
import HeaderRight from 'app/components/common/header_right';
import AppText from 'app/components/app_text';
import {loadBannerAd} from 'app/firebase/admob';
import BannerFbAds from 'app/firebase/facebookads/bannerView';

class CalendarComponent extends React.PureComponent<Props> {
    constructor(props) {
        super(props);
        const {navigation} = props;
        this.state = {
            date: navigation.getParam('date'),
            today: new Date(),
        };
    }

    static navigationOptions = ({navigation, screenProps}) => {
        return {
            headerTitle: <AppText
                fontText={'SF-Pro-Display-Medium'}
                style={{fontSize: 17}}
                value={screenProps.intl.formatMessage({id: 'calendar', defaultMessage: 'Calendar'})}
            />,
            headerRight: (
                <HeaderRight
                    id='done'
                    defaultMessage='Done'
                    textStyle={{fontWeight: '500'}}
                    onPress={() => navigation.goBack()}
                />
            ),
        };
    };

    onDayPress(day) {
        const {dateString} = day;
        const {navigation} = this.props;
        navigation.state.params.onDayPress(dateString);
        this.setState({
            date: dateString,
        });
    }
    render() {
        const {date} = this.state;

        const markedDates = {};
        markedDates[date] = {selected: true, selectedColor: '#FF9500'};
        return (
            <View style={styles.container}>
                <Calendar
                    current={date}
                    markedDates={markedDates}
                    onDayPress={(day) => this.onDayPress(day)}
                    onDayLongPress={(day) => this.onDayPress(day)}
                    monthFormat={'yyyy MM'}
                    hideExtraDays={true}
                    disableMonthChange={true}
                    firstDay={1}
                    hideDayNames={true}
                    onPressArrowLeft={(substractMonth) => substractMonth()}
                    onPressArrowRight={(addMonth) => addMonth()}
                    theme={{
                        arrowColor: '#FF9500',
                        todayTextColor: '#FF9500',
                    }}

                />
                {/* {loadBannerAd()} */}
                <BannerFbAds/>
            </View>
        );
    }
}

CalendarComponent.propTypes = {
    navigation: PropTypes.object,
};
export default CalendarComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',

        // alignItems: 'center',
        // justifyContent: 'center',
    },
});
