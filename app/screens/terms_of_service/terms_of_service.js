/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import AppText from 'app/components/app_text';
import * as data from './data.json';

const dt = data.en;

class TermsOfService extends React.PureComponent<Props> {
    static navigationOptions = ({screenProps}) => {
        return {
            headerTitle: (
                <AppText
                    fontText={'SF-Pro-Display-Medium'}
                    style={{fontSize: 17}}
                    value={screenProps.intl.formatMessage({id: 'terms_of_service', defaultMessage: 'Terms of Service'})}
                />
            ),
        };
    };

    renderItem(item, index) {
        const {title, des} = item;

        return (
            <View
                style={styles.item}
                key={index}
            >
                {
                    title &&
                    <AppText
                        fontText={'SF-Pro-Display-Medium'}
                        style={styles.title}
                        value={title}
                    />
                }
                {
                    des &&
                    <AppText
                        fontText={'SF-Pro-Display-Light'}
                        style={styles.des}
                        value={des}
                    />
                }
            </View>
        );
    }
    render() {
        return (

            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <AppText
                    fontText={'SF-Pro-Display-Light'}
                    style={{fontSize: 17, textAlign: 'justify'}}
                    value={dt.header.des}
                />
                {
                    dt.list.map((i, index) => {
                        return this.renderItem(i, index);
                    })
                }
            </ScrollView>
        );
    }
}
export default TermsOfService;

const styles = StyleSheet.create({
    container: {
        padding: 10,
        paddingBottom: 20,
    },
    item: {
        marginTop: 15,
    },
    title: {
        fontSize: 17,
        marginBottom: 15,
    },
    des: {
        fontSize: 17,
        textAlign: 'justify',
    },
});
