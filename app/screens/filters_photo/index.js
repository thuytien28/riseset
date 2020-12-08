/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {connect} from 'react-redux';

import FiltersPhoto from './filters_photo';
import {getUserInfo, getUserSignature} from '../../selectors/user';

const mapStateToProps = (state) => {
    const user = getUserInfo(state);
    const userSignature = getUserSignature(state);
    return {
        user,
        userSignature,
    };
};

export default connect(
    mapStateToProps,
    null,
)(FiltersPhoto);