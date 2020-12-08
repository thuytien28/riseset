/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import {View, StyleSheet, SafeAreaView, ScrollView, Alert, Platform, findNodeHandle} from 'react-native';

import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import FastImage from 'react-native-fast-image';
import RNFS from 'react-native-fs';
import uuidv4 from 'uuid/v4';

import HeaderRight from 'app/components/common/header_right';
import SunEffectList from './sun_effect_list';
import Device from 'app/utils/device';
import LoadingHolder from 'app/utils/loading_holder';
import {SunEffectTypes, StyleEffectTypes} from 'app/constants';
import AppText from 'app/components/app_text';

class SunEffects extends React.PureComponent<Props> {
    static propTypes = {}
    static defaultProps = {}

    static navigationOptions = ({screenProps, navigation}) => {
        const {intl} = screenProps;
        const {onNext} = navigation.state.params;

        const headerTitle = (
            <AppText
                fontText={'SF-Pro-Display-Medium'}
                style={{fontSize: 17, fontWeight: '500'}}
                value={intl.formatMessage({id: 'header.title.sunEffects', defaultMessage: 'Sun Effects'})}
            />
        );
        const headerRight = (
            <HeaderRight
                id='next'
                defaultMessage='Next'
                onPress={onNext}
            />

        );
        return {

            // title,
            headerTitle,
            headerRight,
        };
    }

    constructor(props) {
        super(props);
        const {params} = props.navigation.state;
        this.state = {
            effectImageLink: params ? params.imageTaken : '',
            effect: null,
            imageRef: null,
            isSunEffect: true,
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({
            onNext: this.onNext,
        });
    }

    componentWillUnmount() {
        this.removeCacheImage();
    }

    removeCacheImage = () => {
        const {incrementSizeUri, heartUri, angleUri, birdUri} = this.state;

        [incrementSizeUri, heartUri, angleUri, birdUri].forEach(
            (path) => {
                if (!path) {
                    return;
                }
                RNFS.unlink(path).
                    then(() => {
                        this.props.dispatch({
                            type: 'DELETE_SUN_EFFECT_CACHE_IMAGE',
                            data: path,
                        });
                    }).

                    // `unlink` will throw an error, if the item to unlink does not exist
                    catch((err) => {
                        // console.log(err.message);
                    });
            }
        );
    }

    onNext = () => {
        // console.log('effectImageLink', this.state);
        const {navigation} = this.props;
        const {params} = navigation.state;

        // get time of photo
        const timeTaken = params ? params.timeTaken : new Date().getTime();
        const imageParams = {
            imageTaken: [this.state.effectImageLink],
            timeTaken,
        };
        if (params && params.coordinate) {
            imageParams.coordinate = params.coordinate;
        }

        if (this.state.effectName) {
            imageParams.effectName = this.state.effectName;
        }
        navigation.navigate('FiltersPhoto', imageParams);
    }

    // store file into state to reuse avoid request to the server multiple times
    storeFile = (path, effect) => {
        let effectImageUri = '';
        let effectName = '';
        if (this.state.isSunEffect) {
            if (effect === SunEffectTypes.INCREMENT_SIZE) {
                effectImageUri = 'incrementSizeUri';
                effectName = 'size';
            } else if (effect === SunEffectTypes.HEART) {
                effectImageUri = 'heartUri';
                effectName = 'heart';
            } else if (effect === SunEffectTypes.ANGLE) {
                effectImageUri = 'angleUri';
                effectName = 'angle';
            } else if (effect === SunEffectTypes.BIRD) {
                effectImageUri = 'birdUri';
                effectName = 'bird';
            }
        } else {
            // incase style effect
            const styleEffectTypes = [];
            const styleEffectUri = [];
            const styleEffectName = [];
            Object.keys(StyleEffectTypes).forEach((key, index) => {
                styleEffectTypes.push(StyleEffectTypes[key]);
                const effectUri = `style${index + 1}Uri`;
                const effName = `style${index + 1}`;

                styleEffectUri.push(effectUri);
                styleEffectName.push(effName);
            });

            styleEffectTypes.forEach((item, index) => {
                if (effect === item) {
                    effectImageUri = styleEffectUri[index];
                    effectName = styleEffectName[index];
                }
            });
        }

        this.setState({effectImageLink: path, [effectImageUri]: path, effect, effectName});
    }

    // download file to cache from recevied link
    downloadFile = (uri, path, effect) => {
        RNFS.downloadFile({fromUrl: uri, toFile: path}).promise.
            then((res) => {
                // console.log('res', res);
                this.storeFile(path, effect);
            });
    };

    // config cache file path
    handleDownloadFile = (effect) => {
        const {effectImageLink} = this.state;
        const extension = (Platform.OS === 'android') ? 'file://' : '';
        const name = uuidv4();
        const path = `${extension}${RNFS.CachesDirectoryPath}/${name}.png`;

        this.downloadFile(effectImageLink, path, effect);

        // RNFS.exists(path).then((exists) => {
        //     if (exists) {
        //         this.loadFile(path, effect);
        //     } else {
        //         this.downloadFile(effectImageLink, path);
        //     }
        // });
    }

    getSunEffect = async (effect = 1, isSunEffect) => {
        const {params} = this.props.navigation.state;
        if (params) {
            let API;
            if (isSunEffect) {
                API = `https://ai.riseset.io/api/sundetect/query?type=${effect}`;
            } else {
                API = `https://ai.riseset.io/api/style/query?type=${effect}`;
            }

            const imageTaken = params.imageTaken;
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            const FILE = (Platform.OS === 'ios') ? imageTaken.replace('file://', '') : imageTaken;

            const file = {
                uri: FILE,
                type: params.imageType,
                name: params.imageName,
            };

            // Declare form data
            const formData = new FormData();
            formData.append('file', file);
            options.body = formData;

            // Call api from computure vision
            try {
                const response = await fetch(API, options);
                const responseJson = await response.json();

                return {data: responseJson};
            } catch (error) {
                // console.log('error', error);
                return {
                    error,
                };
            }
        }
    }

    checkExistsEffect = (effect, isSunEffect) => {
        const {incrementSizeUri, heartUri, angleUri, birdUri} = this.state;
        const {style1Uri, style2Uri, style3Uri, style4Uri, style5Uri} = this.state;
        if (isSunEffect) {
            if (effect === SunEffectTypes.INCREMENT_SIZE && Boolean(incrementSizeUri)) {
                return incrementSizeUri;
            } else if
            (effect === SunEffectTypes.HEART && Boolean(heartUri)) {
                return heartUri;
            } else if
            (effect === SunEffectTypes.ANGLE && Boolean(angleUri)) {
                return angleUri;
            } else if
            (effect === SunEffectTypes.BIRD && Boolean(birdUri)) {
                return birdUri;
            }
        } else {
            if
            (effect === StyleEffectTypes.STYLE_01 && Boolean(style1Uri)) {
                return style1Uri;
            } else if
            (effect === StyleEffectTypes.STYLE_02 && Boolean(style2Uri)) {
                return style2Uri;
            } else if
            (effect === StyleEffectTypes.STYLE_03 && Boolean(style3Uri)) {
                return style3Uri;
            } else if
            (effect === StyleEffectTypes.STYLE_04 && Boolean(style4Uri)) {
                return style4Uri;
            } else if
            (effect === StyleEffectTypes.STYLE_05 && Boolean(style5Uri)) {
                return style5Uri;
            }

            return null;
        }
    }

    handleApplySunEffect = async (effect, isSunEffect) => {
        this.setState({
            isSunEffect,
        });
        // origin image
        if (!effect) {
            this.setState({effectImageLink: this.props.navigation.state.params.imageTaken, effect: null});
            return;
        }

        // get exists effect image in state
        const existsLink = this.checkExistsEffect(effect, isSunEffect);
        if (existsLink) {
            this.setState({effectImageLink: existsLink, effect});
            return;
        }

        // if no applied effect image then request server to get link image
        LoadingHolder.start(true, this.state.imageRef);
        const {data, error} = await this.getSunEffect(effect, isSunEffect);
        if (error) {
            // handle error
            LoadingHolder.stop();
            const {intl} = this.props.screenProps;
            Alert.alert(
                intl.formatMessage({id: 'error', defaultMessage: 'Error'}),
                intl.formatMessage({id: 'common.error', defaultMessage: 'Something wrong, Please try again.'}),
            );
        }
        if (data) {
            if (data.path) {
                this.setState({effectImageLink: data.path, effect}, () => {
                    // download image from server's recived link
                    this.handleDownloadFile(effect);
                });
            }
            if (data.result === 'upload error') {
                const {intl} = this.props.screenProps;
                Alert.alert(
                    intl.formatMessage({id: 'error', defaultMessage: 'Error'}),
                    intl.formatMessage({id: 'upload.error', defaultMessage: 'Upload error'}),
                );
            }

            LoadingHolder.stop();
        }
    }

    onImageContaianer = () => {
        this.setState({imageRef: findNodeHandle(this.backgroundImage)});
    }

    render() {
        const {effectImageLink} = this.state;

        const EffectAppliedImage = (
            <FastImage
                onLoadEnd={this.onImageContaianer}
                style={[styles.image]}
                source={{
                    uri: effectImageLink,
                }}
                resizeMode={FastImage.resizeMode.contain}
            />
        );

        return (
            <SafeAreaView
                style={styles.container}
            >
                <ScrollView
                    scrollEnabled={false}
                    contentContainerStyle={styles.contentContainer}
                >
                    <View
                        style={styles.imageContainer}
                        ref={(img) => {
                            this.backgroundImage = img;
                        }}
                    >
                        {EffectAppliedImage}
                        {/* <Loading
                            refs={(ref) => {
                                this.loading = ref;
                            }}
                            blur={true}
                            viewRef={this.state.imageRef}
                        /> */}
                    </View>
                </ScrollView>
                <SunEffectList
                    handleApplySunEffect={this.handleApplySunEffect}
                    imageTaken={this.props.navigation.state.params.imageTaken}
                />
            </SafeAreaView>
        );
    }
}
export default connect()(SunEffects);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
    },
    imageContainer: {
        flex: 1,
        width: (Device.screen.width),
        padding: 10,
    },
    image: {
        height: null,
        width: null,
        flex: 1,
    },
});
