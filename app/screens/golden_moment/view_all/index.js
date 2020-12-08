/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import PropTypes from 'prop-types';
import AppIcon from 'assets/icons/AppIcon';
import AppText from 'app/components/app_text';
import Item from './item';
const tzlookup = require('tz-lookup');

class ViewAll extends React.PureComponent {
    constructor(props) {
        super(props);
        const {navigation} = this.props;
        const location = navigation.getParam('location');
        const timezone = navigation.getParam('timezone');
        const {lat, lng, address} = location;
        this.state = {
            location: {
                address,
                lat,
                lng,
            },
            time: [],
            isFetching: false,
            remind: {
                timeSunrise: 60,
                timeSunset: 60,
                isRemindSunrise: false,
                isRemindSunset: false,
            },
            timezone,
        };
        this.onEndReachedCalledDuringMomentum = true;
    }

    componentDidMount() {
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth();
        const year = today.getFullYear();

        const {navigation} = this.props;
        const remind = navigation.getParam('remind');
        const location = navigation.getParam('location');
        this.props.navigation.setParams({
            handleThis: this.onToggleRemind.bind(this),
        });
        this.setState({
            time: this.getTime(new Date(year, month, day), 'after'),
            location,
            remind,
        });
    }

    static navigationOptions = ({navigation, screenProps}) => {
        const {params = {}} = navigation.state;
        const {remind} = params;

        const {isRemindSunrise, isRemindSunset} = remind;
        const value = Boolean(isRemindSunrise || isRemindSunset);
        const rightIconColor = value ? '#FC7901' : 'rgba(36, 37, 61, 0.5)';
        return {
            headerTitle: (
                <AppText
                    fontText={'SF-Pro-Display-Medium'}
                    style={{fontSize: 17}}
                    value={screenProps.intl.formatMessage({id: 'screenHeader.title.goldenMoment', defaultMessage: 'Golden Moment'})}
                />
            ),

            // headerRight: (
            //     <TouchableOpacity
            //         onPress={() => {
            //             navigation.navigate(
            //                 'Custom',
            //                 {
            //                     remind,
            //                     onToggleRemind: (t1, t2, v1, v2) => params.handleThis(t1, t2, v1, v2),
            //                 }
            //             );
            //         }}
            //         style={styles.remind}
            //     >
            //         <AppIcon
            //             name={'bell'}
            //             color={rightIconColor}
            //             size={20}
            //         />
            //         <AppText
            //             fontText={'SF-Pro-Display-Medium'}
            //             style={{fontSize: 13, marginLeft: 6}}
            //             value={screenProps.intl.formatMessage({id: 'remind', defaultMessage: 'Remind'})}
            //         />
            //     </TouchableOpacity>
            // ),
        };
    };

    onBack() {
        const {navigation} = this.props;
        navigation.goBack();
    }

    renderItem(item) {
        const {location, timezone} = this.state;
        return (
            <Item
                item={item}
                location={location}
                onPressNoti={(d) => this.onPressNoti(d)}
                timezone={timezone}
            />
        );
    }

    getTime(time, str) {
        const arr = [];
        arr.push(time);
        if (str === 'after') {
            for (let i = 1; i < 20; i++) {
                const t = new Date(arr[i - 1]);
                t.setDate(t.getDate() + 1);
                arr.push(t);
            }
        } else {
            for (let i = 1; i < 20; i++) {
                const t = new Date(arr[0]);
                t.setDate(t.getDate() - 1);
                arr.unshift(t);
            }
        }
        return arr;
    }

    onRefresh() {
        const data = this.state.time;
        const tmp = this.getTime(data[0], 'before');
        tmp.pop();
        const newData = tmp.concat(data);
        this.setState({
            time: newData,
            isFetching: false,
        });
    }
    onEndReached() {
        const data = this.state.time;
        const dt = this.getTime(data[data.length - 1], 'after');
        dt.shift();
        const newData = data.concat(dt);
        this.setState({
            time: newData,
        });
    }
    onToggleRemind(timeSunrise, timeSunset, isRemindSunrise, isRemindSunset) {
        const {navigation} = this.props;
        navigation.state.params.onToggleRemind(timeSunrise, timeSunset, isRemindSunrise, isRemindSunset);
        const remind = {
            timeSunrise,
            timeSunset,
            isRemindSunrise,
            isRemindSunset,
        };
        this.props.navigation.setParams({
            remind,
        });
        this.setState({
            remind,
        });
    }

    async chooseExistsLocation(location) {
        const {navigation} = this.props;
        const {lat, lng, name} = location;

        // console.warn(tzlookup(lat, lng));

        this.setState({
            location: {
                lat,
                lng,
                name,
            },
            timezone: tzlookup(lat, lng),
        });

        navigation.state.params.chooseExistsLocation(location);
    }

    renderHeader = () => {
        const {navigation, screenProps} = this.props;
        const user = navigation.getParam('user');
        const {location} = this.state;
        const {name} = location;
        return (
            <View>
                <View style={styles.locationContainer}>
                    <View style={styles.location}>
                        <View style={{marginRight: 10}}>
                            <AppIcon
                                name={'place'}
                                color={'#FC5201'}
                                size={18}
                            />
                        </View>
                        <AppText
                            fontText={'SF-Pro-Display-Medium'}
                            style={styles.textLocation}
                            value={name}
                            numberOfLines={1}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.buttonUpdate}
                        onPress={() => {
                            navigation.navigate(
                                'LocationSearch',
                                {
                                    chooseExistsLocation: (l) => this.chooseExistsLocation(l),
                                    userId: user.id,
                                }
                            );
                        }}
                    >
                        <AppText
                            fontText={'SF-Pro-Display-Regular'}
                            style={styles.update}
                            value={screenProps.intl.formatMessage({id: 'update', defaultMessage: 'Update'})}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.icon}>
                    <AppIcon
                        name={'event'}
                        color={'rgba(36, 37, 61, 0.5)'}
                        size={22}
                    />
                    <AppIcon
                        name={'sun-rise'}
                        color={'rgba(36, 37, 61, 0.5)'}
                        size={22}
                    />
                    <AppIcon
                        name={'moon'}
                        color={'rgba(36, 37, 61, 0.5)'}
                        size={22}
                    />
                </View>
            </View>
        );
    }
    render() {
        const {time} = this.state;

        // const {isRemindSunrise, isRemindSunset} = remind;
        // const value = Boolean(isRemindSunrise || isRemindSunset);
        // const rightIconColor = value ? '#FC7901' : 'rgba(36, 37, 61, 0.5)';

        return (
            <View style={styles.container}>
                {this.renderHeader()}
                <FlatList
                    data={time}
                    renderItem={({item, index}) => this.renderItem(item, index)}
                    keyExtractor={(item, index) => `${index}`}
                    contentContainerStyle={styles.flatlist}
                    onRefresh={() => this.onRefresh()}
                    refreshing={this.state.isFetching}
                    onEndReached={() => this.onEndReached()}
                    onEndReachedThreshold={0.5}
                    onMomentumScrollBegin={() => {
                        this.onEndReachedCalledDuringMomentum = false;
                    }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        );
    }
}

ViewAll.propTypes = {
    navigation: PropTypes.object,
    screenProps: PropTypes.object,
};

export default ViewAll;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    remind: {
        flexDirection: 'row',
        right: 16,
    },
    iconLocation: {
        marginTop: 6,
        marginRight: 10,
    },
    locationContainer: {
        paddingHorizontal: 30,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    location: {
        flexDirection: 'row',
        flex: 1,
        marginRight: 20,
    },
    textLocation: {
        fontSize: 15,
        fontWeight: '300',
    },
    buttonUpdate: {
        width: 75,
        height: 26,
        elevation: 5,
        backgroundColor: '#FFF',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        marginLeft: 10,
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 2,
    },
    update: {
        fontSize: 13,
        color: 'rgba(36, 37, 61, 0.5)',
    },
    icon: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        marginTop: 35,
        marginBottom: 20,
    },
    flatlist: {
        marginBottom: 20,
    },
});
