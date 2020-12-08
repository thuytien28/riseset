/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {StyleSheet, SafeAreaView, TextInput, ScrollView, KeyboardAvoidingView, Platform} from 'react-native';

import {Header} from 'react-navigation-stack';

import PropTypes from 'prop-types';
import FontFamilyList from './font_family_list';
import HeaderRight from 'app/components/common/header_right';
import {isIPhoneX} from 'app/utils/screen';
import AppText from 'app/components/app_text';

const DEFAULT_SIGNATURE_FONT = 'SFProDisplay-Regular';

class CreateSignature extends React.PureComponent {
    static propTypes = {
        navigation: PropTypes.object,
    };
    static navigationOptions = ({screenProps, navigation}) => {
        const {intl} = screenProps;
        const {params} = navigation.state;
        const title = intl.formatMessage({id: 'header.title.Signature', defaultMessage: 'Signature'});
        const headerTitle = (
            <AppText
                fontText={'SF-Pro-Display-Medium'}
                style={{fontSize: 17, fontWeight: '500'}}
                value={intl.formatMessage({id: 'header.title.Signature', defaultMessage: 'Signature'})}
            />
        );
        const headerRight = (
            <HeaderRight
                id='save'
                defaultMessage='Save'
                onPress={params && params.onSave}
            />

        );
        return {
            title,
            headerTitle,
            headerRight,
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            signature: props.navigation.state.params.signature || '',
            fontSelected: props.navigation.state.params.signatureFont || DEFAULT_SIGNATURE_FONT,
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({
            onSave: this.onSave,
        });
    }

    onChangeText = (text) => {
        this.setState({signature: text});
    }

    handleSelectFont = (font) => {
        this.setState({
            fontSelected: font,
        });
    }

    onSave = () => {
        const {signature, fontSelected} = this.state;
        const {navigation} = this.props;
        navigation.state.params.chooseSignature(signature, fontSelected);
        navigation.goBack();
    }

    onRight = () => {
        this.onDone();
    }

    onBack = () => {
        this.onDone();
    }
    render() {
        const {signature, fontSelected} = this.state;
        let keyboardVerticalOffset = 0;
        if (Platform.OS === 'ios') {
            if (isIPhoneX()) {
                keyboardVerticalOffset = Header.HEIGHT + 20;
            } else {
                keyboardVerticalOffset = Header.HEIGHT;
            }
        }
        return (

            <SafeAreaView
                style={styles.container}
            >
                <KeyboardAvoidingView
                    style={{flex: 1}}
                    enabled={true}
                    behavior='padding'
                    keyboardVerticalOffset={keyboardVerticalOffset}
                >
                    <ScrollView contentContainerStyle={styles.contentCtn}>
                        <TextInput
                            style={[styles.signature, {fontFamily: fontSelected}]}
                            value={signature}
                            onChangeText={this.onChangeText}
                        />
                    </ScrollView>
                    <FontFamilyList
                        signature={signature}
                        onChangeText={this.onChangeText}
                        fontSelected={fontSelected}
                        handleSelectFont={this.handleSelectFont}

                    />

                </KeyboardAvoidingView>

            </SafeAreaView>
        );
    }
}
export default CreateSignature;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentCtn: {
        flex: 1,
        paddingHorizontal: 16,
    },
    signature: {
        color: '#000',
        fontSize: 24,
        paddingVertical: 20,
    },
});
