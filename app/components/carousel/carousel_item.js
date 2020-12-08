/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

/* eslint-disable multiline-ternary */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

import FastImage from 'react-native-fast-image';

import AppIcon from 'assets/icons/AppIcon';
import FormattedDate from '../formatted_date';
import FormattedTime from '../formatted_time';
import AppText from 'app/components/app_text';

class CarouselItem extends React.PureComponent<Props> {
    static propTypes = {
        item: PropTypes.object,
    };
    static defaultProps = {}

    renderTime(item) {
        const dateProps = {
            value: item.photoTakenTime,
            month: 'short',
            day: '2-digit',
            style: styles.photoTakenTime,
        };
        const CURRENT_YEAR = new Date().getFullYear();
        const STORY_YEAR = new Date(item.photoTakenTime).getFullYear();

        if (CURRENT_YEAR !== STORY_YEAR) {
            dateProps.year = 'numeric';
        }

        return (
            <View
                style={styles.timeCtn}
            >
                <View style={{flexDirection: 'row'}}>
                    <FormattedDate
                        {...dateProps}
                    />
                    <Text>{' '}</Text>
                    <FormattedTime
                        value={item.photoTakenTime}
                        hour12={true}
                        style={styles.photoTakenTime}
                    />
                </View>
                {
                    (item.isRiseSet.toLowerCase() === 'sunrise') ?
                        <AppIcon
                            name={'sun-rise'}
                            color={'#FFF'}
                            size={24}
                        /> :
                        <AppIcon
                            name={'sun-set'}
                            color={'#FFF'}
                            size={24}
                        />
                }
            </View>
        );
    }

    renderBottom = (item) => {
        const formattedLocationName = item.locationName ? item.locationName : '';
        let Signature = null;
        if (item.signature) {
            Signature = (
                <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}
                    style={{
                        color: '#FFF',
                        fontFamily: item.signatureFont ? item.signatureFont : null,
                    }}
                >
                    {item.signature}
                </Text>
            );
        }
        return (
            <View
                style={styles.bottomCtn}
            >
                <AppText
                    numberOfLines={2}
                    adjustsFontSizeToFit={true}
                    style={styles.address}
                >
                    {formattedLocationName}
                </AppText>
                {/* <FormattedTime
                    value={item.photoTakenTime}
                    hour12={true}
                    style={styles.hours}
                /> */}
                {Signature}
            </View>
        );
    }

    render() {
        const {item, imgCtn} = this.props;
        const {images} = item;
        const image = images ? images[0].url : '';
        return (
            <>
                <FastImage
                    style={[styles.storieImage, imgCtn]}
                    source={{
                        uri: image,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
                {this.renderTime(item)}
                {this.renderBottom(item)}
            </>
        );
    }
}
export default CarouselItem;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timeCtn: {
        height: 100,
        width: 100,
        position: 'absolute',
        top: 10,
        left: 10,
    },
    storieImage: {
        borderRadius: 10,
        flex: 1,
    },

    photoTakenTime: {
        fontSize: (15),
        color: '#FFF',
    },

    bottomCtn: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        padding: 10,
        paddingBottom: 10,
    },

    address: {
        fontFamily: 'BaiJamjuree-Medium',
        color: '#FFF',
    },
});
