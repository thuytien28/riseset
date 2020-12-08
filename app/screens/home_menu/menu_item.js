/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

import FormattedText from 'app/components/formatted_text';
import AppIcon from 'assets/icons/AppIcon';
import {moderateScale} from '../../utils/scaling';
import Device from 'app/utils/device';
import AppText from '../../components/app_text';

const MenuItem = (props) => {
    const {
        onItem,
        rightIconName,
        title,
        defaultTitle,
        iconColor,
        image,
        containerStyle,
    } = props;

    let Left = null;
    if (image) {
        Left = image;
    } else {
        Left = (
            <AppIcon
                name={rightIconName}
                size={moderateScale(25)}
                color={iconColor}
            />
        );
    }
    return (
        <TouchableOpacity
            style={[styles.container, containerStyle]}
            onPress={onItem}
        >
            <View style={styles.leftContaianer}>{Left}</View>
            <Text
                style={styles.title}
                numberOfLines={1}
                adjustsFontSizeToFit={true}
            >
                <AppText>
                    <FormattedText
                        id={title}
                        defaultMessage={defaultTitle}
                    />
                </AppText>
            </Text>
        </TouchableOpacity>
    );
};

export default MenuItem;

const styles = StyleSheet.create({
    container: {
        height: moderateScale(36),
        flexDirection: 'row',
        paddingLeft: moderateScale(34),
        alignItems: 'center',
        marginBottom: moderateScale(40),
        width: '100%',
    },

    leftContaianer: {
        borderRadius: moderateScale(5),
        height: moderateScale(36),
        width: moderateScale(36),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },

    title: {
        color: '#24253D',
        fontSize: moderateScale(17),
        paddingLeft: moderateScale(10),
    },
});
