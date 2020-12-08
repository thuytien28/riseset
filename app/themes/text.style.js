/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import Device from '../utils/device';

const PRIMARY_COLOR = '#000';

const textStyle = {
    textNormal: {
        fontFamily: Device.os === 'android' ? 'SF-Pro-Display' : null,
        fontSize: 15,
        color: PRIMARY_COLOR,
    },
    textNormalLight: {
        fontFamily: Device.os === 'android' ? 'SF-Pro-Display-Light' : null,
        fontSize: 15,
        fontWeight: '300',
        color: PRIMARY_COLOR,
    },
};

export default textStyle;
