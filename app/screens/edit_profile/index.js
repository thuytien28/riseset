/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import EditProfile from './edit_profile';
import {updateProfile} from 'app/actions/user';

const mapStateToProps = (state) => ({
    user: state.user.info,
    updateProfile: state.request.updateProfile,
});

const mapDispatchToProps = (dispatch) => {
    return {

        actions: bindActionCreators(
            {
                updateProfile,
            },
            dispatch
        ),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(EditProfile);