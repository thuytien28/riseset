/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {View, Text, StyleSheet, Animated, TouchableOpacity, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import AppText from 'app/components/app_text';
import AppIcon from 'assets/icons/AppIcon';
import FormattedDate from 'app/components/formatted_date';
import FormattedTime from 'app/components/formatted_time';

class Info extends React.PureComponent<Props> {
    static propTypes = {}
    static defaultProps = {}

    renderTime(item) {
        const dateProps = {
            value: item.photoTakenTime,
            month: 'short',
            day: '2-digit',
            style: styles.createAt,
        };
        const CURRENT_YEAR = new Date().getFullYear();
        const STORY_YEAR = new Date(item.photoTakenTime).getFullYear();

        if (CURRENT_YEAR !== STORY_YEAR) {
            dateProps.year = 'numeric';
        }

        let SunIcon = (
            <AppIcon
                name={'sun-set'}
                color={'#FFF'}
                size={29}
            />
        );

        if ((item.isRiseSet.toLowerCase() === 'sunrise')) {
            SunIcon = (
                <AppIcon
                    name={'sun-rise'}
                    color={'#FFF'}
                    size={29}
                />
            );
        }

        return (
            <View>
                <View style={{flexDirection: 'row'}}>
                    <FormattedDate
                        {...dateProps}
                    />
                    <Text>{' '}</Text>
                    <FormattedTime
                        value={item.storyCreateAt}
                        hour12={true}
                        style={styles.createAt}
                    />
                </View>
                {SunIcon}
            </View>
        );
    }

    renderBottom = (item) => {
        return (
            <View
                style={styles.bottomCtn}
            >
                <AppText
                    numberOfLines={2}
                    adjustsFontSizeToFit={true}
                    style={[styles.place, {fontSize: 15}]}
                >
                    {item.locationName}
                </AppText>
                <AppText
                    numberOfLines={2}
                    adjustsFontSizeToFit={true}
                    style={styles.place}
                >
                    {item.address}
                </AppText>
                <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}
                    style={{
                        color: '#FFF',
                        fontFamily: item.signatureFont ? item.signatureFont : null,
                    }}
                >
                    {item.signature ? item.signature : 'Unknow'}
                </Text>
            </View>
        );
    }

    render() {
        const {screenProps, story, imageAnimation, isDisplayNoteFull, showMoreNote, showFullImage} = this.props;

        if (!story) {
            return null;
        }
        const {note} = story;

        const opacityFullImage = imageAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
        });

        let ReadMore = null;
        let formattedNote = note;
        const MAX_LENGTH_NOTE_TO_READ_MORE = 70;

        if (formattedNote.length > MAX_LENGTH_NOTE_TO_READ_MORE) {
            formattedNote = note.substring(0, MAX_LENGTH_NOTE_TO_READ_MORE) + '...';
        }

        if (isDisplayNoteFull) {
            formattedNote = note;
        }

        if (!isDisplayNoteFull && note && note.length > MAX_LENGTH_NOTE_TO_READ_MORE) {
            ReadMore = (
                <AppText
                    style={styles.readMore}
                    onPress={showMoreNote}
                    value={screenProps.intl.formatMessage({id: 'readMore', defaultMessage: '[Read more]'})}

                />
            );
        }
        return (
            <Animated.View
                style={{
                    flex: 1,
                    justifyContent: 'space-between',
                    paddingHorizontal: 21,
                    paddingBottom: 10,
                    opacity: opacityFullImage,
                }}
            >
                {this.renderTime(story)}
                <View style={styles.noteWrapper}>
                    <TouchableOpacity
                        style={{height: '100%'}}
                        onPress={showFullImage}
                        activeOpacity={1}
                    />
                    <View>
                        <ScrollView
                            scrollEnabled={isDisplayNoteFull}
                            showsVerticalScrollIndicator={false}
                            ellipsizeMode={'tail'}
                        >
                            <View>
                                <Animated.Text
                                    style={styles.txtNote}
                                    onPress={showMoreNote}
                                >
                                    {formattedNote}
                                </Animated.Text>
                                {ReadMore}
                            </View>
                        </ScrollView>
                    </View>
                </View>
                {this.renderBottom(story)}
            </Animated.View>
        );
    }
}
export default Info;

const styles = StyleSheet.create({
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
    readMore: {
        color: '#FFF',
        fontWeight: '500',
        opacity: 0.5,
    },
});
