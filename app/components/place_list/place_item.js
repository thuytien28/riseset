/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';

import AppText from 'app/components/app_text';
import Icon from 'app/components/icon';

class PlaceItem extends React.PureComponent {
    static propTypes = {
        onPress: PropTypes.func,
        place: PropTypes.object,
        lastImageVisible: PropTypes.bool,
    };

    render() {
        const {place, onPress, lastImageVisible} = this.props;
        let Left = (
            <FastImage
                style={styles.leftItem}
                source={{uri: place.lastImage}}
            />
        );

        if (lastImageVisible === false) {
            Left = (
                <View style={styles.iconCtn}>
                    <Icon
                        type={'System'}
                        name={'place'}
                        size={17}
                    />
                </View>
            );
        }

        return (
            <TouchableOpacity
                style={[styles.container]}
                onPress={() => onPress(place)}
            >
                {Left}
                <View style={styles.centerItem}>
                    <AppText
                        style={styles.title}
                        numberOfLines={1}
                        ellipsizeMode={'tail'}
                        fontText={'SF-Pro-Display-Semibold'}
                        value={place.location.name}
                    />
                    <AppText
                        numberOfLines={1}
                        style={styles.placeDetail}
                        ellipsizeMode={'tail'}
                        fontText={'SF-Pro-Display-Regular'}
                        value={place.location.address}
                    />
                </View>
                <View style={styles.rightItem}/>
            </TouchableOpacity>
        );
    }
}

export default PlaceItem;

const styles = StyleSheet.create({
    container: {
        height: 50,
        flexDirection: 'row',
        paddingHorizontal: 20,
        borderRadius: 2,
    },
    centerItem: {
        flex: 1,
        paddingLeft: (20),
        justifyContent: 'center',
    },

    leftItem: {
        width: (50),
        height: (50),
        borderRadius: 2,
    },

    title: {
        fontSize: 16,
        fontWeight: '600',
    },

    rightItem: {
        width: (23),
    },

    placeDetail: {
        fontSize: 13,
        color: 'rgba(36, 37, 61, 0.5)',
    },
    iconCtn: {
        height: '100%',
        justifyContent: 'center',
    },
});