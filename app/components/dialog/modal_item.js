/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import AppIcon from '../../../assets/icons/AppIcon';
import PropTypes from 'prop-types';
// import commonStyle from '../../themes/CommonStyle.style';

import FormattedText from 'app/components/formatted_text';

export default class ModalItem extends React.Component {
    static propTypes = {
        name: PropTypes.string,
        title: PropTypes.string,
        func: PropTypes.func,
        style: PropTypes.object,
        containerStyle: PropTypes.object,
        iconContainer: PropTypes.object,
    };
    static defaultProps = {
        name: 'home',
        title: 'home',
        func: () => {
            return null;
        },
        style: null,
        containerStyle: null,
        iconContainer: null,
    };

    render() {
        const {title, containerStyle, iconContainer, style, name} = this.props;
        return (
            <TouchableHighlight
                onPress={this.props.func}
                underlayColor='#e9e9e9'
            >
                <View style={[styles.item, containerStyle]}>
                    <View style={[styles.leftItem, iconContainer]}>
                        <AppIcon
                            name={name}
                            size={18}
                            style={[style]}
                        />
                    </View>
                    <View style={styles.bodyItem}>
                        <Text
                            style={[style]}
                            numberOfLines={1}
                            adjustsFontSizeToFit={true}
                            ellipsizeMode='tail'
                        >
                            <FormattedText
                                id={title}
                                defaultMessage={title}
                            />
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        height: 56,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    leftItem: {
        justifyContent: 'center',
        borderBottomColor: '#e9e9e9',
        borderBottomWidth: 0.25,
        flex: 1,
    },
    bodyItem: {
        borderBottomColor: '#e9e9e9',
        borderBottomWidth: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        flex: 10,
    },
});