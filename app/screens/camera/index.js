/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import {View, StyleSheet, StatusBar, SafeAreaView} from 'react-native';

import PropTypes from 'prop-types';
import {RNCamera} from 'react-native-camera';

import CameraPermissonDenied from './camera_permission_denied';
import CameraTool from 'app/screens/camera/camera_tool';

const {Type: CameraType, FlashMode} = RNCamera.Constants;
class Camera extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            focusedScreen: false,
            cameraType: CameraType.back,
            flashMode: FlashMode.off,
        };
    }

    componentDidMount() {
        const {navigation} = this.props;
        navigation.addListener('willFocus', () => {
            this.setState({focusedScreen: true});

            StatusBar.setHidden(true);
        }
        );
        navigation.addListener('willBlur', () => {
            this.setState({focusedScreen: false});

            StatusBar.setHidden(false);
        }
        );
    }

    handleToggleFlash = (flashMode) => {
        this.setState({
            flashMode,
        });
    }

    handleSwitchCamera = (cameraType) => {
        this.setState({
            cameraType,
        });
    }

    renderCamera = () => {
        const {cameraType, flashMode} = this.state;
        const {screenProps, navigation} = this.props;
        const {intl} = screenProps;
        return (
            <RNCamera
                ref={(ref) => {
                    this.camera = ref;
                }}
                captureAudio={false}
                flashMode={flashMode}
                style={styles.preview}
                type={cameraType}
                androidCameraPermissionOptions={{
                    title: intl.formatMessage({id: 'android.permission.camera.title', defaultMessage: 'Permission to use camera'}),
                    message: intl.formatMessage({id: 'android.permission.camera.message', defaultMessage: 'Permission to use camera'}),
                    buttonPositive: intl.formatMessage({id: 'button.ok', defaultMessage: 'Ok'}),
                    buttonNegative: intl.formatMessage({id: 'button.cancel', defaultMessage: 'Cancel'}),
                }}
            >
                {({status}) => {
                    // console.log('status', status);
                    if (status === 'NOT_AUTHORIZED') {
                        return (
                            <CameraPermissonDenied
                                navigation={navigation}
                                intl={screenProps.intl}
                            />
                        );
                    }
                    if (status === 'READY') {
                        return (
                            <CameraTool
                                navigation={navigation}
                                intl={intl}
                                camera={this.camera}
                                handleToggleFlash={this.handleToggleFlash}
                                handleSwitchCamera={this.handleSwitchCamera}
                            />
                        );
                    }
                    return null;
                }}
            </RNCamera>
        );
    }

    render() {
        const {focusedScreen} = this.state;

        // if (focusedScreen) {
        return (
            <SafeAreaView style={styles.container}>
                {this.renderCamera()}
            </SafeAreaView>
        );

        // }
        // return (
        //     <View/>
        // );
    }
}

Camera.propTypes = {
    navigation: PropTypes.object,
    screenProps: PropTypes.object,
};

export default Camera;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    preview: {
        ...StyleSheet.absoluteFillObject,
    },

});
