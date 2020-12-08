/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';

import {Text} from 'react-native';
import {intlShape, injectIntl} from 'react-intl';

import PropTypes from 'prop-types';
import {connect} from 'react-redux';

class FormattedTime extends React.PureComponent {
    static propTypes = {
        value: PropTypes.any.isRequired,
        timeZone: PropTypes.string,
        children: PropTypes.func,
        hour12: PropTypes.bool,
        intl: intlShape.isRequired,
        style: PropTypes.object,
    };

    getFormattedTime = () => {
        const {value, timeZone, hour12, intl} = this.props;

        if (timeZone) {
            return intl.formatDate(value, {
                timeZone,
                hour: 'numeric',
                minute: 'numeric',
                hour12,
            });
        }

        // If no timezone is defined fallback to the previous implementation
        const date = new Date(value);
        const militaryTime = !hour12;
        let hour = militaryTime ? date.getHours() : date.getHours() % 12 || 12;
        let minute = date.getMinutes();
        minute = minute >= 10 ? minute : '0' + minute;
        hour = hour >= 10 ? hour : '0' + hour;
        let time = '';
        if (!militaryTime) {
            time = date.getHours() >= 12 ? ' PM' : ' AM';
        }

        return hour + ':' + minute + time;
    };

    render() {
        const {children, style} = this.props;
        const formattedTime = this.getFormattedTime();

        if (typeof children === 'function') {
            return children(formattedTime);
        }

        return <Text style={style}>{formattedTime}</Text>;
    }
}

const mapStateToProps = (state) => {
    return {
        locale: state.device.info.locale,
    };
};

export default connect(
    mapStateToProps,
    null
)(injectIntl(FormattedTime));
