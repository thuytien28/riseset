/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

import {AnimatedCircularProgress} from 'react-native-circular-progress';

class Uploading extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            uploading: false,
            loaded: props.loaded,
            total: props.total,
        };
    }

    static propTypes = {
        loaded: PropTypes.number,
        total: PropTypes.number,
        refs: PropTypes.any,
    };

    componentDidMount() {
        if (this.props.refs) {
            this.props.refs(this);
        }
    }

    start = (loaded, total) => {
        this.setState({
            uploading: true,
            loaded,
            total,
        });
    };

    stop = () => {
        this.setState({uploading: false});
    };

    renderProgress = (fill) => {
        const realFill = Number(fill.toFixed(0));
        return (

            <Text style={styles.progressText}>
                {`${realFill}%`}
            </Text>

        );
    }
    render() {
        const {uploading, loaded, total} = this.state;
        const progress = Math.floor((loaded / total) * 100);
        if (!uploading) {
            return null;
        }
        return (
            <View
                style={styles.container}
                pointerEvents={'box-only'}
            >
                <View
                    style={styles.contentContainer}
                >
                    <AnimatedCircularProgress
                        rotation={0}
                        size={60}
                        width={3}
                        fill={progress}
                        tintColor='rgba(255, 149, 0)'
                        backgroundColor='#FFF'
                    >
                        {this.renderProgress}
                    </AnimatedCircularProgress>
                </View>
            </View>
        );
    }
}
export default Uploading;

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFill,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    progressText: {
        color: '#FFF',
        fontSize: 15,
    },
});
