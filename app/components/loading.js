/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import {ActivityIndicator, StyleSheet, View, ViewPropTypes, Platform} from 'react-native';
import PropTypes from 'prop-types';

import {BlurView} from '@react-native-community/blur';

import {changeOpacity} from 'app/utils/theme';

export default class Loading extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: props.isLoading || false,
        };
    }

    componentDidMount() {
        if (this.props.refs) {
            this.props.refs(this);
        }
    }

    start = (blur, viewRef) => {
        this.setState({
            loading: true,
            blur,
            viewRef,
        });
    };

    stop = () => {
        this.setState({loading: false});
    };

    static propTypes = {
        color: PropTypes.string,
        isLoading: PropTypes.any,
        refs: PropTypes.any,
        size: PropTypes.string,
        style: PropTypes.object,
        containerStyle: PropTypes.oneOfType([ViewPropTypes.style, PropTypes.object, PropTypes.array]),
    };

    static defaultProps = {
        size: 'large',
        color: changeOpacity('#FFF', 1),
        style: {},
    };

    render() {
        const {style, containerStyle} = this.props;
        const {blur, viewRef} = this.state;
        const {loading} = this.state;
        if (!loading) {
            return null;
        }
        if (blur) {
            if (Platform.OS === 'ios') {
                return (
                    <BlurView
                        style={styles.container}
                        blurType='light'
                        blurAmount={10}
                    >
                        <View style={styles.contentContainer}>
                            <ActivityIndicator
                                style={[style]}
                                animating={true}
                                size={this.props.size}
                                color={this.props.color}
                            />
                        </View>
                    </BlurView>
                );
            }
            return (
                <View style={[styles.container, containerStyle]}>
                    <View style={styles.contentContainer}>
                        <ActivityIndicator
                            style={[style]}
                            animating={true}
                            size={this.props.size}
                            color={this.props.color}
                        />
                    </View>
                </View>
            );
        }
        return (
            <View
                style={[styles.container, containerStyle]}
                pointerEvents={'box-only'}
            >
                <View style={styles.contentContainer}>
                    <ActivityIndicator
                        style={[style]}
                        animating={true}
                        size={this.props.size}
                        color={this.props.color}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },

    contentContainer: {
        borderRadius: 8,
        backgroundColor: changeOpacity('#000', 0.6),
        padding: 10,
        elevation: undefined,
    },

    text: {
        color: changeOpacity('#FFF', 1),
    },
});
