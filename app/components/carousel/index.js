/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
/* eslint-disable multiline-ternary */
import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Dimensions,
} from 'react-native';

import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';
import {withNavigation} from 'react-navigation';

import Carousel from 'react-native-snap-carousel';
import Device from '../../utils/device';
import CarouselItem from './carousel_item';
import CarouselHeaderItem from 'app/components/carousel/carousel_header_item';
import NewStory from 'app/screens/home/new_story.js';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

class CarouselCmp extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            image: true,
            camera: false,
            sun: false,
            stories: [],
            count: 0,
        };
        this.onEndReachedCalledDuringMomentum = true;
    }

    onNavigateToStoryDetail = (storyId) => {
        this.props.onNavigateToStoryDetail(storyId);
    }

    onEndReached = () => {
        if (!this.onEndReachedCalledDuringMomentum) {
            this.props.handleOnEndReached();
            this.onEndReachedCalledDuringMomentum = true;
        }
    }

    renderItem = ({item, index}) => {
        const {carouselHeader} = this.props;
        const image = require('assets/images/quotes/DE323-min.png');

        if (carouselHeader && index === 0) {
            return (
                <View
                    activeOpacity={0.8}
                    style={styles.item}
                    onPress={() => {
                        this.onNavigateToQuote(image, this.props.quote);
                    }}
                >
                    <CarouselHeaderItem
                        quote={this.props.quote}
                        bgImage={image}
                    />
                </View>
            );
        }

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.item}
                onPress={() => {
                    this.onNavigateToStoryDetail(item.id);
                }}
            >
                <CarouselItem
                    item={item}
                />

            </TouchableOpacity>
        );
    }

    onNavigateToQuote = (quoteImage, quote) => {
        const {navigation} = this.props;
        // console.log(quote);
        navigation.navigate(
            'Quote',
            {
                quoteImage,
                quote,
            }
        );
    }

    render() {
        const {data} = this.props;
        const {carouselHeader} = this.props;
        const id = uuidv4();
        // console.log(data);
        if (carouselHeader) {
            data.unshift({id});
        }
        return (
            <View style={styles.container}>
                <Carousel
                    contentContainerCustomStyle={styles.contentContainer}
                    sliderWidth={SCREEN_WIDTH}
                    sliderHeight={450}
                    itemWidth={(4 * Device.screen.width) / 5}
                    data={data}
                    keyExtractor={(item, index) => item.id}
                    renderItem={this.renderItem}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={0.5}
                    onMomentumScrollBegin={() => {
                        this.onEndReachedCalledDuringMomentum = false;
                    }}
                    inactiveSlideOpacity={1}
                />
            </View>
        );
    }
}

export default withNavigation(CarouselCmp);

CarouselCmp.propTypes = {
    carouselHeader: PropTypes.bool,
    data: PropTypes.array,
    handleOnEndReached: PropTypes.func,
    onNavigateToStoryDetail: PropTypes.func,
    quote: PropTypes.object,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    contentContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        marginVertical: 20,
        marginHorizontal: 10,
        backgroundColor: '#FFF',
        height: (3 * Device.screen.height) / 5,
        borderRadius: 10,
        elevation: 8,
        shadowColor: 'rgba(0,0,0,0.5)',
        shadowOffset: {
            width: 1,
            height: 4,
        },
        shadowOpacity: 1,
        shadowRadius: 7,
    },
});