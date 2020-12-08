/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import PropTypes from 'prop-types';

import AppIcon from 'assets/icons/AppIcon';
import {moderateScale, verticalScale} from 'app/utils/scaling';
import FormattedText from 'app/components/formatted_text';
import Device from '../utils/device';
import AppText from './app_text';

class Header extends React.PureComponent {
    static propTypes = {
        title: PropTypes.string,
        defaultTitle: PropTypes.string,
        rightIconName: PropTypes.string,
        leftIconName: PropTypes.string,
        isSearchBar: PropTypes.bool,
    };

    static defaultProps = {
        title: 'screenHeader.title.defaultTitle',
        defaultTitle: 'Header',
        rightIconColor: '#24253D',
        leftIconColor: '#24253D',
        leftIconName: 'back',
        fontText: 'SF-Pro-Display-Thin',
        leftIconSize: 24,
        rightIconSize: (24),
        isSearchBar: false,
    };

    render() {
        const {
            title,
            defaultTitle,
            rightIconName,
            onRightIcon,
            containerStyle,
            rightIconColor,
            leftIconName,
            onLeftIcon,
            leftIconColor,
            titleStyle,
            rightIconStyle,
            rightIconSize,
            fontText,
            rightText,
            rightTextStyle,
            fontRightText,
            leftIconSize,
        } = this.props;

        let LeftIcon = null;
        if (leftIconName) {
            LeftIcon = (
                <TouchableOpacity
                    style={styles.iconLeftContainer}
                    onPress={onLeftIcon}
                >
                    <AppIcon
                        color={leftIconColor}
                        name={leftIconName}
                        size={leftIconSize}
                    />
                </TouchableOpacity>
            );
        }

        return (
            <View style={[styles.container, containerStyle]}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {LeftIcon}
                    {
                        title !== '' &&
                            <Text
                                style={[
                                    styles.title,
                                    {
                                        paddingLeft: !LeftIcon ? 20 : 0,
                                    },
                                    titleStyle,
                                ]}
                                numberOfLines={1}
                                adjustsFontSizeToFit={true}
                            >
                                <AppText fontText={fontText}>
                                    <FormattedText
                                        id={title}
                                        defaultMessage={defaultTitle}
                                    />
                                </AppText>
                            </Text>
                    }
                </View>
                <TouchableOpacity
                    style={styles.btnContainer}
                    onPress={onRightIcon}
                >
                    {Boolean(rightIconName) && (
                        <View
                            style={rightIconStyle}
                            onPress={onRightIcon}
                        >
                            <AppIcon
                                name={rightIconName}
                                color={rightIconColor}
                                size={rightIconSize}
                            />
                        </View>
                    )}
                    {
                        Boolean(rightText) && (
                            <View >
                                <Text
                                    style={[{fontSize: 17, fontWeight: '300'}, rightTextStyle]}
                                    numberOfLines={1}
                                    adjustsFontSizeToFit={true}
                                >
                                    <AppText fontText={fontRightText}>
                                        <FormattedText
                                            id={rightText}
                                            defaultMessage={rightText}
                                        />
                                    </AppText>
                                </Text>
                            </View>
                        )
                    }
                </TouchableOpacity>

            </View>
        );
    }
}

export default Header;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 54,
        paddingTop: 12,
        paddingRight: 10,
    },
    title: {
        fontSize: (34),
        fontWeight: '400',
        includeFontPadding: false,
    },
    btnContainer: {
        height: '100%',
        flexDirection: 'row',
        paddingLeft: (16),
        paddingRight: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    iconLeftContainer: {
        height: '100%',
        paddingLeft: (20),
        paddingRight: (16),
        justifyContent: 'center',

        // alignItems: 'center',
    },

    searchBar: {
        width: (300),
        height: (36),
        borderRadius: (5),
        backgroundColor: '#dfe6e9',
        borderColor: '#b2bec3',
    },
});
