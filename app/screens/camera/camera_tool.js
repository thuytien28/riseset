/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import {View, Platform, StyleSheet, TouchableOpacity, Alert, Image} from 'react-native';

import PropTypes from 'prop-types';
import {RNCamera} from 'react-native-camera';
import {check, PERMISSIONS, RESULTS, openSettings} from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';

import AppIcon from 'assets/icons/AppIcon';
import {getStatusBarHeight} from 'app/utils/screen';
import Icon from 'app/components/icon';
import Device from 'app/utils/device';

const {Type: CameraType, FlashMode, Orientation} = RNCamera.Constants;
const CAPTURE_BTN_SIZE = 56;
const exchange = require('assets/images/camera/exchange.png');
const filesStack = require('assets/images/camera/files-stack.png');
class CameraTool extends React.PureComponent<Props> {
    constructor(props) {
        super(props);

        this.state = {
            cameraImages: [],
            focusedScreen: false,
            cameraType: CameraType.back,
            flashMode: FlashMode.off,
        };
    }

    checkPhotoLibraryPermission = async () => {
        const photoLibraryStatus = await check(Platform.select({
            ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
            android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        }));
        this.setState({photoLibraryStatus});
    }

    takePicture = async () => {
        const {navigation, camera} = this.props;
        if (camera) {
            const options = {
                quality: 1,
                base64: true,
                mirrorImage: this.state.cameraType === CameraType.front,
            };
            if (Device.os === 'android') {
                options.skipProcessing = true;
                options.fixOrientation = false;
            }
            const data = await camera.takePictureAsync(options);

            // console.log('data', data);
            let imageTaken = data.uri;
            const response = await ImageResizer.createResizedImage(data.uri, 1920, 1920, 'JPEG', 90);
            if (response && response.uri) {
                imageTaken = response.uri;
            }
            this.props.navigation.replace('SunEffects', {
                imageTaken,
                timeTaken: new Date().getTime(),
                imageType: data.mime || 'image/png',
                imageName: data.filename || data.uri.split('/').pop(), // on android no filename

            });
        }
    };

    onSwitchCamera = () => {
        const {cameraType} = this.state;
        if (cameraType === CameraType.back) {
            this.setState({cameraType: CameraType.front});
            this.props.handleSwitchCamera(CameraType.front);
        } else {
            this.setState({cameraType: CameraType.back});
            this.props.handleSwitchCamera(CameraType.back);
        }
    }

    onToggleFlash = () => {
        const {flashMode} = this.state;
        if (flashMode === FlashMode.on) {
            this.setState({flashMode: FlashMode.off});
            this.props.handleToggleFlash(FlashMode.off);
        } else {
            this.setState({flashMode: FlashMode.on});
            this.props.handleToggleFlash(FlashMode.on);
        }
    }

    onOpenSettings = async () => {
        try {
            await openSettings();
        } catch (error) {
            console.log('error', error);
        }
    }

    convertGPS = (string, ref) => {
        const array = string.split(',');
        const temp = array.map((a) => {
            const tmp = a.split('/');
            return tmp[0] / tmp[1];
        });
        let value = temp[0] + (temp[1] / 60) + (temp[2] / 3600);
        if (ref === 'S' || ref === 'W') {
            value = 0 - value;
        }
        return value;
    }

    onOpenLibrary = async () => {
        const {intl} = this.props;
        const photoLibraryStatus = await check(Platform.select({
            ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
            android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        }));

        if (photoLibraryStatus === RESULTS.BLOCKED) {
            Alert.alert(
                intl.formatMessage({id: 'enablePhotoLibraryAccessTitle', defaultMessage: 'Enable permission access your photo library.'}),
                intl.formatMessage({id: 'enablePhotoLibraryAccessMessage', defaultMessage: 'We need your permission to use your photo library.'}),
                [
                    {
                        text: intl.formatMessage({id: 'button.cancel', defaultMessage: 'Cancel'}),
                    },
                    {
                        text: intl.formatMessage({id: 'button.ok', defaultMessage: 'Ok'}),
                        onPress: () => this.onOpenSettings(),
                    },
                ]
            );
        }

        ImagePicker.openPicker({
            cropping: false,
            mediaType: 'photo',
            includeExif: true,
        }).then(async (image) => {
            let imageTaken = image.path;
            const response = await ImageResizer.createResizedImage(image.path, 1920, 1920, 'JPEG', 90);
            if (response && response.uri) {
                imageTaken = response.uri;
            }
            const params = {
                imageTaken,
                timeTaken: Platform.select({
                    ios: Number(image.creationDate || image.modificationDate) * 1000 || new Date().getTime(), // ios x 1000
                    android: Number(image.creationDate || image.modificationDate) || new Date().getTime(),
                }),
                imageType: image.mime || 'image/png',
                imageName: image.filename || image.path.split('/').pop(), // on android no filename
            };

            if (Platform.OS === 'android') {
                if (image.exif && image.exif.GPSLatitude && image.exif.GPSLongitude) {
                    params.coordinate = {
                        lat: this.convertGPS(image.exif.GPSLatitude, image.exif.GPSLatitudeRef),
                        lng: this.convertGPS(image.exif.GPSLongitude, image.exif.GPSLongitudeRef),
                    };
                }
            } else if (image.exif && image.exif['{GPS}']) {
                params.coordinate = {
                    lat: image.exif['{GPS}'].Latitude,
                    lng: image.exif['{GPS}'].Longitude,
                };
            }

            // console.warn(params.coordinate);

            this.props.navigation.replace('SunEffects', params);
        }).catch((error) => {
            console.log('error', error);
        });
    }

    renderPhotoToolBar = () => {
        const {cameraType} = this.state;

        const OpenPhotoIcon = (
            <TouchableOpacity
                style={styles.iconCtn}
                onPress={this.onOpenLibrary}
            >
                <Image
                    source={filesStack}
                    style={{width: 34, height: 34}}
                />
            </TouchableOpacity>
        );

        const TakePhotoBtn = (
            <TouchableOpacity
                onPress={this.takePicture.bind(this)}
                style={styles.captureCtn}
            >
                <View style={styles.captureInsideBtn}/>
            </TouchableOpacity>
        );

        const SwitchCameraBtn = (
            <TouchableOpacity
                style={styles.iconCtn}
                onPress={this.onSwitchCamera}
            >
                <Image
                    source={exchange}
                    style={{width: 34, height: 34}}
                />
            </TouchableOpacity>
        );
        const PhotoToolBar = (
            <View style={styles.footer}>
                {OpenPhotoIcon}
                {TakePhotoBtn}
                {SwitchCameraBtn}
            </View>
        );

        return PhotoToolBar;
    }

    renderCloseBtn = () => {
        return (
            <TouchableOpacity
                style={styles.backContainer}
                onPress={() => this.props.navigation.goBack()}
            >
                <AppIcon
                    name='close'
                    size={24}
                    color={'white'}
                />
            </TouchableOpacity>
        );
    }

    renderToggleFlash = () => {
        const {flashMode} = this.state;
        return (
            <TouchableOpacity
                style={styles.iconToogleFlashCtn}
                onPress={this.onToggleFlash}
            >
                <Icon
                    type='Ionicons'
                    name={flashMode === FlashMode.on ? 'ios-flash' : 'ios-flash-off'}
                    size={30}
                    color='#FFFFFF'
                />
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <>
                {this.renderCloseBtn()}
                {this.renderToggleFlash()}
                {this.renderPhotoToolBar()}
            </>
        );
    }
}

CameraTool.propTypes = {
    navigation: PropTypes.object,
    intl: PropTypes.object,
};

export default CameraTool;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    preview: {
        ...StyleSheet.absoluteFillObject,
    },
    captureCtn: {
        backgroundColor: 'rgba(255,255,255, 0.4)',
        height: CAPTURE_BTN_SIZE + 20,
        width: CAPTURE_BTN_SIZE + 20,
        borderRadius: (CAPTURE_BTN_SIZE + 20) / 2,
        justifyContent: 'center',
        alignItems: 'center',
    },

    captureInsideBtn: {
        height: CAPTURE_BTN_SIZE,
        width: CAPTURE_BTN_SIZE,
        backgroundColor: '#FFF',
        borderRadius: CAPTURE_BTN_SIZE / 2,
    },

    footer: {
        flexDirection: 'row',
        height: (140),
        width: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },

    images: {
        height: 44,
        width: 44,
        backgroundColor: 'white',
    },

    iconCtn: {
        height: 44,
        width: 44,
        justifyContent: 'center',
        alignItems: 'center',

        //  backgroundColor: 'white',
    },

    backContainer: {
        height: (44),
        width: (44),
        borderRadius: (44) / 2,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: getStatusBarHeight(),
        left: 10,
    },
    iconToogleFlashCtn: {
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
