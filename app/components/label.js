/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import PropTypes from 'prop-types';

import {moderateScale} from 'app/utils/scaling';
import FormattedText from 'app/components/formatted_text';
import AppText from './app_text';

class Label extends React.PureComponent {
    static propTypes = {
        labelTitle: PropTypes.string,
        defaultTitle: PropTypes.string,
    };

    static defaultProps = {
        labelTitle: 'screenBody.title.defaultLabel',
        defaultTitle: 'Label Title',
    };

    render() {
        const {labelTitle, defaultTitle} = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.lineStyle}/>
                <Text
                    style={styles.text}
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}
                >
                    <AppText fontText={'SF-Pro-Display-Thin'}>
                        <FormattedText
                            id={labelTitle}
                            defaultMessage={defaultTitle}
                        />
                    </AppText>
                </Text>
            </View>
        );
    }
}

export default Label;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        // height: moderateScale(20),
        paddingLeft: moderateScale(20),
        alignItems: 'center',
        // paddingTop: moderateScale(30),
        paddingBottom: moderateScale(10),
        paddingVertical: 20,
    },

    lineStyle: {
        height: 20,
        borderColor: '#e53d01',
        borderLeftWidth: moderateScale(3),
        paddingRight: moderateScale(10),
    },

    text: {
        fontSize: moderateScale(20),
        color: '#24253D',
    },
});