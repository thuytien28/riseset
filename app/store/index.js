/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import AsyncStorage from '@react-native-community/async-storage';
import {createStore, applyMiddleware, compose} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';

import thunk from 'redux-thunk';
import rootReducer from 'app/reducers';
import initialState from 'app/initial_state';

import devTools from 'remote-redux-devtools';

const devToolsEnhancer =
    typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__ ? // eslint-disable-line no-underscore-dangle
        window.__REDUX_DEVTOOLS_EXTENSION__ : // eslint-disable-line no-underscore-dangle
        () => {
            return devTools({
                name: 'RisesetJournal',
                hostname: 'localhost',
                port: 5678,
                realtime: true,
            });
        };

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    blacklist: ['request', 'stories', 'locationStory', 'views', 'device'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(
    persistedReducer,
    initialState,
    compose(applyMiddleware(thunk), devToolsEnhancer()),
);
const persistor = persistStore(store);

export {store, persistor};
