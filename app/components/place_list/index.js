/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {fetchLocationsStory, loadMoreLocations} from 'app/actions/location';
import PlaceList from './place_list';
import {getUserInfo} from 'app/selectors/user';
import {getLocationStory} from 'app/selectors/location_story';

const mapStateToProps = (state, ownProps) => {
    const locationStory = getLocationStory(state);
    const userId = getUserInfo(state).id;

    if (!ownProps.isLoadMore) {
        locationStory.splice(5);
    }
    return {
        locationStory,
        userId,
        loadingMore: state.request.loadMoreLocations.loading,
        isListEnd: state.views.placeList.isListEnd,
        loadingStatus: state.request.fetchLocations.loading,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(
            {
                fetchLocationsStory,
                loadMoreLocations,
            },
            dispatch
        ),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PlaceList);