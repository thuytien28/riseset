/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import ListItems from './list_items';
import AppText from 'app/components/app_text';
class PhotographyTips extends React.PureComponent {
    static navigationOptions = ({screenProps}) => {
        return {
            headerTitle: (
                <AppText
                    style={{fontSize: 17}}
                    value={screenProps.intl.formatMessage({id: 'screenHeader.title.photographyTips', defaultMessage: 'Photography Tips'})}
                />
            ),
        };
    };

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <ListItems/>
            </SafeAreaView>
        );
    }
}

export default PhotographyTips;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
});
