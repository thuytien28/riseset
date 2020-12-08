/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {logout} from 'app/actions/user';
import LogoutButton from './logout_button';
import {getUserInfo} from 'app/selectors/user';

const mapStateToProps = (state) => {
    return {
        providerId: getUserInfo(state).providerId,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(
            {
                logout,
            },
            dispatch
        ),
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LogoutButton);
