/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {fetchStoriesByUserId, loadMoreUserStories} from 'app/actions/storiesAction';
import {fetchQuoteIfNecessary} from 'app/actions/quote';
import Home from './home';
import {getStoriesForUser} from 'app/selectors/story';
import {getUserInfo} from 'app/selectors/user';
import {updateUserLocale} from 'app/actions/user';

const mapStateToProps = (state) => {
    const user = getUserInfo(state);
    const stories = getStoriesForUser(state);
    const loadingStatus = state.request.fetchStories.loading;
    const currentQuote = state.currentQuote;
    return {
        user,
        stories,
        loadingStatus,
        currentQuote,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(
            {
                fetchStoriesByUserId,
                loadMoreUserStories,
                fetchQuoteIfNecessary,
                updateUserLocale,
            },
            dispatch
        ),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Home);