/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';

import PropTypes from 'prop-types';

import {injectIntl} from 'react-intl';

import Device from 'app/utils/device';
import {withNavigation} from 'react-navigation';
import AppText from 'app/components/app_text';

class NewStory extends React.PureComponent {
    onPressAddStory = () => {
        this.props.navigation.navigate('MediaStack');
    }

    render() {
        const {intl} = this.props;
        return (
            <View
                style={styles.container}
                onPress={this.onPressAddStory}
            >
                <View>
                    <Image
                        style={[styles.storieImage]}
                        source={require('assets/images/create-new-story.png')}
                    />
                </View>
                <View>
                    <AppText
                        value={intl.formatMessage({id: 'create_new_story', defaultMessage: 'CREATE NEW STORY'})}
                        style={styles.createNew}
                    />
                </View>
            </View>
        );
    }
}

NewStory.propTypes = {
    intl: PropTypes.object,
    navigation: PropTypes.object,
};

export default injectIntl(withNavigation(NewStory));

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    contentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 45,
        marginHorizontal: 50,
        backgroundColor: '#FFF',
        height: (3 * Device.screen.height) / 5,
        borderRadius: 10,
        elevation: 8,
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOffset: {
            width: 1,
            height: 4,
        },
        shadowOpacity: 1,
        shadowRadius: 7,
    },
    storieImage: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 47,
        height: 47,
    },
    createNew: {
        color: '#CDCDCD',
        fontSize: 13,
        paddingTop: 20,
    },
});