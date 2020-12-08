/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {fetchLocation} from 'app/actions/location';
import MapDiscover from './map_discover';

const mapStateToProps = (state) => {
    const locationDetails = state.locationDetails;
    const loading = state.request.fetchLocation.loading;
    return {
        locationDetails,
        loading,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(
            {
                fetchLocation,
            },
            dispatch
        ),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(MapDiscover);