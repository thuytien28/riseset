/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';

import {injectIntl} from 'react-intl';
import {StyleSheet, TouchableOpacity, Platform} from 'react-native';
import PropTypes from 'prop-types';
import AppText from 'app/components/app_text';
import Icon from 'app/components/icon';
import {changeOpacity} from 'app/utils/theme';

class HeaderRight extends React.PureComponent<Props> {
    static propTypes = {
        defaultMessage: PropTypes.string,
        id: PropTypes.string,
        intl: PropTypes.object,
        onPress: PropTypes.func,
        textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
        iconName: PropTypes.string,
        iconSize: PropTypes.number,
        iconColor: PropTypes.string,
        iconType: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
    }

    onPress = () => {
        const {loading, onPress} = this.props;
        if (loading) {
            this.setState({loading: true});
        }
        onPress();
    }

    render() {
        const {id, defaultMessage, intl, textStyle, iconName, iconSize, iconColor, iconType} = this.props;
        const {loading} = this.state;
        let Content = null;

        if (iconName) {
            Content = (
                <Icon
                    type={iconType}
                    name={iconName}
                    size={iconSize}
                    color={iconColor}
                />
            );
        } else {
            Content = (
                <AppText
                    value={intl.formatMessage({id, defaultMessage})}
                    style={[styles.text, textStyle, {
                        color: loading ? changeOpacity('#000', 0.5) : '#FF3B30',
                    }]}
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}
                    fontText={'SP-Pro-Display-Medium'}
                />
            );
        }
        return (
            <TouchableOpacity
                onPress={() => this.onPress()}
                style={[styles.container]}
                disabled={loading}
            >
                {Content}
            </TouchableOpacity>
        );
    }
}
export default injectIntl(HeaderRight, {withRef: true});

const styles = StyleSheet.create({
    container: {
        height: '100%',
        paddingHorizontal: Platform.select({
            ios: 10,
            android: 16,
        }),
        justifyContent: 'center',
    },
    text: {
        color: '#FF3B30',
        fontSize: 17,
        fontWeight: '500',
    },
});
