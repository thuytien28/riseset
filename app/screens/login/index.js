/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {createUser} from 'app/actions/user';
import Login from './login';
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
                createUser,
            },
            dispatch
        ),
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
