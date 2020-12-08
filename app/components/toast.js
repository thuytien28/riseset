/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

import AppText from 'app/components/app_text';

class Toast extends React.PureComponent<Props> {
    static propTypes = {
        message: PropTypes.string,
    };
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            message: '',
        };
    }

    componentDidMount() {
        if (this.props.refs) {
            this.props.refs(this);
        }
    }

    show = (message) => {
        this.setState({visible: true, message}, () => {
            this.hide();
        });
    };

    hide = () => {
        setTimeout(() => {
            this.setState({visible: false, message: ''});
        }, 2000);
    }

    render() {
        const {visible, message} = this.state;
        if (!visible) {
            return null;
        }

        return (
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    <AppText
                        numberOfLines={1}
                        adjustsFontSizeToFit={true}
                        value={message}
                        style={styles.message}
                    />
                </View>
            </View>

        );
    }
}
export default Toast;

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        height: 120,
        width: 120,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 10,
    },
    message: {
        color: '#FFF',
        fontSize: 24,
    },
});
