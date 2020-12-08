/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {connect} from 'react-redux';
import Content from './content';

const mapStateToProps = (state) => ({
    user: state.user.info,
});

const mapDispatchToProps = () => {
    return {
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Content);