/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Image,
} from 'react-native';

import Header from 'app/components/header';
import MenuItem from './menu_item';
import {moderateScale} from 'app/utils/scaling';
import LogoutButton from 'app/components/logout_button';

class HomeMenu extends React.Component {
    render() {
        const {navigation} = this.props;
        return (
            <SafeAreaView style={styles.container}>
                <Header
                    title='screenHeader.title.menu'
                    defaultTitle='Menu'
                    onLeftIcon={() => navigation.goBack()}
                    leftIconSize={moderateScale(20)}
                />
                <View style={{height: moderateScale(32)}}/>
                <MenuItem
                    rightIconName='calendar'
                    onItem={() => {
                        navigation.navigate('Statistical');
                    }}
                    title='menu.title.statistical'
                    defaultTitle='Statistical'
                    iconColor={'#6359A1'}
                />
                <MenuItem
                    rightIconName='place'
                    onItem={() => {
                        navigation.navigate('PlaceList');
                    }}
                    title='screenHeader.title.yourPlaces'
                    defaultTitle='Your places'
                    iconColor={'#016D8F'}
                />
                <MenuItem
                    rightIconName='earth'
                    onItem={() => {
                        navigation.navigate('Discover');
                    }}
                    title='menu.title.discover'
                    defaultTitle='Discover'
                    iconColor={'#8B0A39'}
                />
                <MenuItem
                    rightIconName='ligh'
                    onItem={() => {
                        navigation.navigate('PhotographyTips');
                    }}
                    title='screenHeader.title.photographyTips'
                    defaultTitle='Photography Tips'
                    iconColor={'#FC7901'}
                />
                <LogoutButton/>
            </SafeAreaView>
        );
    }
}

export default HomeMenu;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
