/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SystemIcon from 'assets/icons/AppIcon';

class Icon extends React.PureComponent<Props> {
    static propTypes = {
        type: PropTypes.string,
        name: PropTypes.string,
        size: PropTypes.number,
        color: PropTypes.string,
    }

    static defaultProps = {
        size: 24,
        color: '#000',
    }
    render() {
        let AppIcon = Ionicons;
        const {type, name, size, color} = this.props;
        if (type === 'Ionicons') {
            AppIcon = Ionicons;
        } else if (type === 'AntDesign') {
            const AntDesign = require('react-native-vector-icons/AntDesign').
                default;
            AppIcon = AntDesign;
        } else if (type === 'Feather') {
            const Feather = require('react-native-vector-icons/Feather').
                default;
            AppIcon = Feather;
        } else if (type === 'FontAwesome') {
            const FontAwesome = require('react-native-vector-icons/FontAwesome').
                default;
            AppIcon = FontAwesome;
        } else if (type === 'Fontisto') {
            const Fontisto = require('react-native-vector-icons/Fontisto').
                default;
            AppIcon = Fontisto;
        }
        else if (type === 'System') {
            return (
                <SystemIcon
                    name={name}
                    size={size}
                    color={color}
                />
            );
        }
        return (
            <AppIcon
                name={name}
                size={size}
                color={color}
            />
        );
    }
}

export default Icon;
