/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {
    StyleSheet,
    SafeAreaView,
    Platform,
    Dimensions,
    Alert,
    TouchableOpacity,
    Animated,
    StatusBar,
    View,
} from 'react-native';
import PropTypes from 'prop-types';
import RNFS from 'react-native-fs';
import Orientation from 'react-native-orientation-locker';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import Header from './header';
import uuidv4 from 'uuid/v4';
import FastImage from 'react-native-fast-image';
import Info from './info';
import LoadingHolder from 'app/utils/loading_holder';

class StoryDetails extends React.PureComponent {
    static propTypes = {
        navigation: PropTypes.object,
        screenProps: PropTypes.object,
        story: PropTypes.object,
        actions: PropTypes.object,
    };

    constructor(props) {
        super(props);
        Orientation.unlockAllOrientations();
        this.state = {
            isDisplayNoteFull: false,
            isFullImage: false,
            path: '',
            imageFrame: {
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
            },
            downloadState: 'not_download',
        };
        const {navigation} = this.props;

        navigation.addListener('willFocus', () => {
            if (Platform.OS === 'ios') {
                StatusBar.setHidden(true);
            }
            Orientation.unlockAllOrientations();
            Orientation.addOrientationListener(this.onOrientationChange);
        });

        navigation.addListener('willBlur', () => {
            StatusBar.setHidden(false);
            Orientation.lockToPortrait();
        });

        this.textAnimation = new Animated.Value(0);
        this.imageAnimation = new Animated.Value(0);
    }

    componentDidMount() {
        this.downloadImage();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.story !== this.props.story && !(this.props.story)) {
            this.props.navigation.goBack();
        }
    }

    componentWillUnmount() {
        this.removeCacheImage();
        Orientation.removeOrientationListener(this.onOrientationChange);
        Orientation.lockToPortrait();
    }

    onOrientationChange = (orientation) => {
        // console.log('orientation', orientation);

        this.setState({
            imageFrame: {
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
            },
        });
    }

    removeCacheImage = () => {
        const {path} = this.state;
        if (!path) {
            return;
        }
        RNFS.unlink(path).
            then(() => {
                // console.log('sucess');
            }).
            catch((err) => {
                // console.log(err.message);
            });
    }

    onNavigateToEditNote() {
        const {story, navigation} = this.props;
        navigation.navigate('YourStory', {
            story,
            isUpdateNote: true,
        });
    }

    showMoreNote = () => {
        if (this.state.isFullImage) {
            return;
        }

        if (this.state.isDisplayNoteFull) {
            this.setState({
                isDisplayNoteFull: false,
            });
            Animated.timing(this.textAnimation, {
                toValue: 0,
                duration: 300,
            }).start();
        } else {
            this.setState({
                isDisplayNoteFull: true,
            });
            this.textAnimation.setValue(0);
            Animated.timing(this.textAnimation, {
                toValue: 1,
                duration: 800,
            }).start();
        }
    }

    showFullImage = () => {
        const {isFullImage, isDisplayNoteFull} = this.state;
        if (isDisplayNoteFull) {
            this.showMoreNote();
            return;
        }

        this.setState({
            isFullImage: !isFullImage,
        });
    }

    getImageFromService = async (path, story) => {
        const {locationName, address, photoTakenTime, signatureFont, signature} = story;
        const date = new Date(photoTakenTime);
        const day = moment(date).format('YYYY-MM-DD');
        let hour = date.getHours() % 12 || 12;
        let minute = date.getMinutes();
        minute = minute >= 10 ? minute : '0' + minute;
        hour = hour >= 10 ? hour : '0' + hour;
        const t = date.getHours() >= 12 ? ' PM' : ' AM';
        const time = ' ' + hour + ':' + minute + t;
        const API = `https://ai.riseset.io/api/signature/query?location=${locationName}&city=${address}&time=${day + time}&signature=${signature}&font=${signatureFont}`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };
        const FILE = (Platform.OS === 'ios') ? path.replace('file://', '') : path;
        const file = {
            uri: FILE,
            type: 'image/png',
            name: FILE.split('/').pop(),
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
            return {
                error,
            };
        }
    }

    downloadImage = async () => {
        if (this.state.downloadState !== 'not_download') {
            return;
        }
        this.setState({downloadState: 'downloading'});

        const {story} = this.props;
        const {images} = story;
        const url = images ? images[0].url : '';
        const extension = (Platform.OS === 'android') ? 'file://' : '';
        const name = uuidv4();
        const path = `${extension}${RNFS.CachesDirectoryPath}/${name}.png`;

        RNFS.downloadFile({
            fromUrl: url,
            toFile: path,
        }).promise.
            then(async () => {
                //if no applied effect image then request server to get link image
                const {data, error} = await this.getImageFromService(path, story);
                if (error) {
                    // handle error
                    const {intl} = this.props.screenProps;
                    Alert.alert(
                        intl.formatMessage({id: 'error', defaultMessage: 'Error'}),
                        intl.formatMessage({id: 'common.error', defaultMessage: 'Something wrong, Please try again.'}),
                    );
                }
                if (data) {
                    if (data.path) {
                        const extension = (Platform.OS === 'android') ? 'file://' : '';
                        const name = uuidv4();
                        const pathImage = `${extension}${RNFS.CachesDirectoryPath}/${name}.png`;
                        RNFS.downloadFile({
                            fromUrl: data.path,
                            toFile: pathImage,
                        }).promise.
                            then(() => {
                                this.setState({
                                    path: pathImage,
                                    downloadState: 'completed',
                                });
                            }).
                            catch((err) => {
                                this.setState({
                                    downloadState: 'not_download',
                                });
                                console.log(err);
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
            }).
            catch((err) => {
                this.setState({
                    downloadState: 'not_download',
                });
                console.log(err);
            });
    };

    renderBackGround = () => {
        const {story} = this.props;
        const {imageFrame, isDisplayNoteFull, isFullImage} = this.state;
        const {images} = story;
        const image = images ? images[0].url : '';

        const opacityContainer = this.textAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.7],
        });

        const backgroundColor = this.textAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: ['transparent', '#000'],
        });

        return (
            <TouchableOpacity
                style={{
                    width: imageFrame.width,
                    height: imageFrame.height,
                    position: 'absolute',
                    justifyContent: 'space-between',
                }}
                activeOpacity={1}
                onPress={() => this.showFullImage()}
            >
                <View
                    style={{
                        flex: 1,
                        position: 'absolute',
                        width: imageFrame.width,
                        height: imageFrame.height,
                    }}
                >
                    <FastImage
                        style={{flex: 1}}
                        source={{
                            uri: image,
                        }}
                        resizeMode={'contain'}
                    />
                </View>
                {!isDisplayNoteFull && !isFullImage &&
                    <LinearGradient
                        style={{
                            width: imageFrame.width,
                            height: (imageFrame.width * 167) / 375,
                        }}
                        colors={['#24253D', 'rgba(36, 37, 61, 0)']}
                    />
                }
                {!isDisplayNoteFull && !isFullImage &&
                    <LinearGradient
                        style={{
                            width: imageFrame.width,
                            height: (imageFrame.width * 163) / 375,
                        }}
                        colors={['rgba(0, 0, 0, 0)', '#000']}
                        start={{x: 0, y: 0}}
                        end={{x: 0, y: 0.5}}
                    />
                }
                <Animated.View
                    style={{
                        flex: 1,
                        position: 'absolute',
                        width: imageFrame.width,
                        height: imageFrame.height,
                        backgroundColor,
                        opacity: opacityContainer,
                    }}
                />

            </TouchableOpacity>
        );
    }

    render() {
        const {navigation, screenProps, story, actions} = this.props;
        const {path, downloadState, isFullImage} = this.state;
        if (!story) {
            return null;
        }

        const opacityFullImage = this.imageAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
        });

        const {isDisplayNoteFull} = this.state;

        return (
            <SafeAreaView style={styles.container}>
                {this.renderBackGround()}
                {
                    !isFullImage &&
                        <Header
                            onLeftIcon={() => {
                                navigation.goBack();
                            }}
                            onNavigateToEditNote={() => {
                                this.onNavigateToEditNote();
                            }}
                            leftIconSize={(20)}
                            intl={screenProps.intl}
                            opacity={opacityFullImage}
                            actions={actions}
                            navigation={navigation}
                            storyId={story.id}
                            locationId={story.locationId}
                            userId={story.userId}
                            downloadImage={this.downloadImage}
                            onPressShare={this.onPressShare}
                            path={path}
                            loading={LoadingHolder}
                            downloadState={downloadState}
                        />
                }
                {
                    !isFullImage &&
                        <Info
                            screenProps={screenProps}
                            story={story}
                            imageAnimation={this.imageAnimation}
                            isDisplayNoteFull={isDisplayNoteFull}
                            showMoreNote={this.showMoreNote}
                            showFullImage={this.showFullImage}
                        />
                }
                {
                    isFullImage &&
                        <TouchableOpacity
                            style={{height: '100%'}}
                            onPress={() => this.showFullImage()}
                            activeOpacity={1}
                        />
                }
            </SafeAreaView>
        );
    }
}

export default StoryDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    bottomCtn: {
        marginTop: 10,
    },
    noteWrapper: {
        flex: 1,
        justifyContent: 'flex-end',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.34)',
        paddingBottom: 10,
        paddingTop: 25,
    },
    txtNote: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '400',
        fontFamily: Platform.OS === 'andoroid' ? 'SFProDisplay-Regular' : null,

        // textAlign: 'justify',
    },
    place: {
        fontSize: 13,
        fontFamily: 'BaiJamjuree-Medium',
        color: '#FFF',
    },
    hours: {
        fontSize: 15,
        fontFamily: 'BaiJamjuree-Medium',
        color: '#FFF',
    },
    createAt: {
        fontSize: 15,
        color: '#FFF',
        fontWeight: '600',
        paddingBottom: 5,
    },
    textTime: {
        fontSize: 15,
    },

    readMore: {
        color: '#FFF',
        fontWeight: '500',
        opacity: 0.5,
    },
});
