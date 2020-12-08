/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    StatusBar,
} from 'react-native';

import PropTypes from 'prop-types';

import FormattedText from 'app/components/formatted_text';
import AppText from 'app/components/app_text';
import AppIcon from 'assets/icons/AppIcon';
import CarouselCmp from 'app/components/carousel';

// eslint-disable-next-line react/require-optimization
class PlaceDetails extends React.Component {
    constructor(props) {
        super(props);

        props.navigation.addListener('willFocus', () => {
            StatusBar.setHidden(false);
        });
    }

    static navigationOptions = ({screenProps}) => {
        return {
            headerTitle: (
                <AppText
                    fontText={'SF-Pro-Display-Medium'}
                    style={{fontSize: 17}}
                    value={screenProps.intl.formatMessage({id: 'screenHeader.title.placeDetails', defaultMessage: 'Place Details'})}
                />
            ),
        };
    };

    componentDidMount() {
        this.fetchStories();
    }

    fetchStories = () => {
        const {navigation} = this.props;
        const {actions, userId} = this.props;

        actions.fetchStoriesByLocationId(
            navigation.getParam('placeDetail').id,
            userId,
        );
    }

    onNavigateToStoryDetails = (storyId) => {
        const {navigation} = this.props;

        navigation.navigate('StoryDetails', {
            storyId,
        });
    }

    handleOnEndReached = () => {
        const {actions, userId, navigation} = this.props;

        actions.loadMoreLocationStories(
            navigation.getParam('placeDetail').id,
            userId,
        );
    }

    render() {
        const {placeDetail} = this.props.navigation.state.params;
        const {navigation} = this.props;
        const {stories} = this.props;

        if (!stories) {
            return null;
        }

        const Top = (
            <View style={styles.topBody}>
                <AppText
                    style={styles.titleText}
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    fontText={'SF-Pro-Display-Semibold'}
                    value={placeDetail.name}
                />
                <View style={styles.detailText}>
                    <View style={styles.locationText}>
                        <AppText
                            style={styles.placeDetail}
                            numberOfLines={1}
                            ellipsizeMode={'tail'}
                            fontText={'SF-Pro-Display-Light'}
                            value={placeDetail.address}
                        />
                    </View>
                </View>
            </View>
        );

        const Body = (
            <CarouselCmp
                onNavigateToStoryDetail={(storyId) => this.onNavigateToStoryDetails(storyId)}
                data={stories}
                handleOnEndReached={() => this.handleOnEndReached()}
            />
        );

        const Bottom = (
            <TouchableOpacity
                style={styles.bottomBody}
                onPress={() => {
                    navigation.push('MapDiscover', {
                        locationId: placeDetail.id,
                    });
                }}
            >
                <View style={styles.viewOnMap}>
                    <View style={styles.leftIcon}>
                        <AppIcon
                            name='place'
                            size={(17)}
                            color='#e53d01'
                        />
                    </View>
                    <AppText
                        style={styles.title}
                        numberOfLines={1}
                        adjustsFontSizeToFit={true}
                    >
                        <FormattedText
                            id='placeDetail.body.viewOnMap'
                            defaultMessage='VIEW ON MAP'
                        />
                    </AppText>
                </View>
            </TouchableOpacity>
        );

        return (
            <SafeAreaView style={styles.container}>
                {Top}
                {Body}
                {Bottom}
            </SafeAreaView>
        );
    }
}

PlaceDetails.propTypes = {
    actions: PropTypes.object,
    navigation: PropTypes.object,
    stories: PropTypes.array,
    userId: PropTypes.string,
};

export default PlaceDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },

    rightHeader: {
        marginRight: 16,
    },

    topBody: {
        paddingHorizontal: (50),
        paddingTop: (30),
    },

    titleText: {
        fontWeight: '700',
        paddingBottom: (5),
        flexDirection: 'row',
        justifyContent: 'space-between',
        color: '#24253D',
        fontSize: 15,
    },

    detailText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    locationText: {
        width: '100%',
    },

    placeDetail: {
        // color: '#000',
        color: 'rgba(36, 37, 61, 0.5)',
        fontSize: 13,
    },

    bottomBody: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 130,
    },

    viewOnMap: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },

    leftIcon: {
        borderRadius: (5),
        marginRight: (5.5),
    },

    title: {
        color: '#e53d01',
    },

    modal: {
        padding: 0,
        margin: 0,
        justifyContent: 'flex-end',
        borderBottomColor: '#FFF',
    },
    textSpecial: {color: '#FF4081'},
});
