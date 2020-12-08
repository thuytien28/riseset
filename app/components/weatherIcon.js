/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import ClearDay from 'assets/icons/weatherIcon/clear_day';
import ClearNight from 'assets/icons/weatherIcon/clear_night';
import PartlyCloudyDay from 'assets/icons/weatherIcon/partly_cloudy_day';
import PartlyCloudyNight from 'assets/icons/weatherIcon/partly_cloudy_night';
import Rain from 'assets/icons/weatherIcon/rain';
import Snow from 'assets/icons/weatherIcon/snow';
import Sleet from 'assets/icons/weatherIcon/sleet';
import Wind from 'assets/icons/weatherIcon/wind';
import Fog from 'assets/icons/weatherIcon/fog';
import Cloudy from 'assets/icons/weatherIcon/cloudy';

const weatherIcons = {
    'clear-day': <ClearDay/>,
    'clear-night': <ClearNight/>,
    rain: <Rain/>,
    snow: <Snow/>,
    sleet: <Sleet/>,
    wind: <Wind/>,
    fog: <Fog/>,
    cloudy: <Cloudy/>,
    'partly-cloudy-day': <PartlyCloudyDay/>,
    'partly-cloudy-night': <ClearDay/>,
};

export default weatherIcons;