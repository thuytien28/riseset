/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import {Text} from 'react-native';

import {injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import AppText from './app_text';

class FormattedDate extends React.PureComponent {
    static propTypes = {
        intl: intlShape.isRequired,
        value: PropTypes.any.isRequired,
        format: PropTypes.string,
        children: PropTypes.func,
    };
    static defaultProps = {
        fontText: 'SF-Pro-Display-Regular',
        adjustsFontSizeToFit: false,
    }

    render() {
        const {intl, value, fontText, style, children, ...props} = this.props;

        // Reflect.deleteProperty(props, 'format');
        delete props['format'];

        const formattedDate = intl.formatDate(value, this.props);

        if (typeof children === 'function') {
            return children(formattedDate);
        }

        // return <Text {...props}>{formattedDate}</Text>;

        return (
            <AppText
                fontText={fontText}
                value={formattedDate}
                style={style}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        locale: state.device.info.locale || 'en',
        timeZone: state.device.info.timeZone,
    };
};

export default connect(
    mapStateToProps,
    null
)(injectIntl(FormattedDate));
