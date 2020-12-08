/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    Platform,
} from 'react-native';

import PropTypes from 'prop-types';
import Icon from '../../components/icon';

class SearchBar extends React.PureComponent {
    static propTypes = {
        searchOnChange: PropTypes.func,
        searchPlaceholder: PropTypes.string,
        searchValue: PropTypes.string,
    };

    render() {
        const {searchValue, searchPlaceholder, searchOnChange} = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.searchIcon}>
                    <Icon
                        type='AntDesign'
                        name={'search1'}
                        size={20}
                        color={'rgba(0, 0, 0, 0.36)'}
                    />
                </View>
                <TextInput
                    style={[styles.searchBar]}
                    value={searchValue}
                    placeholder={searchPlaceholder}
                    onChangeText={searchOnChange}
                    placeholderTextColor={'rgba(0, 0, 0, 0.36)'}
                />
            </View>
        );
    }
}

export default SearchBar;

const styles = StyleSheet.create({
    container: {
        height: 36,
        flexDirection: 'row',
        backgroundColor: 'rgba(142, 142, 147, 0.12)',
        marginVertical: 20,
        marginHorizontal: 20,
        borderRadius: 10,
    },

    searchIcon: {
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    searchBar: {
        flex: 1,
        color: '#000',
    },
});