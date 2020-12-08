/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {FlatList, View, StyleSheet, Platform, ActivityIndicator} from 'react-native';

import PropTypes from 'prop-types';

import PlaceItem from './place_item';
import {debounce} from 'app/actions/helpers';
import AppText from 'app/components/app_text';

class PlaceList extends React.PureComponent<Props> {
    static propTypes = {
        onItemPress: PropTypes.func,
        userId: PropTypes.string,
        onEndReached: PropTypes.func,
        listHeaderComponent: PropTypes.node,
        actions: PropTypes.object,
        locationStory: PropTypes.array,
        lastImageVisible: PropTypes.bool,
        itemSeparatorComponent: PropTypes.func,
        isLoadMore: PropTypes.bool,
    };

    static defaultProps = {
        itemSeparatorComponent: () => (
            <View style={{height: 15}}/>
        ),
    }

    constructor(props) {
        super(props);

        this.onEndReachedCalledDuringMomentum = true;
    }

    componentDidMount() {
        const {userId, actions} = this.props;
        actions.fetchLocationsStory(userId);
    }

    renderItem = ({item}) => {
        return (
            <PlaceItem
                lastImageVisible={this.props.lastImageVisible}
                place={item}
                onPress={() => this.props.onItemPress(item)}
            />
        );
    };

    loadingMoreLocations = debounce(() => {
        this.props.actions.loadMoreLocations(this.props.userId);
    }, 500);

    onEndReached = () => {
        const {isListEnd, actions, userId} = this.props;
        if (isListEnd) {
            return null;
        }

        if (!this.onEndReachedCalledDuringMomentum) {
            actions.loadMoreLocations(userId);
            this.onEndReachedCalledDuringMomentum = true;
        }
    }

    renderFooter = () => {
        const {loadingMore} = this.props;
        if (loadingMore === true) {
            return (
                <View style={{marginVertical: 10}}>
                    <ActivityIndicator
                        color='rgba(0,0,0,0.6)'
                    />
                </View>
            );
        }
        return null;
    }

    render() {
        const {listHeaderComponent, locationStory, itemSeparatorComponent, isLoadMore, intl, contentContainerStyle, loadingStatus} = this.props;
        
        const FlatListProps = {
            ListHeaderComponent: listHeaderComponent,
            data: locationStory,
            renderItem: this.renderItem,
            keyExtractor: (item) => `${item.locationId}`,
            contentContainerStyle: [contentContainerStyle, styles.container],
            ItemSeparatorComponent: itemSeparatorComponent,
        };

        if (isLoadMore) {
            FlatListProps.ListFooterComponent = this.renderFooter;
            FlatListProps.onEndReachedThreshold = Platform.OS === 'ios' ? 0.5 : 0.2;
            FlatListProps.onEndReached = this.onEndReached;
        }

        let Content = (
            <FlatList
                onMomentumScrollBegin={() => {
                    this.onEndReachedCalledDuringMomentum = false;
                }}
                {...FlatListProps}
                showsVerticalScrollIndicator={false}
            />
        );

        // loading success and result is equal 0
        if (loadingStatus === false && locationStory.length === 0) {
            Content = (
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <AppText
                        fontText={'SF-Pro-Display-Light'}
                        style={{fontSize: 17}}
                        value={intl.formatMessage({id: 'no_place', defaultMessage: 'You do not have any place'})}
                    />
                </View>
            );
        }
        return Content;
    }
}

export default PlaceList;

const styles = StyleSheet.create({
    container: {
        paddingBottom: 20,
        backgroundColor: '#FFF',
    },
});