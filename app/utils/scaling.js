/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {PixelRatio} from 'react-native';
import {ScreenTypes} from 'app/constants';

// screen sizes are based on standard iphone 6 (375 x 667) screen mobile device
const BASE_SCREEN_WIDTH = 375;
const BASE_SCREEN_HEIGHT = 667;

const scale = (size) => (ScreenTypes.SCREEN_WIDTH / BASE_SCREEN_WIDTH) * size;
const verticalScale = (size) =>
    (ScreenTypes.SCREEN_HEIGHT / BASE_SCREEN_HEIGHT) * size;
const moderateScale = (size, factor = 0.5) =>
    size + (scale(size) - size) * factor;

export {scale, verticalScale, moderateScale};
