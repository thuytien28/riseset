/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import AppText from 'app/components/app_text';
import TrackingView from 'app/components/tracking_view';
import Device from 'app/utils/device';

const FONT_FAMILY_DATA = [
    {
        id: '0',
        full_name: 'Normal',
        short_name: 'Normal',
        font_family: 'SFProDisplay-Regular',
    },
    {
        id: '1',
        full_name: 'Beauty Dream',
        short_name: 'Dream',
        font_family: 'BeautyDream',
    },
    {
        id: '2',
        full_name: 'Alexander Lettering',
        short_name: 'Lettering',
        font_family: 'AlexanderLettering',

    },
    {
        id: '3',
        full_name: 'Caveat',
        short_name: 'Caveat',
        font_family: 'Caveat-Regular',
        size: 24,
    },

    // {
    //     id: '4',
    //     full_name: 'BaiJamjuree-Regular',
    //     short_name: 'BaiJamjuree',
    //     font_family: 'BaiJamjuree-Regular',
    // },
    {
        id: '5',
        full_name: 'a Auto',
        short_name: 'a Auto',
        font_family: 'aAutoSignature',
        size: 24,
    },
    {
        id: '6',
        full_name: 'Anthoni',
        short_name: 'Anthoni',
        font_family: 'AnthoniSignatureRegular',
        size: 14,
    },
    {
        id: '7',
        full_name: 'Bellandha',
        short_name: 'Bellandha',
        font_family: 'BellandhaRegular',
        size: 24,
    },
    {
        id: '8',
        full_name: 'Brittany',
        short_name: 'Brittany',
        font_family: 'BrittanySignatureRegular',
    },
    {
        id: '9',
        full_name: 'Chelsea Olivia',
        short_name: 'Chelsea Olivia',
        font_family: 'ChelseaOlivia',
        size: 30,
    },
    {
        id: '10',
        full_name: 'Donatellia',
        short_name: 'Donatellia',
        font_family: 'Donatellia',
        size: 30,
    },
    {
        id: '11',
        full_name: 'One Signature',
        short_name: 'One',
        font_family: 'OneSignature',
        size: 24,
    },

];

class FontFamilyList extends React.PureComponent {
    onSelectFont = (font) => {
        this.props.handleSelectFont(font);
    }
    renderItem = ({item}) => {
        let selected = false;
        const {fontSelected} = this.props;
        if (fontSelected === item.font_family) {
            selected = true;
        }

        const fontStyle = {
            ...styles.previewSignature,
            fontFamily: item.font_family,
        };
        if (item.size) {
            fontStyle.fontSize = item.size;
        }
        return (
            <TouchableOpacity
                style={styles.itemCtn}
                onPress={() => {
                    this.onSelectFont(item.font_family);
                }}
            >
                <View
                    style={[styles.boxItemCtn, {
                        borderWidth: selected ? 1 : 0,
                        borderColor: selected ? '#D13C00' : 'rgba(0,0,0,0)',
                    }]}
                >
                    <AppText
                        style={fontStyle}
                        value={item.full_name}
                        adjustsFontSizeToFit={true}
                        numberOfLines={2}
                        isSignature={true}
                    />
                </View>
                <AppText
                    value={item.short_name}
                    style={{
                        color: '#000',

                        // fontFamily: item.font_family
                    }}
                />
            </TouchableOpacity>
        );
    }
    render() {
        return (
            <TrackingView>
                <FlatList
                    data={FONT_FAMILY_DATA}
                    keyExtractor={(item, index) => item.id}
                    horizontal={true}
                    renderItem={this.renderItem}
                    style={{
                        backgroundColor: '#F5F5F5',
                    }}
                    ItemSeparatorComponent={() => {
                        return <View style={{width: 20}}/>;
                    }}
                    contentContainerStyle={styles.contentCtn}
                    keyboardShouldPersistTaps='handled'
                />
            </TrackingView>
        );
    }
}
export default FontFamilyList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentCtn: {
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 5,
    },
    itemCtn: {
        alignItems: 'center',
    },
    boxItemCtn: {
        height: Device.screen.width / 5,
        width: Device.screen.width / 5,
        backgroundColor: '#FFF4EA',
        marginBottom: 5,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    previewSignature: {
        color: '#000',
        fontSize: 18,
        textAlign: 'center',
    },
});
