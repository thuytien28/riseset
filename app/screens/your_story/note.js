/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {
    StyleSheet,
    KeyboardAvoidingView,
    TextInput,
    Platform,
    TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';
import { Header } from 'react-navigation-stack';
import { isIPhoneX } from 'app/utils/screen';

export default class Note extends React.PureComponent<Props> {
    static propTypes = {
        onChangeNote: PropTypes.func,
        value: PropTypes.string,
        intl: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {
            note: '',
        };
    }

    render() {
        const { value, intl } = this.props;
        let noteFontSize = 17;

        if (value !== '') {
            noteFontSize = 15;
        }

        let keyboardVerticalOffset = 0;
        if (Platform.OS === 'ios') {
            if (isIPhoneX()) {
                keyboardVerticalOffset = Header.HEIGHT + 20;
            } else {
                keyboardVerticalOffset = Header.HEIGHT;
            }
        }

        const KeyboardAvoidingViewProps = {
            style: styles.container,
            enabled: true,
            keyboardVerticalOffset,
        };

        if (Platform.OS === 'ios') {
            KeyboardAvoidingViewProps.behavior = 'padding';
        }

        return (
            <KeyboardAvoidingView
                {...KeyboardAvoidingViewProps}
            >
                <TextInput
                    ref={'textinput'}
                    style={[styles.text, {
                        fontSize: noteFontSize,
                    }]}

                    multiline={true}
                    placeholder={intl.formatMessage({
                        id: 'yourMind', defaultMessage: 'What’s on your mind?',
                    })}
                    onChangeText={this.props.onChangeNote}
                    value={value}
                    onFocus={this.onNoteFocus}
                />

            </KeyboardAvoidingView>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    text: {
        flex: 1,
        textAlignVertical: 'top',
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 20,
    },
});