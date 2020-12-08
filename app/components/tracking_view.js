/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

class TrackingView extends React.PureComponent {
    render() {
        return (
            <View style={styles.container}>
                {this.props.children}
            </View>

        );
    }
}
export default TrackingView;

const styles = StyleSheet.create({
    container: Platform.select({
        ios: {
        },
        android: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
        },
    }),
});
