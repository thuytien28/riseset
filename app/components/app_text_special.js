/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import {Text, StyleSheet, View} from 'react-native';

import PropTypes from 'prop-types';
import Device from 'app/utils/device';

class AppTextSpecial extends React.PureComponent {
    static propTypes = {
        adjustsFontSizeToFit: PropTypes.bool,
        children: PropTypes.any,
        fontText: PropTypes.string,
        isSignature: PropTypes.bool,
        numberOfLines: PropTypes.number,
        style: PropTypes.object,
        value: PropTypes.string,
    };
    static defaultProps = {
        fontText: 'SF-Pro-Display-Regular',
        adjustsFontSizeToFit: false,
    }
    render() {
        const {fontText, value, children, style, numberOfLines, adjustsFontSizeToFit, isSignature} = this.props;
        let fontFamily = null;

        if (isSignature) {
            fontFamily = style.fontFamily;
        } else if (Device.os === 'android') {
            fontFamily = fontText || style.fontFamily;
        }

        return (
            <Text
                {...this.props}
                numberOfLines={numberOfLines}
                adjustsFontSizeToFit={adjustsFontSizeToFit}
                style={[style, {
                    fontFamily,
                }]}
            >
                {value || children}&deg;{'C'}

            </Text>
        );
    }
}

export default AppTextSpecial;