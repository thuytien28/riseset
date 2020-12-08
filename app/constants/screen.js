/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {Dimensions, StatusBar, Platform} from 'react-native';

export default {
    ANDROID_TOP_LANDSCAPE: 46,
    ANDROID_TOP_PORTRAIT: 56,
    IOS_TOP_LANDSCAPE: 32,
    IOS_TOP_PORTRAIT: 64,
    IOSX_TOP_PORTRAIT: 88,
    STATUS_BAR_HEIGHT: 20,
    SCREEN_WIDTH: Dimensions.get('window').width,
    SCREEN_HEIGHT: Dimensions.get('window').height,
    FONT_SCALE: Dimensions.get('window').fontScale,
};