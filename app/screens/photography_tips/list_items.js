/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {
    StyleSheet,
    FlatList,
    View,
} from 'react-native';
import PropTypes from 'prop-types';
import Item from './item';
import * as Data from './data.json';
import Device from 'app/utils/device';
import AppText from 'app/components/app_text';

const language = Device.locale;
const items = language === 'vi' ? Data.vi : Data.en;

class ListItems extends React.PureComponent {
    state = {
        selected: (new Map()),
        enableScrollViewScroll: true,
    };

    onEnableScroll = (value) => {
        this.setState({
            enableScrollViewScroll: value,
        });
    };

    keyExtractor = (item) => item.id;

    onNavigateToMenu = () => {
        this.props.navigation.navigate('Menu');
    };

    onPressItem = (id) => {
        this.setState((state) => {
            const selected = new Map(state.selected);
            selected.set(id, !selected.get(id));
            return {selected};
        });
    };

    renderItem = ({item, index}) => (
        <Item
            index={index}
            item={item}
            onPressItem={this.onPressItem}
            selected={Boolean(this.state.selected.get(item.id))}
        />
    );

    renderHeader = () => {
        return (
            <View>
                <AppText
                    fontText={'SF-Pro-Display-Thin'}
                    style={styles.top}
                    value={Data.des.top}
                />
                <AppText
                    fontText={'SF-Pro-Display-Light'}
                    style={styles.bottom}
                    value={Data.des.bottom}
                />
            </View>
        );
    }

    render() {
        return (
            <FlatList
                data={items}
                extraData={this.state}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
                ref={(ref) => {
                    this.flatListRef = ref;
                }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={this.renderHeader}
                contentContainerStyle={styles.list}
                ItemSeparatorComponent={() => (
                    <View style={{height: 15}}/>
                )}
            />
        );
    }
}

ListItems.propTypes = {
    navigation: PropTypes.any,
};

export default ListItems;

const styles = StyleSheet.create({
    list: {
        paddingTop: 10,
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    top: {
        fontSize: 17,
        fontStyle: 'italic',
        fontWeight: '500',
    },
    bottom: {
        fontSize: 16,
        marginVertical: 10,
        fontWeight: '500',
    },
});