/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    FlatList,
} from 'react-native';

import PropTypes from 'prop-types';
import FormattedText from 'app/components/formatted_text';
import textStyle from 'app/themes/text.style';
import Device from 'app/utils/device';

class OptionsDialog extends React.PureComponent {
    static propTypes = {};

    static defaultProps = {};
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
    }
    componentDidMount() {
        if (this.props.optionsDlg) {
            this.props.optionsDlg(this);
        }
    }

    open = () => {
        this.setState({visible: true});
    };

    close = () => {
        this.setState({visible: false});
    };

    onItem = (item) => {
        this.props.onSeletedItem(item);

        // this.close();
    };

    renderItem = (item) => {
        return (
            <TouchableOpacity
                key={item.id}
                style={styles.itemContainer}
                onPress={() => this.onItem(item)}
                activeOpacity={0.7}
            >
                <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}
                    style={textStyle.textNormal}
                >
                    <FormattedText
                        id={item.titleId || item.name}
                        defaultMessage={item.titleDefMsg || item.name}
                    />
                </Text>
            </TouchableOpacity>
        );
    };

    render() {
        const {visible} = this.state;
        const {data} = this.props;
        const isScrollEnabled = data.length > 10;

        return (
            <Modal
                visible={visible}
                animationType='fade'
                transparent={true}
                onRequestClose={() => { }}
            >
                <TouchableOpacity
                    style={styles.modalContainer}
                    onPress={() => this.close()}
                    activeOpacity={1}
                >
                    {data.map((item) => {
                        return this.renderItem(item);
                    })}
                </TouchableOpacity>
            </Modal>
        );
    }
}

export default OptionsDialog;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
        paddingHorizontal: 16,
    },
    itemContainer: {
        backgroundColor: '#FFF',
        height: 50,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    contentContainer: {
        flex: 1,
        width: Device.screen.width - 32,
        borderRadius: 2,

        // justifyContent: 'center',
    },
});
