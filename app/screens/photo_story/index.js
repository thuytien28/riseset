/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

class PhotoStory extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>PhotoStory</Text>
            </View>
        );
    }
}

export default PhotoStory;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
