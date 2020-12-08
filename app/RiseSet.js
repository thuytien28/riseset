/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';

import {Provider} from 'react-redux';
import {injectIntl} from 'react-intl';

import Main from 'app/Main';
import {store} from 'app/store';

class RiseSet extends React.PureComponent<Props> {
    render() {
        return (
            <Provider store={store}>
                <Main/>
            </Provider>
        );
    }
}

export default injectIntl(RiseSet);
