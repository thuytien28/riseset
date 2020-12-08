/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

import PropTypes from 'prop-types';
import AppText from 'app/components/app_text';
import AppIcon from 'assets/icons/AppIcon';
import Header from 'app/screens/profile/header';
import PlaceList from 'app/components/place_list';
import ModalLogin from 'app/components/modal_login';
class Profile extends React.PureComponent {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            headerTitle: (
                <AppText
                    fontText={'SF-Pro-Display-Medium'}
                    style={{fontSize: 17}}
                    value={screenProps.intl.formatMessage({id: 'screenHeader.title.profile', defaultMessage: 'Profile'})}
                />
            ),
            headerRight: (
                <TouchableOpacity
                    style={styles.rightHeader}
                    onPress={() => navigation.openDrawer()}
                >
                    <AppIcon
                        name={'menu'}
                        size={20}
                    />
                </TouchableOpacity>
            ),
        };
    };

    state = {
        modalVisible: false,
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    render() {
        const {screenProps, navigation} = this.props;
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <Header
                    intl={screenProps.intl}
                    navigation={navigation}
                    setModalVisible={(visible) => this.setModalVisible(visible)}
                />
                <PlaceList

                    // listHeaderComponent={
                    //     <Header
                    //         intl={screenProps.intl}
                    //         navigation={navigation}
                    //     />
                    // }
                    onItemPress={(item) => {
                        navigation.navigate('PlaceDetails', {
                            placeDetail: item.location,
                        });
                    }}
                    isLoadMore={false}
                    displayElementLimit={5}
                    intl={screenProps.intl}
                />
                <ModalLogin
                    intl={screenProps.intl}
                    navigation={navigation}
                    modalVisible={this.state.modalVisible}
                    setModalVisible={(visible) => this.setModalVisible(visible)}
                />
            </ScrollView>
        );
    }
}

Profile.propTypes = {
    navigation: PropTypes.object,
    screenProps: PropTypes.object,
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    rightHeader: {
        paddingHorizontal: 10,
        height: '100%',
        justifyContent: 'center',
    },
    text: {
        fontSize: 15,
        marginBottom: 7,
    },
});

