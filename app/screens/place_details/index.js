/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {fetchStoriesByLocationId, resetStoryFetchByLocation, loadMoreLocationStories} from '../../actions/storiesAction';
import {resetStoriesMyPlaceDetails} from '../../actions/views/myPlaceDetails';
import PlaceDetails from './place_details';
import {getStoriesForLocation} from 'app/selectors/story';
import {getUserInfo} from 'app/selectors/user';

const mapStateToProps = (state, ownProps) => {
    const userId = getUserInfo(state).id;
    const stories = getStoriesForLocation(state, ownProps.navigation.state.params.placeDetail.id);
    return {
        userId,
        stories,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(
            {
                fetchStoriesByLocationId,
                resetStoriesMyPlaceDetails,
                resetStoryFetchByLocation,
                loadMoreLocationStories,
            },
            dispatch
        ),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PlaceDetails);