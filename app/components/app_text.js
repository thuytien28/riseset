/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import {Text, StyleSheet, View} from 'react-native';

import PropTypes from 'prop-types';
import Device from 'app/utils/device';

class AppText extends React.PureComponent<Props> {
    static propTypes = {
        adjustsFontSizeToFit: PropTypes.bool,
        children: PropTypes.any,
        fontText: PropTypes.string,
        isSignature: PropTypes.bool,
        numberOfLines: PropTypes.number,
        style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
        value: PropTypes.string,
        specialCharacter: PropTypes.bool,
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
        } else if (Device.os === 'ios' && style && style.fontFamily) {
            fontFamily = style.fontFamily;
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
                {value || children}

            </Text>
        );
    }
}

export default AppText;