/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {
    View,
    Platform,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Image,
    Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import AppText from 'app/components/app_text';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import Device from 'app/utils/device';

// import FastImage from 'react-native-fast-image';

class Item extends React.PureComponent<Props> {
    static propTypes = {
        handleSelectPhoto: PropTypes.any,
        intl: PropTypes.any,
        isSelected: PropTypes.any,
        item: PropTypes.any,
        navigation: PropTypes.any,
    };
    static defaultProps = {}
    textAnimation = new Animated.Value(0);

    handleSelectAlbum = async () => {
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
            // console.warn(image);

            const imageTaken = image.path;
            const tmp = image.path.split('/');
            let albumName = '';
            if (tmp[tmp.length - 2] !== 'react-native-image-crop-picker') {
                albumName = tmp[tmp.length - 2];
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
            this.props.handleSelectPhoto(params, albumName);

            // this.props.navigation.navigate('SunEffects', params);
        }).catch((error) => {
            console.log('error', error);
        });
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

    handleSelectPhoto = (item, numRow) => {
        const params = this.formatImage(item);
        this.props.handleSelectPhoto(params, numRow);
    }

    formatImage = (item) => {
        const {type, image, timestamp, location} = item.node;
        const {uri, filename} = image;
        const params = {
            imageTaken: uri,
            timeTaken: timestamp * 1000,
            imageType: type,
            imageName: filename,
        };
        if (location) {
            params.coordinate = {
                lat: location.latitude,
                lng: location.longitude,
            };
        }
        return params;
    }
    render() {
        const {item, isSelected} = this.props;
        let Content = (
            <View
                style={styles.emptyContent}
            />
        );
        if (item.node) {
            const uri = item.node.image.uri;
            Content = (
                <TouchableOpacity
                    onPress={() => this.handleSelectPhoto(item)}
                    activeOpacity={1}
                    style={styles.imageContainer}
                >
                    <Image
                        source={{uri}}
                        style={styles.image}
                        resizeMode='cover'
                    />
                    <View
                        style={{
                            ...StyleSheet.absoluteFillObject,
                            backgroundColor: isSelected ? 'rgba(255,255,255, 0.5)' : 'transparent',
                        }}
                    />
                </TouchableOpacity>
            );
        }
        return Content;
    }
}
export default Item;

const styles = StyleSheet.create({
    imageContainer: {
        width: Device.screen.width / 4,
        height: Device.screen.width / 4,
    },
    emptyContent: {
        flex: 1,
        backgroundColor: '#FFF',
        height: Device.screen.width / 4,
        width: Device.screen.width / 4,
    },
    image: {
        flex: 1,
    },
});
