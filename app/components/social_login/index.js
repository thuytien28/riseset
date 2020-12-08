/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {login, logout, createUser, fetchUser, updateFcmToken, updateUserLocale} from 'app/actions/user';
import SocialLogin from './social_login';
import {getUserInfo} from 'app/selectors/user';

const mapStateToProps = (state) => {
    const user = getUserInfo(state);

    return {
        user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(
            {
                login,
                logout,
                createUser,
                fetchUser,
                updateFcmToken,
                updateUserLocale,
            },
            dispatch
        ),
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SocialLogin);
