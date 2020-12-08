/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from 'react-native';

import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';

import AppText from 'app/components/app_text';
import Icon from 'app/components/icon';

class Header extends React.PureComponent<Props> {
    static propTypes = {
        intl: PropTypes.object,
        navigation: PropTypes.object,
        userPicture: PropTypes.string,
    };

    onPressAva = () => {
        this.props.navigation.navigate('Profile');

    }

    onPressAddStory = () => {
        this.props.navigation.push('MediaStack');

        // this.props.navigation.navigate('Library');
    }

    render() {
        const {intl, userPicture} = this.props;

        return (
            <View style={styles.container}>
                <AppText
                    fontText={'SF-Pro-Display-Light'}
                    style={styles.stoiresText}
                    value={intl.formatMessage({id: 'screenHeader.title.stories', defaultMessage: 'Stories'})}
                />

                <View style={styles.rightContainer}>

                    <TouchableOpacity
                        style={styles.newStoriesCtn}
                        onPress={this.onPressAddStory}
                    >
                        <Icon
                            type='AntDesign'
                            name={'plus'}
                            size={13}
                        />

                        <AppText
                            style={styles.rightTextStyle}
                            value={intl.formatMessage({id: 'newStories', defaultMessage: 'New Story'})}
                        />

                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.avatarCtn}
                        onPress={this.onPressAva}
                    >
                        <View style={styles.imageCtn}>
                            <FastImage
                                style={styles.image}
                                source={{uri: userPicture}}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default Header;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: (60),
        paddingTop: (20),
        paddingLeft: (20),
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    stoiresText: {
        fontSize: (24),
        fontWeight: '300',
    },

    newStoriesCtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarCtn: {
        paddingLeft: 10,
        paddingRight: 20,
    },

    rightContainer: {
        height: '100%',
        flexDirection: 'row',
    },
    rightTextStyle: {
        fontSize: (13),
        marginLeft: (5),
    },
    icon: {
        height: (33),
        width: (33),
        borderRadius: (18),
        borderColor: '#DFDDDD',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
        marginTop: 12,
    },
    imageCtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#E53D01',
        padding: 2,
    },

    image: {
        width: null,
        height: null,
        borderRadius: 20,
        flex: 1,
    },
});
