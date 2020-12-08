/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Header from 'app/screens/profile/header/header';
import {getUserInfo} from 'app/selectors/user';
import {countStoriesAndImagesByUser} from 'app/actions/storiesAction';

const mapStateToProps = (state) => {    
    const count = state.stories.count;
    const userPicture = getUserInfo(state).picture;
    const username = getUserInfo(state).name;
    const user = getUserInfo(state);
    const isLogin  = state.user.isLogin;
    return {
        count,
        userPicture,
        username,
        user,
        isLogin,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
            countStoriesAndImagesByUser,
        }, dispatch),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Header);