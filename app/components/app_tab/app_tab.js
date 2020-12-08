/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

/* eslint-disable react/prop-types */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import SafeAreaView from 'react-native-safe-area-view';

class AppTabComponent extends React.PureComponent {
    render() {
        const {
            renderIcon,
            getLabelText,
            activeTintColor,
            inactiveTintColor,
            onTabPress,
            onTabLongPress,
            getAccessibilityLabel,
            navigation,
        } = this.props;

        const {routes, index: activeRouteIndex} = navigation.state;

        return (
            <SafeAreaView
                forceInset={{bottom: 'always'}}
            >
                <View style={styles.container}>
                    {routes.map((route, routeIndex) => {
                        const isRouteActive = routeIndex === activeRouteIndex;
                        const tintColor = isRouteActive ? activeTintColor : inactiveTintColor;

                        return (
                            <TouchableOpacity
                                key={routeIndex}
                                style={styles.tabButton}
                                onPress={() => {
                                    onTabPress({route});
                                }}
                                onLongPress={() => {
                                    onTabLongPress({route});
                                }}
                                accessibilityLabel={getAccessibilityLabel({route})}
                            >
                                {renderIcon({route, focused: isRouteActive, tintColor})}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </SafeAreaView>

        );
    }
}

export default AppTabComponent;

const styles = StyleSheet.create({
    container: {

        // height: 53,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginHorizontal: 10,
        paddingVertical: 5,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 2,
        elevation: 5,
    },
    tabButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
