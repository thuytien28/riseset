/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import SunEffectItem from './sun_effect_item';
import Device from 'app/utils/device';
import AppText from 'app/components/app_text';

const SUN_EFFECTS_DEFAULT = [
    {
        id: 'normal',
        image: require('assets/images/sun_effects/1.png'),
        defaultMessage: 'Normal',
    },
    {
        id: 'size',
        image: require('assets/images/sun_effects/2.png'),
        defaultMessage: 'Size',
        effect: 1,
    },
    {
        id: 'heart',
        image: require('assets/images/sun_effects/3.png'),
        defaultMessage: 'Heart',
        effect: 2,
    },
    {
        id: 'angel',
        image: require('assets/images/sun_effects/4.png'),
        defaultMessage: 'Angel',
        effect: 3,
    },
    {
        id: 'bird',
        image: require('assets/images/sun_effects/5.png'),
        defaultMessage: 'Bird',
        effect: 4,
    },
];

const STYLES_DEFAULT = [
    {
        id: 'style01',
        image: require('assets/images/style_effects/1.png'),
        defaultMessage: 'Style 01',
        effect: 1,
    },
    {
        id: 'style02',
        image: require('assets/images/style_effects/2.png'),
        defaultMessage: 'Style 02',
        effect: 2,
    },
    {
        id: 'style03',
        image: require('assets/images/style_effects/3.png'),
        defaultMessage: 'Style 03',
        effect: 3,
    },
    {
        id: 'style04',
        image: require('assets/images/style_effects/4.png'),
        defaultMessage: 'Style 04',
        effect: 4,
    },
    {
        id: 'style05',
        image: require('assets/images/style_effects/5.png'),
        defaultMessage: 'Style 05',
        effect: 5,
    },
];
class SunEffectList extends React.PureComponent<Props> {
    static propTypes = {}
    static defaultProps = {}

    constructor(props) {
        super(props);
        this.state = {
            selected: new Map(),
            isSunEffect: true,
        };
    }

    componentDidMount() {
        if (this.props.refs) {
            this.props.refs(this);
        }
    }

    onItemPress = (id, effect) => {
        if (!this.state.selected.get(id)) {
            const newSelected = new Map();
            newSelected.set(id, !this.state.selected.get(id));
            this.setState({
                selected: newSelected,
            });
            const { isSunEffect } = this.state;

            this.props.handleApplySunEffect(effect, isSunEffect);
        }
    }

    renderItem = ({ item }) => {
        // console.log(item.effect);
        return (
            <SunEffectItem
                onPress={() => this.onItemPress(item.id, item.effect)}
                item={item}
                isSelected={this.state.selected.get(item.id)}
            />
        );
    }

    onSunEffects = () => {
        if (!this.state.isSunEffect) {
            this.setState({
                isSunEffect: true,
            });
        }
    }

    onStyles = () => {
        if (this.state.isSunEffect) {
            this.setState({
                isSunEffect: false,
            });
        }
    }

    renderSelectEffects = () => {
        const sunEffect = (
            <TouchableOpacity
                onPress={this.onSunEffects}
                style={styles.effectTabStyle}
            >
                <AppText
                    fontText={'SF-Pro-Display-Medium'}
                    style={{ color: this.state.isSunEffect ? '#24253D' : 'rgba(36, 37, 61, 0.5)' }}
                    value={'Sun effects'}
                />
            </TouchableOpacity>
        );

        const styleEffect = (
            <TouchableOpacity
                onPress={this.onStyles}
                style={styles.effectTabStyle}
            >
                <AppText
                    fontText={'SF-Pro-Display-Medium'}
                    style={{ color: this.state.isSunEffect === false ? '#24253D' : 'rgba(36, 37, 61, 0.5)' }}
                    value={'Styles'}
                />
            </TouchableOpacity>
        );
        return (
            <View style={styles.effectStyle}>
                {sunEffect}
                {styleEffect}
            </View>
        );
    }

    renderFlatlist = () => {
        const normalStyle = {
            id: 'normal',
            image: this.props.imageTaken,
            defaultMessage: 'Normal',
            isDeviceFile: true,
        };

        if (this.state.isSunEffect) {
            return (
                <FlatList
                    data={SUN_EFFECTS_DEFAULT}
                    extraData={this.state}
                    horizontal={true}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderItem}
                    contentContainerStyle={styles.contentContainer}
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
                />
            );
        }
        return (
            <View>
                <FlatList
                    data={STYLES_DEFAULT}
                    extraData={this.state}
                    horizontal={true}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderItem}
                    contentContainerStyle={{ padding: 10, paddingBottom: 5 }}
                    showsHorizontalScrollIndicator={false}
                    ListHeaderComponent={() => (
                        <SunEffectItem
                            onPress={() => this.onItemPress(normalStyle.id, normalStyle.effect)}
                            item={normalStyle}
                            isSelected={this.state.selected.get(normalStyle.id)}
                        />
                    )}
                    ListHeaderComponentStyle={{ paddingRight: 15 }}
                    ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
                />
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderFlatlist()}
                {this.renderSelectEffects()}
            </View>
        );
    }
}
export default SunEffectList;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        shadowColor: 'rgba(0,0,0,0.05)',
        shadowOffset: {
            width: 0,
            height: -5,
        },
        shadowOpacity: 1,
        shadowRadius: 2,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        paddingBottom: 5,
    },
    effectStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    effectTabStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        paddingVertical: 20,
    },
});
