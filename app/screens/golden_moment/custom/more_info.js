/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {StyleSheet, SafeAreaView, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import AppIcon from 'assets/icons/AppIcon';
import AppText from 'app/components/app_text';

class MoreInfo extends React.PureComponent {
    render() {
        const {screenProps, navigation} = this.props;
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <AppText
                        fontText={'SF-Pro-Display-Medium'}
                        style={{fontSize: 16}}
                        value={screenProps.intl.formatMessage({id: 'what_is_golden_moment', defaultMessage: 'What is Golden Moment?'})}
                    />
                    <TouchableOpacity
                        style={styles.buttonClose}
                        onPress={() => navigation.goBack()}
                    >
                        <AppIcon
                            name={'close'}
                            size={18}
                        />
                    </TouchableOpacity>
                </View>
                <AppText
                    fontText={'SF-Pro-Display-Light'}
                    style={styles.text}
                    value={screenProps.intl.formatMessage({id: 'des_golden_moment', defaultMessage: text})}
                />
            </SafeAreaView>
        );
    }
}

MoreInfo.propTypes = {
    navigation: PropTypes.object,
    screenProps: PropTypes.object,
};
export default MoreInfo;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
    },
    header: {
        marginTop: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonClose: {
        marginRight: 20,
    },
    text: {
        fontSize: 16,
        letterSpacing: 1,
    },
});

const text = 'The rising and setting times given in these tables refer to the appearance and disappearance (respectively) of the upper limb of the sun as observed at sea level on a refracted (apparent) sea horizon. Because of irregularities of terrain, these theoretical times will only approximate the rising and setting times observed on land. Even on a perfect (sea) horizon, variations in the atmospheric temperature profile can cause the amount of atmospheric refraction of light to vary, such that observed rise and set times may deviate from the computed values by one or two minutes.';

