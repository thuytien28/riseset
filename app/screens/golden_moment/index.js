/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {updateUser, updateUserLocation} from 'app/actions/user';
import GoldenMoment from './golden_moment';
import {getUserInfo, getUserLocation} from 'app/selectors/user';

const mapStateToProps = (state) => {
    const user = getUserInfo(state);
    const location = getUserLocation(state);

    return {
        user,
        location,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(
            {
                updateUser,
                updateUserLocation,
            },
            dispatch
        ),
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GoldenMoment);
