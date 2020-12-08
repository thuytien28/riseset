/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import {Text} from 'react-native';

import {IntlProvider} from 'react-intl';

import {AppearanceProvider} from 'react-native-appearance';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import Device from './app/utils/device';
import {getTranslations} from './app/i18n';

import RiseSet from './app/RiseSet';
import 'moment-timezone';

// import {requestNotifications} from 'react-native-permissions';

class App extends React.PureComponent {
    render() {
        return (
            <AppearanceProvider>
                <SafeAreaProvider>
                    <IntlProvider
                        ref='provider'
                        locale={Device.locale}
                        timeZone={Device.timeZone}
                        messages={getTranslations(Device.locale)}
                        textComponent={Text}
                    >
                        <RiseSet/>
                    </IntlProvider>
                </SafeAreaProvider>
            </AppearanceProvider>
        );
    }
}

export default App;
