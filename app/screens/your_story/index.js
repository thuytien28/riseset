/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {addStory, completeAddStory, updateStory} from 'app/actions/storiesAction';
import {addLocation} from 'app/actions/location';
import YourStory from './your_story';

const mapStateToProps = (state) => ({
    user: state.user,
    newStory: state.request.newStory,
    editStory: state.request.editStory,
});

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(
            {
                addStory,
                addLocation,
                completeAddStory,
                updateStory,
            },
            dispatch
        ),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(YourStory);