/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {Dimensions, Platform, StatusBar} from 'react-native';
import Device from './device';

const X_WIDTH = 375;
const X_HEIGHT = 812;

const XSMAX_WIDTH = 414; // XR, 11 Pro Max, 11 Pro
const XSMAX_HEIGHT = 896;

const {height: W_HEIGHT, width: W_WIDTH} = Dimensions.get('window');

export const isIPhoneX = () => {
    let check = false;
    if (Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS) {
        check = (W_WIDTH === X_WIDTH && W_HEIGHT === X_HEIGHT) ||
            (W_WIDTH === XSMAX_WIDTH && W_HEIGHT === XSMAX_HEIGHT);
    }
    return check;
};

export const getStatusBarHeight = () => {
    if (Platform.OS === 'ios') {
        return isIPhoneX() ? 44 : 20;
    }

    if (Platform.OS === 'android') {
        if (StatusBar.currentHeight) {
            return StatusBar.currentHeight;
        }
        return 54;
    }

    if (Device.isPad) {
        return 0;
    }
};