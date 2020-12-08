/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Keyboard,
    Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import AppText from 'app/components/app_text';
import ImagePicker from 'react-native-image-crop-picker';
import OptionsDialog from 'app/components/dialog/options_dialog';
import Avatar from 'app/components/avatar';

import HeaderRight from 'app/components/common/header_right';
import LoadingHolder from 'app/utils/loading_holder';

const options = [
    {
        id: 1,
        titleId: 'option.selectFromCamera',
        titleDefMsg: 'Take photo',
    },
    {
        id: 2,
        titleId: 'option.selectFromLibrary',
        titleDefMsg: 'Choose from Library',
    },
];

class EditProfile extends React.PureComponent {
    static navigationOptions = ({navigation, screenProps}) => {
        const {params = {}} = navigation.state;

        // console.warn(params);
        const headerRight = (
            <HeaderRight
                id='save'
                defaultMessage='Save'
                onPress={params && params.onSave}
            />

        );

        return {
            headerTitle: (
                <AppText
                    fontText={'SF-Pro-Display-Medium'}
                    style={{fontSize: 17}}
                    value={screenProps.intl.formatMessage({id: 'screenHeader.title.profile', defaultMessage: 'Profile'})}
                />
            ),
            headerRight,
        };
    };

    constructor(props) {
        super(props);
        const {user} = props;
        this.state = {
            username: user.name,
            avatarSource: user.picture,
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({
            onSave: this.onSave,
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.updateProfile.loading !== this.props.updateProfile.loading &&
            this.props.updateProfile.loading === true
        ) {
            LoadingHolder.start();
        }
        if (prevProps.updateProfile.loading !== this.props.updateProfile.loading &&
            this.props.updateProfile.loading === false &&
            this.props.updateProfile.success === true
        ) {
            LoadingHolder.stop();
            this.props.navigation.goBack();
        }

        // TODO: handle update error
    }

    onChangeDisplayName = (text) => {
        this.setState({
            username: text,
        });
    }

    onSave = () => {
        Keyboard.dismiss();
        const {username, avatarSource} = this.state;
        const {actions} = this.props;
        actions.updateProfile(username, avatarSource);
    }

    onSeletedItem = (item) => {
        if (item.id === 1) {
            if (Platform.OS === 'android') {
                this.optionsDlg.close();
            }
            ImagePicker.openCamera({
                cropping: false,
                mediaType: 'photo',
            }).then((image) => {
                if (Platform.OS === 'ios') {
                    this.optionsDlg.close();
                }
                this.setState({
                    avatarSource: image.path,
                });
            });
        } else {
            if (Platform.OS === 'android') {
                this.optionsDlg.close();
            }
            ImagePicker.openPicker({
                cropping: false,
                mediaType: 'photo',
            }).then((image) => {
                if (Platform.OS === 'ios') {
                    this.optionsDlg.close();
                }
                this.setState({
                    avatarSource: image.path,
                });
            });
        }
    }

    render() {
        const {screenProps} = this.props;
        const {username, avatarSource} = this.state;
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.avaContainer}>
                        <Avatar ava={avatarSource}/>
                        <TouchableOpacity
                            style={styles.update}
                            onPress={() => {
                                this.optionsDlg.open();
                            }}
                        >
                            <AppText
                                fontText={'SF-Pro-Display-Light'}
                                style={styles.text}
                                value={screenProps.intl.formatMessage({id: 'profile.updateAvatar', defaultMessage: 'Update Avatar'})}
                            />
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={styles.textbox}
                        value={username}
                        onChangeText={(text) => this.onChangeDisplayName(text)}
                    />
                </ScrollView>

                <OptionsDialog
                    optionsDlg={
                        (ref) => {
                            this.optionsDlg = ref;
                        }
                    }
                    onSeletedItem={(item) => {
                        this.onSeletedItem(item);
                    }}
                    data={options}
                />
            </SafeAreaView>
        );
    }
}

EditProfile.propTypes = {
    navigation: PropTypes.object,
    user: PropTypes.object,
    screenProps: PropTypes.object,
    actions: PropTypes.object,
    updateProfile: PropTypes.object,
};

export default EditProfile;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    rightHeader: {
        marginRight: 16,
    },
    update: {
        marginTop: 10,
    },
    text: {
        fontSize: 14,
        color: '#E53D01',
        textDecorationLine: 'underline',
        padding: 10,
    },
    textbox: {
        color: '#000',
        borderWidth: 0.5,
        borderColor: '#E53D01',
        borderRadius: 5,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 55,
        height: 45,
        textAlign: 'center',
    },
    avaContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    background3: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 108,
        height: 108,
        borderRadius: 54,
        backgroundColor: '#FFF',
        elevation: 3,
    },
    ava: {
        width: 93,
        height: 93,
        borderRadius: 54,
    },
});

