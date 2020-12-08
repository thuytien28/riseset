
/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {
    StyleSheet,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import PropTypes from 'prop-types';
import AppText from '../../components/app_text';
import Device from 'app/utils/device';
import Icon from 'app/components/icon';

class Item extends React.PureComponent {
    onPressItem = (id) => {
        this.props.onPressItem(id);
    };

    keyExtractor = (index) => index;

    renderItem = (item) => {
        return (
            <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize: 10, color: '#FF9500'}}>{'\u2B24'}</Text>
                <View style={{paddingRight: 10}}>
                    <AppText
                        fontText={'SF-Pro-Display-Light'}
                        style={styles.detail}
                        value={item.item}
                    />
                </View>
            </View>
        );
    }
    render() {
        const {selected, item} = this.props;
        const {id, title, des, detail} = item;
        const icon = selected ? 'plus' : 'minus';
        return (
            <TouchableOpacity
                onPress={() => this.onPressItem(id)}
                style={styles.item}
            >
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flex: 1}}>
                        <AppText
                            style={styles.title}
                            value={title}
                            numberOfLines={2}
                        />
                    </View>
                    <View style={styles.icon}>
                        <Icon
                            type={'AntDesign'}
                            name={icon}
                            size={18}
                            color={'#FF9500'}
                        />
                    </View>
                </View>
                {
                    !selected &&
                    <React.Fragment>
                        {Boolean(des) && (
                            <AppText
                                fontText={'SF-Pro-Display-Light'}
                                style={styles.des}
                                value={des}
                            />
                        )}

                        <FlatList
                            data={detail}
                            keyExtractor={this.keyExtractor}
                            renderItem={this.renderItem}
                            ItemSeparatorComponent={() => (
                                <View style={{height: 5}}/>
                            )}
                        />
                    </React.Fragment>
                }
            </TouchableOpacity>

        );
    }
}

Item.propTypes = {
    des: PropTypes.string,
    id: PropTypes.string,
    onPressItem: PropTypes.func,
    selected: PropTypes.any,
    item: PropTypes.object,
};

export default Item;

const styles = StyleSheet.create({
    item: {
        padding: 10,
        width: Device.screen.width - 22,
        borderRadius: 5,
        backgroundColor: '#FFF',
        elevation: 5,
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 2,
    },
    title: {
        fontSize: 17,
        marginBottom: 5,
    },
    des: {
        fontSize: 15,
        marginBottom: 5,
    },
    detail: {
        fontSize: 15,
        marginLeft: 5,
    },
    icon: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginLeft: 10,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
});