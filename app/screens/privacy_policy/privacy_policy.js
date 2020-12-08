/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import AppText from 'app/components/app_text';
import * as data from './data.json';

const dt = data.en;

class PrivacyPolicy extends React.PureComponent<Props> {
    static navigationOptions = ({screenProps}) => {
        return {
            headerTitle: (
                <AppText
                    fontText={'SF-Pro-Display-Medium'}
                    style={{fontSize: 17}}
                    value={screenProps.intl.formatMessage({id: 'privacy_policy', defaultMessage: 'Privacy policy'})}
                />
            ),
        };
    };

    renderItem(item, index, str) {
        const {title, des, detail, list} = item;

        return (
            <View
                style={str === 'detail' ? styles.detail : styles.item}
                key={index}
            >
                {
                    title &&
                    <AppText
                        fontText={'SF-Pro-Display-Medium'}
                        style={str === 'detail' ? styles.titleDetail : styles.title}
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
                {
                    detail &&
                    item.detail.map((i, index) => {
                        return this.renderItem(i, index, 'detail');
                    })
                }
                {
                    list &&
                        list.map((l, index) => {
                            return (
                                <View
                                    style={styles.list}
                                    key={index}
                                >
                                    <Text style={{fontSize: 10}}>{'\u2B24'}</Text>
                                    <AppText
                                        fontText={'SF-Pro-Display-Light'}
                                        style={{fontSize: 17, marginLeft: 5}}
                                        value={l}
                                    />
                                </View>
                            );
                        })
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
                    style={{fontSize: 17, textAlign: 'justify', color: '#FF9500'}}
                    value={dt.header.time}
                />
                <AppText
                    fontText={'SF-Pro-Display-Light'}
                    style={{fontSize: 17, textAlign: 'justify'}}
                    value={dt.header.des}
                />
                {
                    dt.body.map((i, index) => {
                        return this.renderItem(i, index);
                    })
                }
            </ScrollView>
        );
    }
}
export default PrivacyPolicy;

const styles = StyleSheet.create({
    container: {
        padding: 10,
        paddingBottom: 20,
    },
    item: {
        paddingBottom: 20,
    },
    detail: {
        marginBottom: 20,
    },
    title: {
        fontSize: 17,
        textAlign: 'center',
        marginBottom: 15,
    },
    titleDetail: {
        fontSize: 17,
        marginBottom: 10,
    },
    des: {
        fontSize: 17,
        textAlign: 'justify',
    },
    list: {
        flexDirection: 'row',
        marginTop: 5,

        // alignItems: 'center',
    },
});
