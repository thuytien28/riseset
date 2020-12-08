/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {resetLoadMoreLocations} from 'app/actions/views/place_list';
import PlaceList from './place_list';

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
            resetLoadMoreLocations,
        }, dispatch),
    };
};
export default connect(null, mapDispatchToProps)(PlaceList);