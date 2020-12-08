/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import {View, Text, StyleSheet, Modal, TouchableOpacity} from 'react-native';

import PropTypes from 'prop-types';
import FormattedText from 'app/components/formatted_text';
import textStyle from 'app/themes/text.style';
import Device from 'app/utils/device';

const FONT_SIZE_LARGE = 17;
const PRIMARY_TITLE_COLOR = '#24253D';

class ConfirmDialog extends React.PureComponent {
    static propTypes = {
        dialogType: PropTypes.string,
        titleId: PropTypes.string,
        titleDefMsg: PropTypes.string,
        contentId: PropTypes.string,
        contentDefMsg: PropTypes.string,
        footerCancelId: PropTypes.string,
        footerCancelDefMsg: PropTypes.string,
        footerOkId: PropTypes.string,
        footerOkDefMsg: PropTypes.string,
    };

    static defaultProps = {
        footerCancelId: 'button.cancel',
        footerCancelDefMsg: 'CANCEL',
        footerOkId: 'button.ok',
        footerOkDefMsg: 'OK',
    };
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
    }

    componentDidMount() {
        if (this.props.dialogRef) {
            this.props.dialogRef(this);
        }
    }

    open = () => {
        this.setState({visible: true});
    };

    close = () => {
        this.setState({visible: false});
    };

    onCancel = () => {
        this.close();
    };

    emptyFunction = () => {
        return null;
    };

    render() {
        const {visible} = this.state;
        const {
            dialogType,
            titleId,
            titleDefMsg,
            contentId,
            contentDefMsg,
            footerCancelId,
            footerCancelDefMsg,
            footerOkId,
            footerOkDefMsg,
            onOk,
        } = this.props;

        const headerComponent = (
            <Text style={styles.title}>
                <FormattedText
                    id={titleId || 'common.label.riseset'}
                    defaultMessage={titleDefMsg || 'common.label.riseset'}
                />
            </Text>
        );

        const contentComponent = (
            <Text
                numberOfLines={2}
                adjustsFontSizeToFit={true}
                style={styles.content}
            >
                <FormattedText
                    id={contentId}
                    defaultMessage={contentDefMsg}
                    style={textStyle.textNormalLight}
                />
            </Text>
        );

        const footerComponent = (
            <View style={[styles.footerContainer]}>
                <TouchableOpacity
                    onPress={this.onCancel}
                    style={[styles.footerBtnContainer]}
                >
                    <FormattedText
                        id={footerCancelId}
                        defaultMessage={footerCancelDefMsg}
                        style={textStyle.textNormalLight}
                    />
                </TouchableOpacity>

                <View style={styles.separatorBtn}/>
                <TouchableOpacity
                    onPress={() => onOk()}
                    style={[styles.footerBtnContainer]}
                >
                    <FormattedText
                        id={footerOkId}
                        defaultMessage={footerOkDefMsg}
                        style={[
                            textStyle.textNormal,
                            {
                                color:
                                    dialogType === 'warning' ?
                                        'red' :
                                        PRIMARY_TITLE_COLOR,
                            },
                        ]}
                    />
                </TouchableOpacity>
            </View>
        );
        return (
            <Modal
                visible={visible}
                animationType='fade'
                transparent={true}
                onRequestClose={() => {}}
            >
                <TouchableOpacity
                    style={styles.modalContainer}
                    onPress={() => this.close()}
                    activeOpacity={1}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        style={[styles.container]}
                        onPress={this.emptyFunction}
                    >
                        {headerComponent}
                        {contentComponent}
                        {footerComponent}
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        );
    }
}

export default ConfirmDialog;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    container: {
        width: Device.screen.width - 32,

        backgroundColor: '#FFF',
        borderRadius: 2,
    },
    footerBtnContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerContainer: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        height: 50,
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
        borderTopWidth: 0.5,
        borderTopColor: '#C4C4C4',
    },
    contentContainer: {
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    headerContainer: {
        paddingTop: 20,
        paddingBottom: 10,
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },

    separatorBtn: {
        width: 0.5,
        backgroundColor: '#C4C4C4',
    },

    title: {
        fontSize: FONT_SIZE_LARGE,
        color: PRIMARY_TITLE_COLOR,
        fontWeight: 'bold',
        alignSelf: 'center',
        paddingTop: 20,
    },

    content: {
        textAlign: 'center',
        alignSelf: 'center',
        paddingTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 16,
    },
});
