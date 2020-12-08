/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {
    View,
    StyleSheet,
    Platform,
    Alert,
    FlatList,
    TouchableOpacity,
    Animated,
    Image,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import { check, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import ImageResizer from 'react-native-image-resizer';
import ImagePicker from 'react-native-image-crop-picker';
import Device from 'app/utils/device';
import AppText from 'app/components/app_text';
import HeaderRight from 'app/components/common/header_right';
import Item from './Item';
import Icon from 'app/components/icon';

const PER_PAGE = 30;
/* eslint-disable camelcase */
class Library extends React.PureComponent<Props> {
    static propTypes = {}
    static defaultProps = {}
    state = {
        photos: [],
        photoLibraryStatus: '',
        image: {},
        page: 0,
        pageInfo: {
            endCursor: '',
            hasNextPage: true,
        },
        firstImageLoading: null,
        allImageLoading: null,
    };
    textAnimation = new Animated.Value(0);
    static navigationOptions = ({ screenProps, navigation }) => {
        const { intl } = screenProps;
        const { state } = navigation;
        const headerTitle = (
            <AppText
                fontText={'SF-Pro-Display-Medium'}
                style={{ fontSize: 17, fontWeight: '500' }}
                value={intl.formatMessage({ id: 'header.title.library', defaultMessage: 'Library' })}
            />
        );

        const headerRight = (
            <HeaderRight
                id='next'
                defaultMessage='Next'
                onPress={state.params && state.params.onNext}
            />
        );
        let headerLeft = (
            <TouchableOpacity
                style={{ height: '100%', paddingLeft: 10, justifyContent: 'center' }}
                onPress={() => navigation.navigate('Home')}
            >
                <AppText
                    style={{ fontSize: 17 }}
                    value={intl.formatMessage({ id: 'button.cancel', defaultMessage: 'Cancel' })}
                />
            </TouchableOpacity>
        );
        if (Device.os === 'android') {
            headerLeft = (
                <TouchableOpacity
                    style={{ width: 56, height: '100%', justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Icon
                        name='md-close'
                        size={24}
                        color='#000'
                    />
                </TouchableOpacity>
            );
        }

        return {
            headerLeft,
            headerTitle,
            headerRight,
        };
    }

    componentDidMount() {
        const { navigation } = this.props;
        navigation.setParams({
            onNext: this.onNext,
        });

        this.openLibrary();
    }

    onNext = async () => {
        const { image } = this.state;
        let imageTaken = image.imageTaken;
        const response = await ImageResizer.createResizedImage(imageTaken, 1920, 1920, 'JPEG', 90);
        if (response && response.uri) {
            imageTaken = response.uri;
        }
        image.imageTaken = imageTaken;
        this.props.navigation.navigate('SunEffects', image);
    }

    openLibrary = async () => {
        const { screenProps } = this.props;
        const { pageInfo } = this.state;
        const { intl } = screenProps;

        const photoLibraryStatus = await check(Platform.select({
            ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
            android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        }));

        if (photoLibraryStatus === RESULTS.BLOCKED) {
            Alert.alert(
                intl.formatMessage({ id: 'enablePhotoLibraryAccessTitle', defaultMessage: 'Enable permission access your photo library.' }),
                intl.formatMessage({ id: 'enablePhotoLibraryAccessMessage', defaultMessage: 'We need your permission to use your photo library.' }),
                [
                    {
                        text: intl.formatMessage({ id: 'button.cancel', defaultMessage: 'Cancel' }),
                    },
                    {
                        text: intl.formatMessage({ id: 'button.ok', defaultMessage: 'Ok' }),
                        onPress: () => this.onOpenSettings(),
                    },
                ]
            );
        }
        this.selectFirstPhoto();
        this.getPhotos(pageInfo);
    }
    onOpenSettings = async () => {
        try {
            await openSettings();
        } catch (error) {
            console.log('error', error);
        }
    }

    selectFirstPhoto = () => {
        const options = {
            first: 1,
            assetType: 'Photos',
            groupTypes: 'All',
        };
        CameraRoll.getPhotos(options).
            then((r) => {
                const { edges } = r;
                if (edges.length > 0) {
                    const { type, image, timestamp, location } = edges[0].node;
                    const { uri, filename } = image;
                    const imageInfo = {
                        imageTaken: uri,
                        timeTaken: timestamp * 1000,
                        imageType: type,
                        imageName: filename,
                    };
                    if (location) {
                        imageInfo.coordinate = {
                            lat: location.latitude,
                            lng: location.longitude,
                        };
                    }
                    this.setState({
                        image: imageInfo,
                    });
                }
            }).
            catch((err) => {
                console.log('error - getFirstPhotos()', err);
            });
    }

    getPhotos = (pageInfo) => {
        const { endCursor, hasNextPage } = pageInfo;

        if (!hasNextPage) {
            return;
        }
        const options = {
            first: PER_PAGE,
            assetType: 'Photos',
            groupTypes: 'All',
        };

        if (endCursor) {
            options.after = endCursor;
        }
        this.setState({ allImageLoading: true });

        CameraRoll.getPhotos(options).
            then((photoPage) => {
                // console.log('photoPage', photoPage);
                const { page_info, edges } = photoPage;
                const { end_cursor, has_next_page } = page_info;

                const nextPhoto = [];
                if (edges.length > 0) {
                    edges.forEach((item) => {
                        nextPhoto.push(item);
                    });
                    this.setState({
                        photos: this.state.photos.concat(nextPhoto),
                        pageInfo: {
                            hasNextPage: has_next_page,
                            endCursor: end_cursor,
                        },
                        allImageLoading: false,
                    });
                }
            }).
            catch((err) => {
                console.log('error - getPhotos()', err);
                this.setState({ allImageLoading: false });
            });
    }

    handleSelectPhoto = (image) => {
        this.setState({
            image,
        });
    }
    renderItem = ({ item, index }) => {
        const { screenProps } = this.props;
        const { image } = this.state;
        let isSelected = false;
        if (item.node && item.node.image.filename === image.imageName) {
            isSelected = true;
        }
        let Separator = (
            <View
                style={styles.separator}
            />
        );
        if ((index + 1) % 4 === 0) {
            Separator = null;
        }
        return (
            <>
                <Item
                    item={item}
                    index={index}
                    isSelected={isSelected}
                    handleSelectPhoto={this.handleSelectPhoto}
                    intl={screenProps.intl}
                />
                {Separator}
            </>
        );
    }

    onLibrary = async () => {
        const { intl } = this.props.screenProps;
        const photoLibraryStatus = await check(Platform.select({
            ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
            android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        }));

        if (photoLibraryStatus === RESULTS.BLOCKED) {
            Alert.alert(
                intl.formatMessage({ id: 'enablePhotoLibraryAccessTitle', defaultMessage: 'Enable permission access your photo library.' }),
                intl.formatMessage({ id: 'enablePhotoLibraryAccessMessage', defaultMessage: 'We need your permission to use your photo library.' }),
                [
                    {
                        text: intl.formatMessage({ id: 'button.cancel', defaultMessage: 'Cancel' }),
                    },
                    {
                        text: intl.formatMessage({ id: 'button.ok', defaultMessage: 'Ok' }),
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

            // const tmp = image.path.split('/');
            // let albumName = '';
            // if (tmp[tmp.length - 2] !== 'react-native-image-crop-picker') {
            //     albumName = tmp[tmp.length - 2];
            // }

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
            this.handleSelectPhoto(params);

            // this.props.navigation.navigate('SunEffects', params);
        }).catch((error) => {
            console.log('error', error);
        });
    }

    onCamera = () => {
        this.props.navigation.navigate('Camera');
    }

    onEndReached = () => {
        const { pageInfo, photos } = this.state;
        if (photos.length < PER_PAGE) {
            return null;
        }
        this.getPhotos(pageInfo);
    };

    renderHeader = () => {
        const { image } = this.state;
        let SelectedImage = null;
        if (image) {
            SelectedImage = (
                <Image
                    source={{ uri: image.imageTaken }}
                    style={{
                        width: Device.screen.width,
                        height: Device.screen.height / 2,
                    }}
                    resizeMode='cover'
                />
            );
        }
        return SelectedImage;
    }

    renderEmptyComponent = () => {
        const { photos, allImageLoading } = this.state;
        const { screenProps } = this.props;
        if (photos.length === 0 && allImageLoading === false) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <AppText
                        fontText={'SF-Pro-Display-Medium'}
                        style={{ textTransform: 'uppercase', fontWeight: '600' }}
                        value={screenProps.intl.formatMessage({ id: 'noImage', defaultMessage: 'No Image' })}
                    />
                </View>
            );
        }
        return null;
    }

    renderListPhotos = () => {
        const { photos } = this.state;
        return (
            <FlatList
                data={photos}
                extraData={this.state}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => `${index}`}
                numColumns={4}
                ItemSeparatorComponent={() => (<View style={styles.rowSeparator} />)}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={0.5}
                ListHeaderComponent={this.renderHeader}
                ListEmptyComponent={this.renderEmptyComponent}
                stickyHeaderIndices={[0]}
                showsVerticalScrollIndicator={false}
            />
        );
    }
    render() {
        const { screenProps } = this.props;
        return (
            <View style={styles.container}>
                {this.renderListPhotos()}
                <View style={styles.bottom}>
                    <TouchableOpacity
                        style={[styles.bottomBtn, { alignItems: 'flex-start', paddingLeft: 20 }]}
                    >
                        <AppText
                            fontText={'SF-Pro-Display-Medium'}
                            style={{ color: '#FF9500', textTransform: 'uppercase', fontWeight: '600' }}
                            value={screenProps.intl.formatMessage({ id: 'photos', defaultMessage: 'Photos' })}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.bottomBtn}
                        onPress={this.onLibrary}
                    >
                        <AppText
                            fontText={'SF-Pro-Display-Medium'}
                            style={{ textTransform: 'uppercase', fontWeight: '600' }}
                            value={screenProps.intl.formatMessage({ id: 'library', defaultMessage: 'LIBRARY' })}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.bottomBtn, { alignItems: 'flex-end', paddingRight: 20 }]}
                        onPress={this.onCamera}
                    >
                        <AppText
                            fontText={'SF-Pro-Display-Medium'}
                            style={{ textTransform: 'uppercase', fontWeight: '600' }}
                            value={screenProps.intl.formatMessage({ id: 'camera', defaultMessage: 'CAMERA' })}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
export default Library;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    bottom: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: '#FFF',
    },

    bottomBtn: {
        flex: 1,
        paddingVertical: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    separator: {
        width: 1,
        backgroundColor: '#FFF',
    },
    rowSeparator: {
        height: 1,
        backgroundColor: '#FFF',
    },
});
