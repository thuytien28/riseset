/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

class Header extends React.PureComponent {
    render() {
        const LeftBtn = (
            <TouchableOpacity
                style={styles.iconLeftContainer}
                onPress={onLeftIcon}
            >
                <AppIcon
                    color={leftIconColor}
                    name={leftIconName}
                    size={leftIconSize}
                />
            </TouchableOpacity>
        );
        return (
            <View
                style={styles.container}
            >
                {LeftBtn}
            </View>
        );
    }
}
export default Header;

const styles = StyleSheet.create({
    container: {
        height: 50,
        backgroundColor: 'red',
        width: '100%',
    },
});
