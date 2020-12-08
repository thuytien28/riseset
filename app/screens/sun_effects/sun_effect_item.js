/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';

import {injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import Device from 'app/utils/device';
import AppText from 'app/components/app_text';

class SunEffectItem extends React.PureComponent<Props> {
    static propTypes = {
        item: PropTypes.object,
        intl: PropTypes.object,
        onPress: PropTypes.func,
    };
    static defaultProps = {}

    renderImage = () => {
        const {item, isSelected} = this.props;
        const {image} = item;
        if (item.isDeviceFile) {
            return (
                <Image
                    source={{uri: image}}
                    style={[styles.image, {
                        borderColor: isSelected ? '#B00E00' : 'rgba(0,0,0,0)',
                        borderWidth: isSelected ? 2 : 0,
                    }]}
                    resizeMode='cover'
                />
            );
        }
        return (
            <Image
                source={image}
                style={[styles.image, {
                    borderColor: isSelected ? '#B00E00' : 'rgba(0,0,0,0)',
                    borderWidth: isSelected ? 2 : 0,
                }]}
                resizeMode='contain'
            />
        );
    }

    render() {
        const {item, intl, onPress, isSelected} = this.props;
        const {id, defaultMessage} = item;

        return (
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => onPress()}
                    activeOpacity={0.7}
                    disabled={isSelected}
                >
                    {this.renderImage()}
                </TouchableOpacity>
                <AppText
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}
                    value={intl.formatMessage({id, defaultMessage})}
                    fontText={'SF-Pro-Display-Light'}
                    style={styles.desc}
                />
            </View>
        );
    }
}
export default injectIntl(SunEffectItem);

const styles = StyleSheet.create({
    container: {
        width: Device.screen.width / 6.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        borderRadius: 10,
    },
    image: {
        height: Device.screen.width / 6.5,
        width: Device.screen.width / 6.5,
        borderRadius: 10,
    },
    desc: {
        fontWeight: '300',
        marginTop: 4,
        fontSize: 12,
    },
});
