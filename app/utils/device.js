/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {Platform} from 'react-native';
import * as RNLocalize from 'react-native-localize';
import moment from 'moment';
import {ScreenTypes} from 'app/constants';

const Device = {
    os: Platform.OS,
    isPad: Platform.isPad,
    locale: RNLocalize.getLocales()[0].languageCode,
    timeZone: RNLocalize.getTimeZone(),
    timeZoneOffset: getDeviceUTCOffset(),
    screen: {
        width: ScreenTypes.SCREEN_WIDTH,
        height: ScreenTypes.SCREEN_HEIGHT,
        fontScale: ScreenTypes.FONT_SCALE,
    },
    country: RNLocalize.getCountry(),
};

function getDeviceUTCOffset() {
    return moment().utcOffset() / 60;
}

export default Device;
