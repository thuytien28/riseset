/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {connect} from 'react-redux';

import Header from './header';
import {getUserInfo} from 'app/selectors/user';

const mapStateToProps = (state) => {
    const userPicture = getUserInfo(state).picture;
    return {
        userPicture,
    };
};

export default connect(
    mapStateToProps,
    null,
)(Header);