/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {QuoteType, UserTypes} from 'app/action_types';

const currentQuote = (state = {}, action) => {
    switch (action.type) {
    case QuoteType.QUOTE_FETCH_SUCCESS: {
        return Object.assign({}, state, action.data);
        // return {
        //     quote: action.data.data.content,
        //     author: action.data.data.author,
        //     lastQueryTime: action.data.lastQueryTime,
        //     newQuoteTime: action.data.newQuoteTime,
        // };
    }

    case QuoteType.QUOTE_FETCH_BY_PRESS_NOTI_SUCCESS: {
        return Object.assign({}, state, action.data);
    }

    case UserTypes.LOGOUT_SUCCESS:
        return {};
    }

    return state;
};

export default currentQuote;