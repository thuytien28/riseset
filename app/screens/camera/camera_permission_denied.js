/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import PropTypes from 'prop-types';
import {openSettings, PERMISSIONS, check} from 'react-native-permissions';

import {changeOpacity} from 'app/utils/theme';
import AppText from 'app/components/app_text';
import Icon from '../../components/icon';

import {getStatusBarHeight} from 'app/utils/screen';

class CameraPermissonDenied extends React.PureComponent {
    renderCloseBtn = () => {
        return (
            <TouchableOpacity
                style={styles.backContainer}
                onPress={() => this.props.navigation.goBack()}
            >
                <Icon
                    type='System'
                    name='close'
                    size={24}
                    color={'white'}
                />
            </TouchableOpacity>
        );
    }

    onOpenSettings = async () => {
        try {
            await openSettings();
        } catch (error) {
            console.log('error', error);
        }
    }
    render() {
        const {intl} = this.props;
        return (
            <View style={styles.container}>

                <AppText
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}
                    value={intl.formatMessage({id: 'shareOnRiseSet', defaultMessage: 'Share on RisesetJournal'})}
                    style={styles.message}
                />
                <AppText
                    numberOfLines={2}
                    adjustsFontSizeToFit={true}
                    value={intl.formatMessage({id: 'shareOnRiseSetDesc', defaultMessage: 'Enable access so you start taking photos and videos.'})}
                    style={styles.descriptionMsg}
                />
                <TouchableOpacity
                    onPress={this.onOpenSettings}
                >
                    <AppText
                        numberOfLines={2}
                        adjustsFontSizeToFit={true}
                        value={intl.formatMessage({id: 'enableCameraAccess', defaultMessage: 'Enable Camera Access'})}
                        style={styles.enableCameraAccess}
                    />
                </TouchableOpacity>
                {this.renderCloseBtn()}
            </View>
        );
    }
}

CameraPermissonDenied.propTypes = {
    intl: PropTypes.object,
    navigation: PropTypes.object,
};
export default CameraPermissonDenied;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: changeOpacity('#000', 0.9),
    },
    message: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
        paddingHorizontal: 16,
        textAlign: 'center',
    },
    descriptionMsg: {
        color: '#FFF',
        fontSize: 15,
        paddingHorizontal: 16,
        marginTop: 10,
    },
    enableCameraAccess: {
        color: '#3897F0',
        fontSize: 15,
        paddingHorizontal: 16,
        marginTop: 20,
    },
    backContainer: {
        height: (44),
        width: (44),
        borderRadius: (44) / 2,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: getStatusBarHeight(),
        right: 10,
    },
});
