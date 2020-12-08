/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
    Image,
    TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';
import AppIcon from '../../../assets/icons/AppIcon';
import AppText from '../../components/app_text';

class Item extends React.PureComponent {
    static propTypes = {
        details: PropTypes.string,
        leftIcon: PropTypes.string,
        logo: PropTypes.string,
        onItem: PropTypes.any,
        onRight: PropTypes.func,

        // rightIcon: PropTypes.string,
        title: PropTypes.string,
        visibleRight: PropTypes.bool,
    };

    static defaultProps = {
        leftIcon: 'place',

        // rightIcon: 'location',
        title: '',
        details: '',
        logo: '',
        visibleRight: false,
    };

    render() {
        return (
            <TouchableOpacity
                onPress={this.props.onItem}
                style={styles.container}
            >
                <View style={styles.left}>
                    <AppIcon
                        name={this.props.leftIcon}
                        size={17}
                        color={'#000'}
                    />
                </View>

                <View style={styles.body}>
                    <AppText
                        numberOfLines={1}
                        ellipsizeMode='tail'
                        fontText={'SF-Pro_Display-Medium'}
                        style={styles.title}
                        value={this.props.title}
                    />

                    <AppText
                        numberOfLines={1}
                        ellipsizeMode='tail'
                        fontText={'SF-Pro_Display-Medium'}
                        style={styles.details}
                        value={this.props.details}
                    />
                </View>

            </TouchableOpacity>
        );
    }
}

export default Item;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
    },
    body: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 20,
        paddingVertical: 10,
    },
    right: {
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    left: {
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    line: {
        borderBottomColor: '#EFEFEF',
        borderBottomWidth: 1,
        marginHorizontal: 20,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
    },
    details: {
        fontSize: 13,
    },
});