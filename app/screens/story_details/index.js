/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import StoryDetails from 'app/screens/story_details/story_details';
import {getStory} from 'app/selectors/story';
import {deleteStory} from 'app/actions/storiesAction';

const mapStateToProps = (state, ownProps) => {
    const storyId = ownProps.navigation.state.params.storyId;
    const story = getStory(state, storyId);
    return {
        story,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
            deleteStory,
        }, dispatch),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(StoryDetails);