/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {View, StyleSheet} from 'react-native';

import FastImage from 'react-native-fast-image';

import PropTypes from 'prop-types';
import AppText from 'app/components/app_text';

class Avatar extends React.PureComponent<Props> {
    static propTypes = {
        ava: PropTypes.string,
        name: PropTypes.string,
        hideOrangeCirlce: PropTypes.bool,
    };
    static defaultProps = {}
    render() {
        const {ava, name, hideOrangeCirlce} = this.props;

        return (
            <View style={styles.avaContainer}>
                <View style={hideOrangeCirlce ? {} : styles.background1}>
                    <View style={hideOrangeCirlce ? {} : styles.background2}>
                        <View style={styles.background3}>
                            <FastImage
                                style={styles.ava}
                                source={{uri: ava}}
                            />
                        </View>
                    </View>
                </View>
                {
                    name &&
                    <AppText
                        fontText={'SF-Pro-Display-Medium'}
                        style={styles.username}
                        value={name}
                    />
                }
            </View>
        );
    }
}
export default Avatar;

const styles = StyleSheet.create({
    avaContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    background1: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 131,
        height: 131,
        borderRadius: 66,
        backgroundColor: 'rgba(255, 195, 151, 0.2)',

    },
    background2: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 101.8,
        height: 101.8,
        borderRadius: 52,
        backgroundColor: 'rgba(252, 121, 1, 0.25)',
    },
    background3: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 85.23,
        height: 85.23,
        borderRadius: 43,
        backgroundColor: '#FFF',
    },
    ava: {
        width: 73.39,
        height: 73.39,
        borderRadius: 37,
    },
    username: {
        fontSize: 20,
        marginTop: 10,
        fontSize: 20,
    },
});
